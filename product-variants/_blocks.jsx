/* ============================================================================
   VELDRA · Product page shared building blocks (PDF-grounded · audited)
   Each block consumes window.PRODUCT_CONTENT (audited shape).
   No invented vendors, prices, dates, or metric names.
   ============================================================================ */

/* ---- Header primitive ---- */
const PH = ({ eyebrow, title, lede, level = 2, anchor }) => {
  const Tag = `h${level}`;
  const sz = level === 1 ? 64 : level === 2 ? 40 : 28;
  return (
    <div id={anchor} style={{ marginBottom: 24 }}>
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      <Tag style={{
        fontFamily: "var(--grotesk)", fontSize: sz, fontWeight: 500,
        letterSpacing: "-0.025em", lineHeight: 1.1,
        margin: "8px 0 12px", color: "var(--fg)",
      }}>{title}</Tag>
      {lede && <p style={{ fontSize: 16, color: "var(--fg-dim)", lineHeight: 1.55, maxWidth: 760, margin: 0 }}>{lede}</p>}
    </div>
  );
};

/* ---- WIRED / OBSERVING / PLANNED status pill (PDF #40 framing) ---- */
const StatusPill = ({ status }) => {
  const M = {
    wired:     { l: "WIRED",     c: "var(--accent)" },
    observing: { l: "OBSERVING", c: "var(--accent-2)" },
    planned:   { l: "PLANNED",   c: "var(--fg-dim)" },
    sketch:    { l: "SKETCH",    c: "var(--fg-dim)" },
  }[status] || { l: status, c: "var(--fg-dim)" };
  return (
    <span style={{
      fontFamily: "var(--mono)", fontSize: 10, fontWeight: 600, letterSpacing: "0.14em",
      padding: "3px 8px", border: `1px solid ${M.c}`, color: M.c, borderRadius: 2,
    }}>{M.l}</span>
  );
};

/* ---- 1. SRI single-vendor compare (PDF #26 — only named comparison) ---- */
const ProductCompare = () => {
  const rows = [1,2,3,4,5].map(i => ({
    axis:   t(`prod.compare.r${i}.axis`),
    sri:    t(`prod.compare.r${i}.sri`),
    veldra: t(`prod.compare.r${i}.veldra`),
  }));
  return (
    <div>
      <p style={{ fontSize: 14.5, color: "var(--fg-dim)", lineHeight: 1.6, maxWidth: 760, margin: "0 0 20px" }}>
        {t("prod.compare.intro")}
      </p>
      <div style={{ background: "var(--bg-2)", border: "1px solid var(--line)", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "240px 1fr 1fr", padding: "14px 20px", background: "var(--bg-3)" }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: "0.16em", color: "var(--fg-dim)" }}>{t("prod.compare.axis")}</div>
          <div style={{ fontFamily: "var(--grotesk)", fontSize: 14, color: "var(--fg)", fontWeight: 500 }}>SRI</div>
          <div style={{ fontFamily: "var(--grotesk)", fontSize: 14, color: "var(--accent)", fontWeight: 500 }}>Veldra</div>
        </div>
        {rows.map((row, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "240px 1fr 1fr",
            padding: "12px 20px", borderTop: "1px solid var(--line)", gap: 12,
          }}>
            <div style={{ fontSize: 13, color: "var(--fg)", fontWeight: 500 }}>{row.axis}</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--fg-dim)" }}>{row.sri}</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--accent)" }}>{row.veldra}</div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 12.5, color: "var(--fg-dim)", lineHeight: 1.55, maxWidth: 760, margin: "16px 0 0", fontStyle: "italic" }}>
        {t("prod.compare.note")}
      </p>
    </div>
  );
};

