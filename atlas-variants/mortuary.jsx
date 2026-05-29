/* Failure Atlas · C — MORTUARY
   Brutalist memorial slab. White-on-near-black. No accents except a single
   ember stroke per slab. Massive serial numbers, almost no chrome.
   Best for: high-conviction stake-in-the-ground, opinionated readers.
   Voice: spare, declarative, no hedging.
*/

const AtlasMortuary = () => {
  const C = window.ATLAS_CONTENT;
  const sorted = [...C.incidents].sort((a, b) => a.date.localeCompare(b.date));

  // Re-render on lang change so structural strings flip.
  const [, setLangTick] = React.useState(0);
  React.useEffect(() => {
    const onLang = () => setLangTick((n) => n + 1);
    window.addEventListener("__lang_changed", onLang);
    return () => window.removeEventListener("__lang_changed", onLang);
  }, []);
  const tt = (typeof window !== "undefined" && window.t) ? window.t : (s) => s;

  return (
    <div className="variant-page" data-variant="mortuary" style={{ minHeight: 6800, paddingTop: 0 }}>

      {/* ======= MASTHEAD ======= */}
      <section style={{
        padding: "120px 96px 96px",
        maxWidth: 1320, margin: "0 auto",
        borderBottom: "1px solid var(--line)",
        position: "relative",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 96 }}>
          <div className="mono" style={{ fontSize: 11, letterSpacing: "0.3em", color: "var(--fg-dim)" }}>
            {tt("atlas.brand")}
          </div>
          <div className="mono" style={{ fontSize: 11, letterSpacing: "0.3em", color: "var(--fg-dim)", textAlign: "right" }}>
            {tt("atlas.brandRight.l1")}<br/>
            <span style={{ color: "var(--accent-2)" }}>{tt("atlas.brandRight.l2")}</span>
          </div>
        </div>

        <div style={{ fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.24em", color: "var(--accent-2)", marginBottom: 56 }}>
          {tt("atlas.eyebrow")}
        </div>

        <h1 style={{
          fontFamily: "var(--mono)", fontSize: 120, fontWeight: 600, lineHeight: 0.94,
          letterSpacing: "-0.04em", margin: 0, color: "var(--fg)",
          textTransform: "uppercase",
        }}>
          {tt("atlas.h1.l1")}<br/>
          {tt("atlas.h1.l2")}<br/>
          {tt("atlas.h1.l3")}<br/>
          <span style={{ color: "var(--accent-2)" }}>{tt("atlas.h1.l4")}</span>
        </h1>

        <div style={{ marginTop: 96, display: "grid", gridTemplateColumns: "1fr 480px", gap: 96, alignItems: "end" }}>
          <p style={{
            fontFamily: "var(--mono)", fontSize: 14, lineHeight: 1.7, color: "var(--fg)",
            margin: 0, maxWidth: 540, textWrap: "pretty",
          }}>
            {tt("atlas.lede")}
          </p>
          <div style={{ borderTop: "1px solid var(--accent-2)", paddingTop: 16 }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.24em", color: "var(--fg-dim)", marginBottom: 10, textTransform: "uppercase" }}>
              {tt("atlas.filed")}
            </div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 56, color: "var(--fg)", lineHeight: 1, letterSpacing: "-0.04em" }}>
              {String(sorted.length).padStart(2, "0")}
            </div>
            <div className="mono" style={{ fontSize: 11, letterSpacing: "0.18em", color: "var(--fg-dim)", marginTop: 6, textTransform: "uppercase" }}>
              {tt("atlas.range")}
            </div>
          </div>
        </div>
      </section>

      {/* ======= INDEX STRIP ======= */}
      <section style={{ padding: "32px 96px", maxWidth: 1320, margin: "0 auto", borderBottom: "1px solid var(--line)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 0 }}>
          {sorted.map((inc, i) => (
            <a key={inc.slug} href={`#mortuary-${inc.slug}`} style={{
              padding: "16px 12px",
              borderRight: i < sorted.length - 1 ? "1px solid var(--line)" : "none",
              textDecoration: "none",
              transition: "background 0.12s",
              display: "block",
            }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--fg-dim)", letterSpacing: "0.16em", marginBottom: 6 }}>
                № {String(i + 1).padStart(2, "0")}
              </div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--fg)", letterSpacing: "0.04em" }}>
                {inc.year}
              </div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--accent-2)", letterSpacing: "0.1em", marginTop: 4, textTransform: "uppercase" }}>
                {inc.loss_class}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ======= SLABS ======= */}
      <section style={{ padding: 0 }}>
        {sorted.map((inc, i) => (
          <Slab key={inc.slug} inc={inc} idx={i + 1} total={sorted.length} />
        ))}
      </section>

      {/* ======= CLOSING SLAB ======= */}
      <section style={{
        padding: "120px 96px",
        maxWidth: 1320, margin: "0 auto",
        borderTop: "1px solid var(--accent-2)",
        background: "var(--bg-2)",
      }}>
        <div className="mono" style={{ fontSize: 11, letterSpacing: "0.24em", color: "var(--accent-2)", marginBottom: 32, textTransform: "uppercase" }}>
          {tt("atlas.closing.eyebrow")}
        </div>
        <h2 style={{
          fontFamily: "var(--mono)", fontSize: 48, fontWeight: 600, lineHeight: 1.1,
          letterSpacing: "-0.02em", margin: "0 0 40px", color: "var(--fg)",
          textTransform: "uppercase", maxWidth: 800,
        }}>
          {tt("atlas.closing.title")}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80 }}>
          <div>
            <p style={{
              fontFamily: "var(--mono)", fontSize: 14, lineHeight: 1.7, color: "var(--fg)",
              margin: "0 0 20px",
            }}>{tt("atlas.closing.body1")}</p>
            <p style={{
              fontFamily: "var(--mono)", fontSize: 14, lineHeight: 1.7, color: "var(--fg)",
              margin: "0 0 20px",
            }}>{tt("atlas.closing.body2")}</p>
          </div>
          <div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.24em", color: "var(--fg-dim)", marginBottom: 16, textTransform: "uppercase" }}>
              {tt("atlas.closing.disclaimerLabel")}
            </div>
            <p style={{
              fontFamily: "var(--mono)", fontSize: 12, lineHeight: 1.6, color: "var(--fg-dim)",
              margin: 0, maxWidth: 480,
            }}>{tt("atlas.closing.disclaimer")}</p>
            <a href={C.closing.cta_link} style={{
              display: "inline-block", marginTop: 40, padding: "16px 28px",
              border: "1px solid var(--accent-2)", color: "var(--accent-2)",
              fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.18em",
              textDecoration: "none", textTransform: "uppercase",
            }}>
              {tt("atlas.closing.cta")}
            </a>
          </div>
        </div>
      </section>

      <style>{`
        [data-variant="mortuary"] .slab-wrap a:hover {
          background: var(--bg-2);
        }
      `}</style>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────── */
/* Slab · single incident block                                */
/* ─────────────────────────────────────────────────────────── */
const Slab = ({ inc, idx, total }) => {
  const tt = (typeof window !== "undefined" && window.t) ? window.t : (s) => s;
  return (
    <div id={`mortuary-${inc.slug}`} style={{
      padding: "96px 96px",
      borderBottom: "1px solid var(--line)",
      maxWidth: 1320, margin: "0 auto",
      position: "relative",
    }}>
      {/* Massive serial */}
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 80, alignItems: "start" }}>
        <div>
          <div className="mono" style={{ fontSize: 10, letterSpacing: "0.3em", color: "var(--fg-dim)", marginBottom: 16, textTransform: "uppercase" }}>
            {tt("atlas.slab.case")}
          </div>
          <div style={{
            fontFamily: "var(--mono)", fontSize: 200, fontWeight: 600, lineHeight: 0.85,
            color: "var(--fg)", letterSpacing: "-0.05em", marginBottom: 16,
          }}>
            {String(idx).padStart(2, "0")}
          </div>
          <div className="mono" style={{ fontSize: 11, letterSpacing: "0.16em", color: "var(--fg-dim)" }}>
            {tt("atlas.slab.of")} {String(total).padStart(2, "0")}
          </div>

          {/* Date + actor block */}
          <div style={{ marginTop: 56, paddingTop: 24, borderTop: "1px solid var(--line)" }}>
            <div style={{ marginBottom: 18 }}>
              <div className="mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--fg-dim)", marginBottom: 4, textTransform: "uppercase" }}>{tt("atlas.slab.date")}</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 16, color: "var(--fg)" }}>{inc.date_label}</div>
            </div>
            <div style={{ marginBottom: 18 }}>
              <div className="mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--fg-dim)", marginBottom: 4, textTransform: "uppercase" }}>{tt("atlas.slab.actor")}</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 14, color: "var(--fg)", lineHeight: 1.4 }}>{inc.actor}</div>
            </div>
            <div>
              <div className="mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--fg-dim)", marginBottom: 6, textTransform: "uppercase" }}>{tt("atlas.slab.class")}</div>
              <div style={{
                display: "inline-block", padding: "6px 12px",
                border: "1px solid var(--accent-2)", color: "var(--accent-2)",
                fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.16em",
                textTransform: "uppercase", fontWeight: 600,
              }}>
                {inc.loss_class} · {inc.layer} · {inc.threat}
              </div>
            </div>
          </div>
        </div>

        {/* Right: title + summary + facts */}
        <div>
          <h3 style={{
            fontFamily: "var(--mono)", fontSize: 36, fontWeight: 600, lineHeight: 1.1,
            letterSpacing: "-0.02em", color: "var(--fg)", margin: "0 0 32px",
            textTransform: "uppercase", textWrap: "balance",
          }}>
            {tt("atlas.inc." + inc.slug + ".title")}
          </h3>

          <p style={{
            fontFamily: "var(--mono)", fontSize: 15, lineHeight: 1.7, color: "var(--fg)",
            margin: "0 0 40px", maxWidth: 720, textWrap: "pretty",
          }}>
            {tt("atlas.inc." + inc.slug + ".summary")}
          </p>

          {/* Headline metric · brutalist */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 24, marginBottom: 56, padding: "24px 0", borderTop: "1px solid var(--accent-2)", borderBottom: "1px solid var(--accent-2)" }}>
            <span style={{
              fontFamily: "var(--mono)", fontSize: 80, fontWeight: 600, color: "var(--accent-2)",
              lineHeight: 0.9, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums",
            }}>
              {inc.headline_metric.v}
            </span>
            <span style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--fg)", letterSpacing: "0.06em", lineHeight: 1.4, maxWidth: 320, textTransform: "uppercase" }}>
              {tt("atlas.inc." + inc.slug + ".unit")}
            </span>
          </div>

          {/* Facts */}
          <div style={{ marginBottom: 40 }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.24em", color: "var(--fg-dim)", marginBottom: 16, textTransform: "uppercase" }}>
              {tt("atlas.slab.record")}
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {inc.facts.map((f, i) => (
                <li key={i} style={{
                  fontFamily: "var(--mono)", fontSize: 13, color: "var(--fg)", lineHeight: 1.5,
                  padding: "10px 0", borderTop: "1px solid var(--line)",
                  display: "flex", gap: 16,
                }}>
                  <span style={{ color: "var(--fg-dim)", minWidth: 28 }}>§{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ flex: 1 }}>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Code mapping · two columns */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 40 }}>
            <div>
              <div className="mono" style={{ fontSize: 10, letterSpacing: "0.24em", color: "var(--fg-dim)", marginBottom: 12, textTransform: "uppercase" }}>
                {tt("atlas.slab.v1")}
              </div>
              {inc.v1_codes.map((c, i) => (
                <div key={i} style={{
                  fontFamily: "var(--mono)", fontSize: 12,
                  color: c === "—" ? "var(--fg-dim)" : "var(--fg)",
                  padding: "8px 0", borderTop: "1px solid var(--line)",
                }}>{c}</div>
              ))}
            </div>
            <div>
              <div className="mono" style={{ fontSize: 10, letterSpacing: "0.24em", color: "var(--accent-2)", marginBottom: 12, textTransform: "uppercase" }}>
                {tt("atlas.slab.v2")}
              </div>
              {inc.v2_codes.map((c, i) => (
                <div key={i} style={{
                  fontFamily: "var(--mono)", fontSize: 12,
                  color: c === "—" ? "var(--fg-dim)" : "var(--accent-2)",
                  padding: "8px 0", borderTop: "1px solid var(--accent-2)",
                  fontWeight: c === "—" ? 400 : 600,
                }}>{c}</div>
              ))}
            </div>
          </div>

          {/* Caught-now · single line */}
          <div style={{
            padding: "20px 24px",
            border: "1px solid var(--accent-2)",
            background: "transparent",
          }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.3em", color: "var(--accent-2)", marginBottom: 8, textTransform: "uppercase", fontWeight: 600 }}>
              {tt("atlas.slab.verdict")}
            </div>
            <p style={{
              fontFamily: "var(--mono)", fontSize: 14, lineHeight: 1.6, color: "var(--fg)",
              margin: 0, maxWidth: 720,
            }}>
              {tt("atlas.inc." + inc.slug + ".caught")}
            </p>
          </div>

          {/* Sources */}
          <div style={{ marginTop: 32 }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.24em", color: "var(--fg-dim)", marginBottom: 12, textTransform: "uppercase" }}>
              {tt("atlas.slab.sources")}
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {inc.sources.map((s, i) => (
                <li key={i} style={{
                  fontFamily: "var(--mono)", fontSize: 12, color: "var(--fg)", lineHeight: 1.5,
                  padding: "8px 0", borderTop: "1px solid var(--line)",
                  display: "flex", gap: 14,
                }}>
                  <span style={{ color: "var(--fg-dim)", letterSpacing: "0.1em", textTransform: "uppercase", fontSize: 10, paddingTop: 2, minWidth: 48 }}>
                    [{s.kind}]
                  </span>
                  <span style={{ flex: 1 }}>{s.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

window.AtlasMortuary = AtlasMortuary;
