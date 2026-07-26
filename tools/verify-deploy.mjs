// Deploy gate. Runs against an assembled _site tree and refuses to publish
// anything that repeats a failure this site has already had.
//
// Usage:  node tools/verify-deploy.mjs _site
//
// Every check here exists because the thing it catches actually happened:
//   - CRAWLABLE   veldra.org shipped 13 to 43 characters of crawlable text
//                 per page for twelve days and Google fully deindexed it.
//                 A prerender that silently no-ops looks fine to a human.
//   - NO_RUNTIME  the deindex cause was runtime Babel. If a text/babel tag
//                 survives into an indexable page, the fix did not apply.
//   - CANONICAL   a translated subtree that canonicalises to English is
//                 duplicate content; Google folds it away silently.
//   - HOSTING     a missing CNAME or .nojekyll breaks the domain or the
//                 underscore paths, with no error anywhere.
//   - PRIVATE     this repo is served wholesale. Internal docs must not ship.

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = process.argv[2] || "_site";
const LANGS = ["en", "es", "zh"];
// Pages carrying real marketing or documentation copy. 404 is excluded from
// the canonical rule (an error page must not claim one) but still must not
// ship a runtime chain.
const INDEXABLE = [
  "index.html", "architecture.html", "docs.html", "failure-atlas.html",
  "product.html", "questions.html",
  "legal/about.html", "legal/contact.html", "legal/disclaimer.html",
  "legal/license.html", "legal/privacy.html", "legal/terms.html",
];
// Floor, not a target. The deindexed state was 13-43 chars; the real pages
// render 850-20,000. Anything under this means the prerender did not run.
const MIN_TEXT_CHARS = 600;

const MUST_EXIST = ["CNAME", ".nojekyll", "robots.txt", "sitemap.xml", "styles/shared.css"];
const MUST_NOT_SHIP = ["DEV-STATUS.md", "PRODUCT.md", "AUDIT.md", "SEO-DIAGNOSTIC.md"];
// Directories that are gitignored, so a CI checkout never has them, but that
// a local rsync assembly WILL copy: rsync does not read .gitignore. The
// telemetry one carries absolute local paths.
const MUST_NOT_SHIP_DIRS = [".claude-flow", "node_modules", ".git", ".github"];

const fail = [];
const note = (m) => console.log(`  ${m}`);

function crawlableText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pageUrl(page, lang) {
  const p = page === "index.html" ? "/" : "/" + page.replace(/\.html$/, "");
  return lang === "en"
    ? "https://veldra.org" + p
    : "https://veldra.org/" + lang + (p === "/" ? "/" : p);
}

console.log(`[verify] tree: ${ROOT}`);

// ---- HOSTING -------------------------------------------------------------
console.log("[verify] hosting contract");
for (const f of MUST_EXIST) {
  if (!existsSync(join(ROOT, f))) fail.push(`missing required file: ${f}`);
}
note(`${MUST_EXIST.length} required files checked`);

// ---- PRIVATE -------------------------------------------------------------
console.log("[verify] no internal docs published");
const stray = [];
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) {
      if (MUST_NOT_SHIP_DIRS.includes(e)) { stray.push(relative(ROOT, p) + "/"); continue; }
      walk(p);
      continue;
    }
    if (MUST_NOT_SHIP.includes(e)) stray.push(relative(ROOT, p));
    if (e.endsWith(".md")) stray.push(relative(ROOT, p));
  }
})(ROOT);
if (stray.length) fail.push(`internal/markdown files in the deploy tree: ${stray.join(", ")}`);
note(`markdown/internal files found: ${stray.length}`);

// ---- CONTENT -------------------------------------------------------------
console.log("[verify] crawlable content + no runtime chain + canonical/hreflang");
let checked = 0;
for (const lang of LANGS) {
  for (const page of [...INDEXABLE, "404.html"]) {
    const rel = lang === "en" ? page : join(lang, page);
    const abs = join(ROOT, rel);
    if (!existsSync(abs)) { fail.push(`missing page: ${rel}`); continue; }
    const html = readFileSync(abs, "utf8");
    checked += 1;

    const text = crawlableText(html);
    if (text.length < MIN_TEXT_CHARS) {
      fail.push(`${rel}: only ${text.length} crawlable chars (floor ${MIN_TEXT_CHARS}) — prerender did not apply`);
    }
    if (/type="text\/babel"/.test(html)) {
      fail.push(`${rel}: runtime Babel tag survived — this is the deindex cause`);
    }
    if (/unpkg\.com/.test(html)) {
      fail.push(`${rel}: CDN React/Babel reference survived`);
    }

    const declared = /<html[^>]*\slang="([^"]*)"/i.exec(html);
    if (!declared || declared[1] !== lang) {
      fail.push(`${rel}: <html lang> is "${declared && declared[1]}", expected "${lang}"`);
    }

    if (page === "404.html") {
      if (/rel="canonical"/.test(html)) fail.push(`${rel}: error page must not claim a canonical`);
      continue;
    }
    const want = pageUrl(page, lang);
    if (!html.includes(`<link rel="canonical" href="${want}" />`)) {
      fail.push(`${rel}: canonical is not ${want}`);
    }
    for (const l of LANGS) {
      if (!html.includes(`hreflang="${l}" href="${pageUrl(page, l)}"`)) {
        fail.push(`${rel}: hreflang ${l} missing or wrong`);
      }
    }
    if (!html.includes('hreflang="x-default"')) fail.push(`${rel}: x-default missing`);

    // A language subtree must not reference shared assets relatively: they
    // are not duplicated per language, so the page would load unstyled.
    if (lang !== "en" && /(?:src|href)="(?:\.\.\/)?(?:styles|assets|shared)\//.test(html)) {
      fail.push(`${rel}: relative shared-asset reference would 404 inside /${lang}/`);
    }
  }
}
note(`${checked} pages checked across ${LANGS.length} languages`);

