// Prerender: renders the browser-global JSX pages to static HTML so
// crawlers see real content with zero runtime Babel or dev React.
// Phase 1 of the SEO recovery (see Veldra Site/SEO-DIAGNOSTIC.md).
//
// Usage:  node tools/prerender/build.mjs [--lang en|es|zh|all]
// Output: tools/prerender/dist/...  (en at root, es/ and zh/ subtrees)
//
// Default is ALL languages. Building en alone leaves es/zh invisible to
// search, which is root cause #6 in the SEO diagnostic.
//
// Model: each page shell loads shared scripts that define window-global
// components, then an inline <script type="text/babel"> bootstrap that
// mounts a root element via ReactDOM.createRoot(...).render(<App/>).
// We rebuild that world in a node:vm sandbox: esbuild-transform every
// local script plus the page's own inline bootstrap, execute them in
// order with React injected and a createRoot shim that CAPTURES the
// rendered element instead of mounting it, then renderToStaticMarkup
// the captured element and inject it into the shell's root div. No
// per-page component map needed: the page's own bootstrap is the truth.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { transformSync } from "esbuild";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE = resolve(__dirname, "../..");
const DIST = join(__dirname, "dist");

// Indexable content pages, rendered fully static (runtime React chain
// stripped). Auth pages and the status page stay client-rendered for
// now: auth is noindexed and form-driven; status fetches live JSON.
const PAGES = [
  "index.html",
  "architecture.html",
  "docs.html",
  "failure-atlas.html",
  "product.html",
  "questions.html",
  "404.html",
  "legal/about.html",
  "legal/contact.html",
  "legal/disclaimer.html",
  "legal/license.html",
  "legal/privacy.html",
  "legal/terms.html",
];

const ALL_LANGS = ["en", "es", "zh"];
const ORIGIN = "https://veldra.org";

// Directories shared by every language tree. They are NOT duplicated per
// language, so a subtree page must reference the root copies absolutely.
const SHARED_DIRS = ["styles", "assets", "shared"];

const langArg = process.argv.includes("--lang")
  ? process.argv[process.argv.indexOf("--lang") + 1]
  : "all";
if (!langArg || (langArg !== "all" && !ALL_LANGS.includes(langArg))) {
  console.error(`[prerender] --lang must be one of: ${ALL_LANGS.join(", ")}, all`);
  process.exit(2);
}
const LANGS = langArg === "all" ? ALL_LANGS : [langArg];

// Pages whose <title> and meta description come from i18n, so the head
// localises with the body. Without this a translated page ships an English
// title and description, which is what search results and link unfurls show.
const PAGE_META = {
  "index.html": "home",
  "architecture.html": "arch",
  "docs.html": "docs",
  "failure-atlas.html": "atlas",
  "product.html": "prod",
  "questions.html": "qa",
};

// Sitemap priorities, preserving the scheme already published.
const PRIORITY = { "index.html": "1.0", "product.html": "0.9" };

