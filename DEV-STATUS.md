# veldra-site — DEV STATUS: INCOMPLETE

**This site is not production-complete. Do not treat it as launch-ready.**
Last assessed 2026-06-08. Source-of-truth validated 2026-07-26.

## SOURCE OF TRUTH: this directory. Validated, not asserted.

`veldra-site/` (this repo, remote `LeavesJ/veldra-site`) is the single viable
source. `Veldra Site/` alongside it is the old authoring copy and is fully
superseded as of 2026-07-26. Do not edit it. Do not copy from it.

Evidence, so this does not get relitigated:

- The live bundle at `https://veldra.org/shared/i18n.js` was byte-identical
  (md5 `90d2e3b8…`, 191,909 B) to this repo's `shared/i18n.js` at `e1ebcd6~1`.
  GitHub Pages serves this repo.
- Only this copy carries the hosting contract: `CNAME`, `.nojekyll`,
  `robots.txt`, `sitemap.xml`, and `tools/prerender`.
- The authoring copy used human filenames (`Homepage.html`,
  `Failure Atlas.html`); this one uses the URL-safe names the routes need.

The two diverged because the authoring-to-publishing step was a manual copy.
That stranded real work for weeks. Everything of value has now been merged in
(`6beae6e`, `dccb480`, `8082b4f`) and every remaining difference is one where
this copy is newer: the prerender/SEO heads, the responsive stylesheet and its
`site-nav` / `nav-pills` / `nav-actions` classes, the Setup A retraction, and
the Phase 1.5 framing.

What the manual copy had cost, all live on veldra.org until this merge:
- `arch.s2.sub` claimed re-derivation ran "via FFI into libbitcoinkernel, the
  same code Bitcoin Core runs". False. `rg-consensus/Cargo.toml` has exactly
  one dependency, `bitcoin = "=0.32.8"` (rust-bitcoin), and there is no FFI.
- Both hero CTAs were anchors with no `href`. They did nothing when clicked.
- The architecture walkthrough could only render five of its six steps.
- `docs.html` documented 60 config keys against a canonical 69.
- `product-variants/_content.js` still published 91 reason codes.
- The site printed `verifier_phase2_degraded` for a metric the source names
  `verifier_phase2_degraded_total`.

## Blocker 1: mobile and responsive completely unaddressed

The layouts are desktop-only. Evidence as of 2026-06-08:

- All 20 HTML pages carry the `viewport` meta tag, so the site declares itself mobile-aware,
- but the whole site has only 5 `@media` rules and zero responsive breakpoint utilities (`sm:` `md:` `lg:` `xl:`),
- the redesign variants are fixed-width SVG and absolute-positioned layouts that do not reflow.

Net: on a phone the desktop layout renders at desktop width and overflows or forces pinch-zoom. A responsive pass is required before any public launch: breakpoints and fluid layout on every page, a mobile navigation pattern, SVG diagram scaling or mobile fallbacks, and tap-target sizing. This is the single largest gap to calling the site done.

## TODO 2: stale validation-status copy (Setup B is now running)

The public status content still describes Setup B as not started:

- `status.html`, Setup B card: "Setup B is the next evidence layer" should become "in progress" (shadow soak T+0 2026-06-08, wraps 2026-06-15).
- `shared/i18n.js` `status.partner.h2` "Setup B and Setup C are open" and the design-partner copy offer Setup B slots. Self-host now covers Setup B, so only Setup C (inline pool-side validation) still needs a design partner. This is a strategic copy change; confirm the framing before publishing.
- The Setup B lede ("what remains gated on a real-bitcoind run") needs the same "now in progress" update across en, es, and zh.

SUPERSEDED 2026-07-26. The two notes that stood here are now false and were
misdirecting later sessions:

- "Already correct: the invariant count reads 7 Tier 3 reserved ... No count fix
  needed here." True on 2026-06-08, false from 2026-07-22 when Phase 1.5 wired all
  seven (DEVLOG 2026-07-22). Corrected in `e1ebcd6`. Note the code sits on branch
  and is NOT merged to main, so the site must say wired, never shipped or validated.
- "update the public status copy once at the T+7 wrap (2026-06-15), when Setup B
  firms from in progress to validated." That wrap never happened: the node rebooted
  2026-07-09 with `restart=no` and the evidence cannot be reconstructed. Worse, the
  destination was wrong. Per PB-19 no sender ships `raw_block_hex`, so the shield
  skipped every template and no soak so far can produce a Class M result at all.
  The Setup A PASS was withdrawn in `c21df86`.

Current: reason-code counts corrected to 59 gateway / 95 canonical (`d3da83b`).
Dead `assets/i18n/*.json` bundles removed; the live bundle is `shared/i18n.js` only.
Still open: the es/zh quality pass, and the ~12 keys still asserting Phase 1.5 is
queued.

## Not assessed yet

Accessibility (WCAG, contrast, keyboard nav), cross-browser, the auth-page flows end to end against the live rg-auth, and the es/zh translations needing a native review (per the standing backlog).