/* ---- 2. Roadmap timeline ---- */
const ProductRoadmap = () => {
  const rows = [
    { id: "v2.0.0", k: "prod.roadmap.v2",  current: true },
    { id: "p1.5",   k: "prod.roadmap.p15", current: false },
    { id: "v3.x",   k: "prod.roadmap.v3",  current: false },
  ];
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {rows.map(r => (
        <div key={r.id} style={{
          padding: "20px 24px", background: "var(--bg-2)", border: "1px solid var(--line)",
          borderLeft: `3px solid ${r.current ? "var(--accent-2)" : "var(--line)"}`,
          borderRadius: "0 4px 4px 0",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span className="mono" style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600, letterSpacing: "0.04em" }}>{r.id}</span>
            <span style={{ fontFamily: "var(--grotesk)", fontSize: 16, fontWeight: 500, color: "var(--fg)" }}>{t(r.k + ".label")}</span>
            <span style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 10, color: "var(--fg-dim)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{t(r.k + ".status")}</span>
          </div>
          <p style={{ fontSize: 13, color: "var(--fg-dim)", lineHeight: 1.6, margin: 0 }}>{t(r.k + ".blurb")}</p>
        </div>
      ))}
    </div>
  );
};

/* ---- 3. TOML config — PDF-grounded subset only ---- */
const ProductTOML = () => {
  const C = window.PRODUCT_CONTENT.toml;
  const keys = C.new_phase2_section.keys;
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        <span className="mono" style={{ fontSize: 11, color: "var(--fg-dim)", letterSpacing: "0.04em" }}>
          {t("prod.toml.baseline")} <span style={{ color: "var(--fg)" }}>{C.v1_baseline_keys} {t("prod.toml.keys_word")}</span> {t("prod.toml.across")} {C.v1_baseline_sections.join(" · ")}
        </span>
      </div>
      <div style={{ background: "var(--bg-2)", border: "1px solid var(--line)", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", background: "var(--bg-3)", display: "flex", alignItems: "center", gap: 12 }}>
          <code style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--accent)", fontWeight: 600 }}>
            {C.new_phase2_section.section}
          </code>
          <span className="mono" style={{ fontSize: 10, color: "var(--fg-dim)", letterSpacing: "0.12em" }}>{t("prod.toml.new_label")} · {keys.length} {t("prod.toml.keys_label")}</span>
        </div>
        {keys.map((k, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "220px 100px 1fr",
            padding: "10px 20px", borderTop: "1px solid var(--line)", gap: 14,
            alignItems: "baseline",
          }}>
            <code style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--fg)" }}>{k.name}</code>
            <code style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--accent-2)" }}>{k.default}</code>
            <span style={{ fontSize: 12, color: "var(--fg-dim)", lineHeight: 1.5 }}>{t(`prod.toml.k${i+1}.note`)}</span>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 12, color: "var(--fg-dim)", lineHeight: 1.55, margin: "12px 0 0", fontStyle: "italic" }}>
        {t("prod.toml.compat")}
      </p>
    </div>
  );
};

/* ---- 4. Telemetry — exact PDF metric names ---- */
const ProductTelemetry = () => {
  const C = window.PRODUCT_CONTENT.telemetry;
  return (
    <div>
      <div style={{ background: "var(--bg-2)", border: "1px solid var(--line)", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ padding: "12px 20px", background: "var(--bg-3)", display: "flex", alignItems: "center", gap: 12 }}>
          <span className="mono" style={{ fontSize: 11, color: "var(--accent)", fontWeight: 600, letterSpacing: "0.08em" }}>
            {t("prod.tel.new_label")} · {C.new_in_v20.length} {t("prod.tel.streams_label")}
          </span>
        </div>
        {C.new_in_v20.map((m, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "1fr 90px 1fr",
            padding: "12px 20px", borderTop: "1px solid var(--line)", gap: 14,
            alignItems: "baseline",
          }}>
            <code style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--fg)", lineHeight: 1.4 }}>{m.name}</code>
            <span className="mono" style={{ fontSize: 10, color: "var(--accent-2)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{m.kind}</span>
            <span style={{ fontSize: 12, color: "var(--fg-dim)", lineHeight: 1.5 }}>{t(`prod.tel.m${i+1}.note`)}</span>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 12, color: "var(--fg-dim)", lineHeight: 1.55, margin: "12px 0 0", fontStyle: "italic" }}>
        {t("prod.tel.baseline")}
      </p>
    </div>
  );
};