const escText = (v) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escAttr = (v) => escText(v).replace(/"/g, "&quot;");

// Read a translated string out of the page's own sandbox. i18n.js is
// executed during render (only scroll-effects is skipped), so `t` is live.
// A miss returns null rather than the key, so a typo cannot silently ship
// "home.page.title" as a page title.
function tr(ctx, key) {
  ctx.__lookupKey = key;
  const v = vm.runInContext(
    'typeof t === "function" ? t(__lookupKey) : null', ctx, { filename: "<i18n-lookup>" }
  );
  return typeof v === "string" && v.length > 0 && v !== key ? v : null;
}

function rewriteMeta(out, page, ctx) {
  const prefix = PAGE_META[page];
  if (!prefix) return out;
  const title = tr(ctx, `${prefix}.page.title`);
  const desc = tr(ctx, `${prefix}.page.meta`);
  if (title) out = out.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escText(title)}</title>`);
  if (desc) {
    const tag = `<meta name="description" content="${escAttr(desc)}">`;
    out = /<meta name="description"[^>]*>/i.test(out)
      ? out.replace(/<meta name="description"[^>]*>/i, tag)
      : out.replace(/<\/title>/i, `</title>\n${tag}`);
  }
  return out;
}

// Extensionless site path for a page, per the canonical form decided
// 2026-06-09. null means "no canonical" (error pages must not claim one,
// and must not appear in an hreflang cluster).
function pagePath(page) {
  if (page === "404.html") return null;
  if (page === "index.html") return "/";
  return "/" + page.replace(/\.html$/, "");
}

function langUrl(page, lang) {
  const p = pagePath(page);
  if (p === null) return null;
  if (lang === "en") return ORIGIN + p;
  return ORIGIN + "/" + lang + (p === "/" ? "/" : p);
}

// <html lang>, canonical, and a reciprocal hreflang cluster. Without these
// a translated subtree is worse than no subtree: Spanish content declaring
// itself English and canonicalising to the English URL is duplicate content,
// and Google folds it away.
function rewriteHead(out, page, lang) {
  out = out.replace(/<html([^>]*?)\slang="[^"]*"/i, `<html$1 lang="${lang}"`);

  const self = langUrl(page, lang);
  if (self === null) return out;

  const canonical = `<link rel="canonical" href="${self}" />`;
  const alts = ALL_LANGS
    .map((l) => `<link rel="alternate" hreflang="${l}" href="${langUrl(page, l)}" />`)
    .concat(`<link rel="alternate" hreflang="x-default" href="${langUrl(page, "en")}" />`)
    .join("\n");

  if (/<link rel="canonical"[^>]*>/i.test(out)) {
    out = out.replace(/<link rel="canonical"[^>]*>/i, `${canonical}\n${alts}`);
  } else {
    out = out.replace(/<\/title>/i, `</title>\n${canonical}\n${alts}`);
  }
  return out;
}

// Repoint shared assets at the root copies, keep navigation inside the
// language tree, and drop `../` on root-level pages (where it only ever
// worked because browsers clamp it at the origin, and where it silently
// escapes the language subtree).
function rewriteLinks(out, page, lang) {
  const depth = page.split("/").length - 1;
  if (depth === 0) out = out.split('"../').join('"');
  if (lang === "en") return out;

  const up = "../".repeat(depth);
  for (const dir of SHARED_DIRS) {
    out = out.split(`"${up}${dir}/`).join(`"/${dir}/`);
  }
  out = out.split('href="/"').join(`href="/${lang}/"`);
  return out;
}

function makeSandbox(lang, capture) {
  const storage = new Map();
  const window = {
    __lang: lang,
    addEventListener() {}, removeEventListener() {},
    dispatchEvent() { return true; },
    matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
    requestAnimationFrame: () => 0,
    cancelAnimationFrame() {},
    setTimeout: () => 0, clearTimeout() {}, setInterval: () => 0, clearInterval() {},
    location: { pathname: "/", href: "https://veldra.org/" },
    navigator: { language: lang },
    scrollTo() {},
  };
  window.window = window;
  const sandbox = {
    window,
    localStorage: {
      getItem: (k) => (storage.has(k) ? storage.get(k) : null),
      setItem: (k, v) => storage.set(k, String(v)),
      removeItem: (k) => storage.delete(k),
    },
    document: {
      querySelector: () => null,
      querySelectorAll: () => [],
      addEventListener() {},
      getElementById: () => ({ id: "root" }),
      createElement: () => ({ style: {}, setAttribute() {} }),
      documentElement: { lang, style: { setProperty() {} } },
      title: "",
      body: { dataset: {} },
    },
    navigator: window.navigator,
    CustomEvent: class CustomEvent {
      constructor(type, opts) { this.type = type; this.detail = opts && opts.detail; }
    },
    console,
    React,
    // The capture shim: render() records the element tree instead of
    // mounting. Pages call ReactDOM.createRoot(el).render(<App/>).
    ReactDOM: {
      createRoot: () => ({ render: (node) => capture(node) }),
    },
    fetch: () => Promise.resolve({ ok: false, json: () => Promise.resolve({}) }),
    setTimeout: window.setTimeout, clearTimeout: window.clearTimeout,
    setInterval: window.setInterval, clearInterval: window.clearInterval,
    requestAnimationFrame: window.requestAnimationFrame,
    cancelAnimationFrame: window.cancelAnimationFrame,
  };
  sandbox.globalThis = sandbox;
  return vm.createContext(sandbox);
}

// Keys the mirror must never clobber: the sandbox's own machinery.
const PROTECTED_GLOBALS = new Set([
  "window", "document", "localStorage", "navigator", "console", "React",
  "ReactDOM", "CustomEvent", "fetch", "globalThis", "setTimeout",
  "clearTimeout", "setInterval", "clearInterval", "requestAnimationFrame",
  "cancelAnimationFrame",
]);

function runInCtx(ctx, code, filename, isJsx) {
  const transformed = isJsx
    ? transformSync(code, {
        loader: "jsx", jsx: "transform",
        jsxFactory: "React.createElement", jsxFragment: "React.Fragment",
      }).code
    : code;
  // Browser model (babel-standalone): each text/babel script executes in
  // an ISOLATED scope; cross-script sharing happens only via window
  // properties (components.jsx and page-shell.jsx both declare
  // `const SiteFooter`, which would collide in a shared lexical scope,
  // and page-shell's window attachment deliberately overrides).
  vm.runInContext(`(function () {\n${transformed}\n})();`, ctx, { filename });
  // Then window properties become bare globals for later scripts
  // (window.t -> t), with later attachments overriding earlier ones,
  // matching global-object lookup semantics in a real browser.
  ctx.__PROTECTED = PROTECTED_GLOBALS;
  vm.runInContext(
    "for (const k of Object.keys(window)) { if (!__PROTECTED.has(k)) globalThis[k] = window[k]; }",
    ctx, { filename: "<window-mirror>" }
  );
}

function extractLocalScripts(shell) {
  // src'd scripts, in order; skip CDN (unpkg) and browser-only effects.
  const srcs = [];
  const re = /<script[^>]*\ssrc="([^"]+)"[^>]*>/g;
  let m;
  while ((m = re.exec(shell)) !== null) {
    const src = m[1];
    if (src.startsWith("http")) continue;
    if (src.endsWith("scroll-effects.js")) continue;
    srcs.push(src);
  }
  return srcs;
}

function extractInlineBootstrap(shell) {
  // The page's own mounting script: <script type="text/babel" ...>code</script>
  // without a src attribute.
  const re = /<script type="text\/babel"(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g;
  let m;
  const blocks = [];
  while ((m = re.exec(shell)) !== null) blocks.push(m[1]);
  return blocks;
}

function renderPage(page, lang) {
  const pageDir = dirname(join(SITE, page));
  const shell = readFileSync(join(SITE, page), "utf8");

  let captured = null;
  const ctx = makeSandbox(lang, (node) => { captured = node; });

  for (const src of extractLocalScripts(shell)) {
    const path = resolve(pageDir, src);
    runInCtx(ctx, readFileSync(path, "utf8"), src, src.endsWith(".jsx"));
  }
  for (const block of extractInlineBootstrap(shell)) {
    runInCtx(ctx, block, `${page}#inline`, true);
  }
  if (!captured) throw new Error(`${page}: bootstrap captured no root element`);

  const markup = renderToStaticMarkup(captured);

  // Inject into the root div whatever its attribute shape (product.html
  // carries data-screen-label, for example). Fail fast on a miss: a
  // silent no-op here ships an empty page, the exact bug class this
  // tool exists to kill.
  const rootRe = /(<div id="root"[^>]*>)(<\/div>)/;
  if (!rootRe.test(shell)) {
    throw new Error(`${page}: no empty <div id="root"...></div> found in shell`);
  }
  let out = shell.replace(rootRe, `$1${markup}$2`);
  if (!out.includes(markup)) {
    throw new Error(`${page}: markup injection failed`);
  }
  // Static output: strip the runtime chain (CDN React/Babel, text/babel
  // scripts including the bootstrap, i18n and scroll-effects tags).
  out = out
    .replace(/^\s*<script src="https:\/\/unpkg\.com\/[^"]+"[^>]*><\/script>\n?/gm, "")
    .replace(/<script type="text\/babel"[\s\S]*?<\/script>\n?/g, "")
    .replace(/^\s*<script src="[^"]*i18n\.js"><\/script>\n?/gm, "")
    .replace(/^\s*<script src="[^"]*scroll-effects\.js" defer><\/script>\n?/gm, "");

  out = rewriteMeta(out, page, ctx);
  out = rewriteHead(out, page, lang);
  out = rewriteLinks(out, page, lang);

  // Fail fast, same reasoning as the injection guard above: a subtree that
  // ships with the wrong lang or an English canonical is duplicate content,
  // and the failure is invisible until an index drops.
  const declared = /<html[^>]*\slang="([^"]*)"/i.exec(out);
  if (!declared || declared[1] !== lang) {
    throw new Error(`${page}: <html lang> is "${declared && declared[1]}", expected "${lang}"`);
  }
  const expected = langUrl(page, lang);
  if (expected !== null) {
    if (!out.includes(`<link rel="canonical" href="${expected}" />`)) {
      throw new Error(`${page}: canonical is not ${expected}`);
    }
    if (!out.includes('hreflang="x-default"')) {
      throw new Error(`${page}: hreflang cluster missing`);
    }
  }

  const outDir = lang === "en" ? join(DIST, dirname(page)) : join(DIST, lang, dirname(page));
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, page.split("/").pop());
  writeFileSync(outPath, out);

  const text = markup.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return {
    outPath, bytes: out.length, textChars: text.length,
    canonical: expected, probe: text.slice(0, 90),
  };
}

