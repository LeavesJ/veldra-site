// Prerender: renders the browser-global JSX pages to static HTML so
// crawlers see real content with zero runtime Babel or dev React.
// Phase 1 of the SEO recovery (see Veldra Site/SEO-DIAGNOSTIC.md).
//
// Usage:  node tools/prerender/build.mjs [--lang en] [--page index]
// Output: tools/prerender/dist/<page>  (en at root; es/, zh/ subtrees)
//
// Model: each page shell loads shared/i18n.js plus component scripts
// that define globals (window.VariantLayers etc.). We rebuild that
// world in a node:vm sandbox: esbuild-transform the JSX, execute the
// scripts in order with React injected, then renderToStaticMarkup the
// page root and inject it into the shell's <div id="root">.

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

// Page map, extended as pages prove out. `root` is the window-attached
// component the shell's inline bootstrap mounts. `keepRuntime` pages
// (auth, status) retain their scripts for interactivity at a later
// hydration pass; v1 renders everything static.
const PAGES = [
  { src: "index.html", scripts: ["shared/i18n.js", "variants/layers.jsx"], root: "VariantLayers", out: "index.html" },
];

const LANGS = (process.argv.includes("--lang")
  ? [process.argv[process.argv.indexOf("--lang") + 1]]
  : ["en"]); // es, zh join after the en path proves out

function makeSandbox(lang) {
  const storage = new Map();
  const window = {
    __lang: lang,
    addEventListener() {}, removeEventListener() {},
    dispatchEvent() { return true; },
    matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
    requestAnimationFrame: (cb) => 0,
    cancelAnimationFrame() {},
    setTimeout: () => 0, clearTimeout() {}, setInterval: () => 0, clearInterval() {},
    location: { pathname: "/", href: "https://veldra.org/" },
    navigator: { language: lang },
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
      getElementById: () => null,
      createElement: () => ({ style: {}, setAttribute() {} }),
      documentElement: { lang, style: { setProperty() {} } },
      title: "",
    },
    navigator: window.navigator,
    CustomEvent: class CustomEvent { constructor(type, opts) { this.type = type; this.detail = opts && opts.detail; } },
    console,
    React,
    setTimeout: window.setTimeout, clearTimeout: window.clearTimeout,
    setInterval: window.setInterval, clearInterval: window.clearInterval,
    requestAnimationFrame: window.requestAnimationFrame,
    cancelAnimationFrame: window.cancelAnimationFrame,
  };
  sandbox.globalThis = sandbox;
  return vm.createContext(sandbox);
}

function execScript(ctx, path) {
  const raw = readFileSync(join(SITE, path), "utf8");
  const isJsx = path.endsWith(".jsx");
  const code = isJsx
    ? transformSync(raw, { loader: "jsx", jsx: "transform", jsxFactory: "React.createElement", jsxFragment: "React.Fragment" }).code
    : raw;
  vm.runInContext(code, ctx, { filename: path });
  // Browser semantics: properties assigned onto window become bare
  // globals for later scripts (window.t -> t). Mirror after each script.
  vm.runInContext(
    'for (const k of Object.keys(window)) { if (!(k in globalThis)) globalThis[k] = window[k]; }',
    ctx, { filename: "<window-mirror>" }
  );
}

function renderPage(page, lang) {
  const ctx = makeSandbox(lang);
  for (const s of page.scripts) execScript(ctx, s);
  const Root = ctx.window[page.root];
  if (!Root) throw new Error(`${page.src}: window.${page.root} not defined after scripts`);
  const markup = renderToStaticMarkup(React.createElement(Root));

  let shell = readFileSync(join(SITE, page.src), "utf8");
  // Inject rendered markup.
  shell = shell.replace('<div id="root"></div>', `<div id="root">${markup}</div>`);
  // Static v1: strip runtime React/Babel CDN tags, text/babel scripts,
  // and the now-baked i18n/bootstrap. Keep stylesheets and fonts.
  shell = shell
    .replace(/^\s*<script src="https:\/\/unpkg\.com\/[^"]+"[^>]*><\/script>\n?/gm, "")
    .replace(/<script type="text\/babel"[\s\S]*?<\/script>\n?/g, "")
    .replace(/^\s*<script src="shared\/i18n\.js"><\/script>\n?/gm, "")
    .replace(/^\s*<script src="shared\/scroll-effects\.js" defer><\/script>\n?/gm, "");

  const outDir = lang === "en" ? DIST : join(DIST, lang);
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, page.out);
  writeFileSync(outPath, shell);
  return { outPath, bytes: shell.length, textProbe: markup.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 160) };
}

for (const lang of LANGS) {
  for (const page of PAGES) {
    const t0 = Date.now();
    const r = renderPage(page, lang);
    console.log(`[prerender] ${lang}/${page.src} -> ${r.outPath} (${r.bytes}b, ${Date.now() - t0}ms)`);
    console.log(`[probe] ${r.textProbe}`);
  }
}
console.log("[prerender] done");