/* ---- 5. Adoption modes (replaces invented "tiers") ---- */
const ProductTiers = () => {
  const modes = ["shadow","observe","inline"].map(id => ({
    id,
    label: t(`prod.adoption.${id}.label`),
    cost:  t(`prod.adoption.${id}.cost`),
    time:  t(`prod.adoption.${id}.time`),
    gloss: t(`prod.adoption.${id}.gloss`),
  }));
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {modes.map(m => (
          <div key={m.id} style={{
            padding: "22px 24px", background: "var(--bg-2)", border: "1px solid var(--line)", borderRadius: 4,
          }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--fg-dim)", marginBottom: 8 }}>
              {t("prod.adoption.mode_label")}
            </div>
            <div style={{ fontFamily: "var(--grotesk)", fontSize: 22, fontWeight: 500, color: "var(--fg)", marginBottom: 12 }}>
              {m.label}
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
              <span className="mono" style={{ fontSize: 11, padding: "3px 8px", background: "var(--bg-3)", color: "var(--accent)", letterSpacing: "0.04em", borderRadius: 2 }}>
                {m.cost}
              </span>
              <span className="mono" style={{ fontSize: 11, padding: "3px 8px", background: "var(--bg-3)", color: "var(--fg-dim)", letterSpacing: "0.04em", borderRadius: 2 }}>
                {m.time}
              </span>
            </div>
            <p style={{ fontSize: 13, color: "var(--fg-dim)", lineHeight: 1.55, margin: 0 }}>
              {m.gloss}
            </p>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 14, padding: "12px 18px", background: "var(--bg-2)", border: "1px solid var(--line)", borderRadius: 4 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.16em", color: "var(--fg-dim)", marginBottom: 6 }}>{t("prod.adoption.prereq.label")}</div>
        <p style={{ fontSize: 12.5, color: "var(--fg-dim)", lineHeight: 1.55, margin: 0 }}>{t("prod.adoption.bitcoind")}</p>
      </div>
    </div>
  );
};

/* ---- 6. CTA pair (Sign In for license key + docs) ---- */
const ProductCTA = () => (
  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
    <a href="#" className="btn btn-primary">{t("prod.cta.signin")}</a>
    <a href="Architecture.html" className="btn btn-ghost">{t("prod.cta.arch")}</a>
  </div>
);

/* ---- 7. Reason-code surface (no fake names — PDF-grounded tiers) ---- */
const ProductReasonCodes = () => {
  const R = window.PRODUCT_CONTENT.reason_codes;
  const tierKey = { T1: "t1", T2: "t2", T3: "t3" };
  return (
    <div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 18 }}>
        <Stat n={R.v1_baseline} l={t("prod.rc.stat1")} />
        <Stat n={R.v2_invariant_total} l={t("prod.rc.stat2")} />
      </div>
      <div style={{ display: "grid", gap: 12 }}>
        {R.tiers.map(tier => {
          const k = tierKey[tier.id];
          return (
            <div key={tier.id} style={{
              padding: "18px 22px", background: "var(--bg-2)", border: "1px solid var(--line)",
              borderLeft: `3px solid ${tier.id === "T1" ? "var(--accent)" : tier.id === "T2" ? "var(--accent-2)" : "var(--fg-dim)"}`,
              borderRadius: "0 4px 4px 0",
            }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
                <span className="mono" style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600 }}>{tier.id} · ×{tier.count}</span>
                <span style={{ fontFamily: "var(--grotesk)", fontSize: 16, fontWeight: 500, color: "var(--fg)" }}>{t(`prod.rc.${k}.label`)}</span>
                <span className="mono" style={{ marginLeft: "auto", fontSize: 10, color: "var(--fg-dim)", letterSpacing: "0.1em" }}>{t(`prod.rc.${k}.ships`)}</span>
              </div>
              <p style={{ fontSize: 12.5, color: "var(--fg-dim)", lineHeight: 1.55, margin: "0 0 10px" }}>{t(`prod.rc.${k}.gloss`)}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {tier.names.map(n => (
                  <code key={n} style={{
                    fontFamily: "var(--mono)", fontSize: 10.5, color: "var(--fg)",
                    padding: "3px 7px", background: "var(--bg-3)", borderRadius: 2,
                  }}>{n}</code>
                ))}
              </div>
            </div>
          );
        })}
        <div style={{
          padding: "18px 22px", background: "var(--bg-2)", border: "1px dashed var(--line)", borderRadius: 4,
        }}>
          <div className="mono" style={{ fontSize: 11, color: "var(--accent-2)", fontWeight: 600, marginBottom: 4 }}>
            {t("prod.rc.classM.label")}
          </div>
          <p style={{ fontSize: 12.5, color: "var(--fg-dim)", lineHeight: 1.55, margin: 0 }}>
            {t("prod.rc.classM.gloss")}
          </p>
        </div>
      </div>
      <p style={{ fontSize: 11.5, color: "var(--fg-dim)", lineHeight: 1.55, margin: "12px 0 0", fontStyle: "italic" }}>
        {t("prod.rc.canonical")}: <code style={{ fontFamily: "var(--mono)" }}>{R.canonical_source}</code>
      </p>
    </div>
  );
};