// ---- LOCALISED HEADS -----------------------------------------------------
// A translated page with an English title and description shows English in
// search results and link unfurls, which is most of what the translation was
// for. Compared against the English page rather than asserted per string.
console.log("[verify] titles and descriptions localise");
const CORE = ["index.html", "architecture.html", "docs.html", "failure-atlas.html", "product.html", "questions.html"];
let localised = 0;
for (const page of CORE) {
  const enPath = join(ROOT, page);
  if (!existsSync(enPath)) continue;
  const en = readFileSync(enPath, "utf8");
  const enDesc = /name="description" content="([^"]*)"/i.exec(en);
  for (const lang of LANGS.filter((l) => l !== "en")) {
    const p = join(ROOT, lang, page);
    if (!existsSync(p)) continue;
    const html = readFileSync(p, "utf8");
    const d = /name="description" content="([^"]*)"/i.exec(html);
    if (!d || !d[1].trim()) {
      fail.push(`${lang}/${page}: no meta description`);
    } else if (enDesc && d[1] === enDesc[1]) {
      fail.push(`${lang}/${page}: description is still the English string`);
    } else {
      localised += 1;
    }
  }
}
note(`${localised} translated descriptions confirmed distinct from English`);

// ---- REACHABILITY --------------------------------------------------------
// hreflang tells a crawler the translations exist. It does nothing for a
// person. The switcher is a React <button onClick>, so prerendering strips
// the handler and ships a control with cursor:pointer that does nothing:
// the trees were live and unreachable from the UI for a full deploy.
console.log("[verify] language switcher actually navigates");
const LABELS = { en: "EN", es: "ES", zh: "中" };
let navOk = 0;
for (const lang of LANGS) {
  for (const page of [...INDEXABLE, "404.html"]) {
    const rel = lang === "en" ? page : join(lang, page);
    const abs = join(ROOT, rel);
    if (!existsSync(abs)) continue;
    const html = readFileSync(abs, "utf8");

    const inert = html.match(/<button[^>]*>(?:EN|ES|中)<\/button>/g);
    if (inert) fail.push(`${rel}: ${inert.length} inert language button(s) — looks clickable, does nothing`);

    for (const [code, label] of Object.entries(LABELS)) {
      const re = new RegExp(`<a href="([^"]*)"[^>]*>${label}</a>`);
      const m = re.exec(html);
      if (!m) { fail.push(`${rel}: no ${code} language link`); continue; }
      const target = m[1] === "/" ? "index.html"
        : m[1].endsWith("/") ? join(m[1].slice(1), "index.html")
        : m[1].slice(1) + ".html";
      if (!existsSync(join(ROOT, target))) {
        fail.push(`${rel}: ${code} link points at ${m[1]}, which is not in the tree`);
      } else navOk += 1;
    }
  }
}
note(`${navOk} language links verified to resolve to real pages`);

// ---- SITEMAP -------------------------------------------------------------
// The previously published sitemap advertised five URLs that 404'd while the
// real pages went unlisted, actively misdirecting recrawls.
console.log("[verify] sitemap covers every language tree");
const smPath = join(ROOT, "sitemap.xml");
if (existsSync(smPath)) {
  const sm = readFileSync(smPath, "utf8");
  const locs = new Set([...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
  let missing = 0;
  for (const lang of LANGS) {
    for (const page of INDEXABLE) {
      const u = pageUrl(page, lang);
      if (!locs.has(u)) { missing += 1; if (missing <= 5) fail.push(`sitemap missing: ${u}`); }
    }
  }
  if (missing > 5) fail.push(`sitemap missing ${missing} URLs in total`);
  for (const u of locs) {
    const rel = u.replace("https://veldra.org", "");
    const guess = rel === "/" ? "index.html"
      : rel.endsWith("/") ? join(rel.slice(1), "index.html")
      : rel.slice(1) + ".html";
    if (!existsSync(join(ROOT, guess))) fail.push(`sitemap advertises a URL with no file: ${u}`);
  }
  note(`${locs.size} sitemap URLs, all resolving to built files`);
} else {
  fail.push("missing sitemap.xml");
}

// ---- RESULT --------------------------------------------------------------
if (fail.length) {
  console.error(`\n[verify] FAILED — ${fail.length} problem(s), refusing to deploy:`);
  for (const f of fail) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`\n[verify] PASS — ${checked} pages, hosting contract intact, no internal docs, no runtime chain.`);
