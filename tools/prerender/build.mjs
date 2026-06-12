// Prerender: renders the browser-global JSX pages to static HTML so
// crawlers see real content with zero runtime Babel or dev React.
// Phase 1 of the SEO recovery (see Veldra Site/SEO-DIAGNOSTIC.md).
//
// Usage:  node tools/prerender/build.mjs [--lang en]
// Output: tools/prerender/dist/...  (en at root; es/, zh/ subtrees later)
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

const LANGS = process.argv.includes("--lang")
  ? [process.argv[process.argv.indexOf("--lang") + 1]]
  : ["en"];

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

  const outDir = lang === "en" ? join(DIST, dirname(page)) : join(DIST, lang, dirname(page));
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, page.split("/").pop());
  writeFileSync(outPath, out);

  const text = markup.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return { outPath, bytes: out.length, textChars: text.length, probe: text.slice(0, 90) };
}

let failures = 0;
for (const lang of LANGS) {
  for (const page of PAGES) {
    try {
      const t0 = Date.now();
      const r = renderPage(page, lang);
      console.log(
        `[prerender] ${lang}/${page} -> ${r.textChars} text chars, ${r.bytes}b, ${Date.now() - t0}ms`
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
console.log("[prerender] done");