const Stat = ({ n, l }) => (
  <div style={{ padding: "12px 16px", background: "var(--bg-2)", border: "1px solid var(--line)", borderRadius: 4, flex: "1 1 240px", minWidth: 240 }}>
    <div style={{ fontFamily: "var(--grotesk)", fontSize: 28, fontWeight: 500, color: "var(--accent)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{n}</div>
    <div style={{ fontSize: 11, color: "var(--fg-dim)", lineHeight: 1.4, marginTop: 6 }}>{l}</div>
  </div>
);

/* ---- 8. Threats / ceilings / caveats — PDF #11-#14 ---- */
const ProductThreats = () => {
  const rows = [
    { id: "T1", coverage: "in"  },
    { id: "T2", coverage: "in"  },
    { id: "T3", coverage: "in"  },
    { id: "T4", coverage: "out" },
    { id: "T5", coverage: "out" },
  ];
  return (
    <div style={{ background: "var(--bg-2)", border: "1px solid var(--line)", borderRadius: 4, overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 100px 1fr", padding: "12px 18px", background: "var(--bg-3)" }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.16em", color: "var(--fg-dim)" }}>{t("prod.threats.col.id")}</div>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.16em", color: "var(--fg-dim)" }}>{t("prod.threats.col.threat")}</div>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.16em", color: "var(--fg-dim)" }}>{t("prod.threats.col.status")}</div>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.16em", color: "var(--fg-dim)" }}>{t("prod.threats.col.by")}</div>
      </div>
      {rows.map(r => {
        const idLow = r.id.toLowerCase();
        return (
          <div key={r.id} style={{
            display: "grid", gridTemplateColumns: "60px 1fr 100px 1fr",
            padding: "12px 18px", borderTop: "1px solid var(--line)", gap: 12, alignItems: "baseline",
          }}>
            <code style={{ fontFamily: "var(--mono)", fontSize: 12, color: r.coverage === "in" ? "var(--accent)" : "var(--fg-dim)", fontWeight: 600 }}>{r.id}</code>
            <span style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.45 }}>{t(`prod.threats.${idLow}.name`)}</span>
            <span className="mono" style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em",
              color: r.coverage === "in" ? "var(--accent)" : "var(--fg-dim)",
              textTransform: "uppercase",
            }}>{r.coverage === "in" ? "✓ " + t("prod.threats.in") : "✗ " + t("prod.threats.out")}</span>
            <span style={{ fontSize: 12.5, color: "var(--fg-dim)", lineHeight: 1.5 }}>{t(`prod.threats.${idLow}.by`)}</span>
          </div>
        );
      })}
    </div>
  );
};

/* ---- 9. Install pointer (PDF-grounded — adoption modes only) ---- */
const ProductInstallPointer = () => {
  return (
    <div style={{ padding: "20px 24px", background: "var(--bg-2)", border: "1px solid var(--line)", borderRadius: 4 }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--fg-dim)", marginBottom: 10 }}>{t("prod.adoption.licflow.label")}</div>
      <p style={{ fontSize: 13.5, color: "var(--fg)", lineHeight: 1.6, margin: "0 0 12px" }}>
        {t("prod.adoption.licflow")}
      </p>
      <p style={{ fontSize: 12.5, color: "var(--fg-dim)", lineHeight: 1.55, margin: 0 }}>
        {t("prod.adoption.bitcoind")}
      </p>
    </div>
  );
};

/* Export */
Object.assign(window, {
  PH, StatusPill,
  ProductCompare, ProductRoadmap, ProductTOML, ProductTelemetry,
  ProductTiers, ProductCTA, ProductReasonCodes, ProductThreats, ProductInstallPointer,
});