let failures = 0;
for (const lang of LANGS) {
  for (const page of PAGES) {
    try {
      const t0 = Date.now();
      const r = renderPage(page, lang);
      console.log(
        `[prerender] ${lang}/${page} -> ${r.textChars} text chars, ${r.bytes}b, ${Date.now() - t0}ms  canonical=${r.canonical ?? "(none)"}`
      );
      console.log(`  [probe] ${r.probe}`);
    } catch (e) {
      failures += 1;
      console.error(`[prerender] FAIL ${lang}/${page}: ${e.message}`);
    }
  }
}
if (failures > 0) {
  console.error(`[prerender] ${failures} page(s) failed`);
  process.exit(1);
}

// Sitemap, generated rather than hand-maintained. The published one went
// stale the moment the URL set changed: five of its eight URLs 404'd while
// the real pages went unlisted, which actively misdirected recrawls.
// Only emitted on a full build, so a `--lang en` run cannot overwrite a
// complete sitemap with an English-only one.
if (LANGS.length === ALL_LANGS.length) {
  const lastmod = new Date().toISOString().slice(0, 10);
  const entries = PAGES.filter((p) => pagePath(p) !== null).map((page) => {
    const alts = ALL_LANGS
      .map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${langUrl(page, l)}"/>`)
      .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${langUrl(page, "en")}"/>`)
      .join("\n");
    // One <url> per language, each carrying the full alternate cluster, per
    // the sitemap protocol's localisation guidance.
    return ALL_LANGS.map((l) =>
      [`  <url>`,
       `    <loc>${langUrl(page, l)}</loc>`,
       alts,
       `    <lastmod>${lastmod}</lastmod>`,
       `    <changefreq>weekly</changefreq>`,
       `    <priority>${PRIORITY[page] || "0.8"}</priority>`,
       `  </url>`].join("\n")
    ).join("\n");
  }).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries}
</urlset>
`;
  writeFileSync(join(DIST, "sitemap.xml"), xml);
  const count = (xml.match(/<loc>/g) || []).length;
  console.log(`[prerender] sitemap.xml -> ${count} URLs across ${ALL_LANGS.join(", ")}`);
} else {
  console.log(`[prerender] sitemap skipped (partial build: ${LANGS.join(", ")})`);
}

console.log("[prerender] done");
