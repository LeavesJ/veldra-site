/* ========================================================================
   VELDRA — Shared React components used across Architecture, Product,
   Failure Atlas, and any future pages.

   Components:
     <WiredBadge variant="full|chip|inline" />
     <SiteNav active="architecture" />
     <SiteFooter />
     <SectionHeader eyebrow title sub />
     <ReasonCodePill code class />
   ======================================================================== */

/* ---------- WIRED · OBSERVATION CYCLE badge ----------
   Three sizes. Tooltip on hover. The "honest scoping" surface
   that appears next to any Phase 2 / v2.0.0 claim. */
const WiredBadge = ({ variant = "chip", style = {} }) => {
  const [hover, setHover] = React.useState(false);
  if (variant === "inline") {
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.12em",
        color: "var(--accent-3, oklch(70% 0.14 220))",
        padding: "2px 6px", border: "1px solid currentColor",
        borderRadius: 2, ...style,
      }} title={window.t ? window.t("wired.tooltip") : ""}>
        <span style={{
          width: 5, height: 5, borderRadius: "50%",
          background: "currentColor", animation: "pulse-soft 2s ease-in-out infinite",
        }}/>
        WIRED
      </span>
    );
  }
  if (variant === "full") {
    return (
      <div style={{
        display: "flex", gap: 12, padding: "14px 18px",
        background: "oklch(70% 0.14 220 / 0.06)",
        border: "1px solid oklch(70% 0.14 220 / 0.4)",
        borderRadius: 4, ...style,
      }}>
        <div style={{
          width: 6, height: 6, borderRadius: "50%", marginTop: 6,
          background: "oklch(70% 0.14 220)", flexShrink: 0,
          animation: "pulse-soft 2s ease-in-out infinite",
        }}/>
        <div>
          <div className="mono" style={{
            fontSize: 11, letterSpacing: "0.16em",
            color: "oklch(70% 0.14 220)", marginBottom: 4,
          }}>{window.t ? window.t("wired.label") : "WIRED · OBSERVATION CYCLE"}</div>
          <div style={{ fontSize: 13, color: "var(--fg-dim)", lineHeight: 1.5, maxWidth: 520 }}>
            {window.t ? window.t("wired.tooltip") : ""}
          </div>
        </div>
      </div>
    );
  }
  // chip (default)
  return (
    <span
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 8,
        padding: "6px 12px", border: "1px solid oklch(70% 0.14 220 / 0.5)",
        background: "oklch(70% 0.14 220 / 0.08)",
        borderRadius: 3, fontFamily: "var(--mono)", fontSize: 10,
        letterSpacing: "0.14em", color: "oklch(70% 0.14 220)",
        cursor: "help", ...style,
      }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor",
        animation: "pulse-soft 2s ease-in-out infinite" }}/>
      {window.t ? window.t("wired.label") : "WIRED · OBSERVATION CYCLE"}
      {hover && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", left: 0,
          width: 320, padding: "12px 14px", zIndex: 10,
          background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 4,
          fontFamily: "var(--sans)", fontSize: 12, letterSpacing: "normal",
          textTransform: "none", color: "var(--fg-dim)", lineHeight: 1.5,
          textAlign: "left",
        }}>
          {window.t ? window.t("wired.tooltip") : ""}
        </div>
      )}
    </span>
  );
};

/* ---------- Persistent site nav ---------- */
const SiteNav = ({ active = "" }) => {
  const items = [
    { id: "product",      label: window.t ? window.t("nav.product") : "Product",        href: "#" },
    { id: "architecture", label: window.t ? window.t("nav.architecture") : "Architecture", href: "#" },
    { id: "shield",       label: window.t ? window.t("nav.shield") : "Invariant Shield", href: "#" },
    { id: "atlas",        label: window.t ? window.t("nav.atlas") : "Failure Atlas",    href: "#" },
    { id: "docs",         label: window.t ? window.t("nav.docs") : "Docs",              href: "#" },
  ];
  return (
    <nav className="site-nav" style={{
      position: "absolute", top: 0, left: 0, right: 0, zIndex: 50,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 36, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="assets/brand/veldra-mark.png" style={{ width: 26, height: 26, filter: "invert(1) brightness(0.95)" }} />
          <span style={{ fontFamily: "var(--grotesk)", fontSize: 18, fontWeight: 600, letterSpacing: "0.04em" }}>VELDRA</span>
        </div>
        <div className="nav-pills" style={{ fontSize: 13 }}>
          {items.map(it => (
            <a key={it.id} href={it.href} style={{
              color: it.id === active ? "var(--fg)" : "var(--fg-dim)",
              textDecoration: "none", cursor: "pointer",
              borderBottom: it.id === active ? "1px solid var(--accent)" : "1px solid transparent",
              paddingBottom: 2,
            }}>{it.label}</a>
          ))}
        </div>
      </div>
      <div className="nav-actions">
        <div style={{ display: "flex", gap: 6, fontSize: 11, fontFamily: "var(--mono)", letterSpacing: "0.1em", color: "var(--fg-dim)" }}>
          <span style={{ color: "var(--fg)" }}>EN</span><span>·</span><span>ES</span><span>·</span><span>中</span>
        </div>
        <a className="btn btn-ghost" style={{ fontSize: 12, padding: "8px 16px" }}>{window.t ? window.t("nav.github") : "GitHub ↗"}</a>
        <a className="btn btn-primary" href="legal/contact.html" style={{ fontSize: 12, padding: "8px 16px" }}>{window.t ? window.t("nav.try") : "Request access"}</a>
        <a title="Account · sign in" style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 32, height: 32, borderRadius: "50%",
          border: "1px solid var(--line)", color: "var(--fg-dim)",
          cursor: "pointer", textDecoration: "none",
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" /></svg>
        </a>
      </div>
    </nav>
  );
};

/* ---------- Persistent site footer ---------- */
const SiteFooter = () => (
  <section className="section" style={{ background: "var(--bg)", borderTop: "1px solid var(--line)", paddingTop: 64, paddingBottom: 32 }}>
    <div style={{ maxWidth: 1320, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 48, marginBottom: 64 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <img src="assets/brand/veldra-mark.png" style={{ width: 26, height: 26, filter: "invert(1) brightness(0.95)" }} />
            <span style={{ fontFamily: "var(--grotesk)", fontSize: 18, fontWeight: 600, letterSpacing: "0.04em" }}>VELDRA</span>
          </div>
          <div style={{ fontSize: 13, color: "var(--fg-dim)", lineHeight: 1.55, maxWidth: 320 }}>
            ReserveGrid OS — open infrastructure for hashrate consumers. Two-layer template verification, source-available, escrow-backed.
          </div>
        </div>
        {[
          { h: "Product",     items: ["Overview", "Invariant Shield", "Reason Codes", "Configuration", "Roadmap"] },
          { h: "Architecture",items: ["How it works", "Trust layers", "Threat model", "rg-consensus", "Performance"] },
          { h: "Resources",   items: ["Docs", "Failure Atlas", "Compare", "GitHub", "Status"] },
          { h: "Company",     items: ["About", "Principles", "Services", "Contact", "Privacy"] },
        ].map(col => (
          <div key={col.h}>
            <div className="mono" style={{ fontSize: 11, color: "var(--fg)", letterSpacing: "0.14em", marginBottom: 16 }}>{col.h.toUpperCase()}</div>
            <div style={{ display: "grid", gap: 10, fontSize: 13, color: "var(--fg-dim)" }}>
              {col.items.map(i => <a key={i} style={{ color: "inherit", textDecoration: "none", cursor: "pointer" }}>{i}</a>)}
            </div>
          </div>
        ))}
      </div>
      <div style={{
        paddingTop: 24, borderTop: "1px solid var(--line)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        color: "var(--fg-dim)", fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.1em",
      }}>
        <span>{window.t ? window.t("footer.copy") : "© 2026 VELDRA, INC."}</span>
        <span>{window.t ? window.t("footer.version") : "RESERVEGRID OS · v1.1.0 · v2.0.0 INVARIANT SHIELD WIRED"}</span>
        <span>EN · ES · 中</span>
      </div>
    </div>
  </section>
);

/* ---------- Section header primitive ---------- */
const SectionHeader = ({ eyebrow, title, sub, align = "left", maxWidth = 720 }) => (
  <div style={{ marginBottom: 56, textAlign: align, maxWidth, marginLeft: align === "center" ? "auto" : 0, marginRight: align === "center" ? "auto" : 0 }}>
    {eyebrow && <div className="eyebrow">{eyebrow}</div>}
    {title && <h2 style={{
      fontFamily: "var(--grotesk)", fontSize: 56, fontWeight: 500, lineHeight: 1.05,
      letterSpacing: "-0.025em", margin: 0, color: "var(--fg)",
    }}>{title}</h2>}
    {sub && <p style={{ fontSize: 18, color: "var(--fg-dim)", lineHeight: 1.55, marginTop: 20 }}>{sub}</p>}
  </div>
);

/* ---------- Reason code pill ---------- */
const ReasonCodePill = ({ code, cls = "D" }) => {
  const colors = {
    L1: "var(--accent)",
    S:  "var(--accent-2, oklch(72% 0.16 145))",
    D:  "var(--accent-2, oklch(72% 0.16 145))",
    M:  "var(--accent-3, oklch(70% 0.14 220))",
  };
  return (
    <span className="mono" style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "3px 8px", borderRadius: 2,
      border: `1px solid ${colors[cls]}`,
      color: colors[cls],
      background: `color-mix(in oklab, ${colors[cls]} 8%, transparent)`,
      fontSize: 11, letterSpacing: "0.04em",
    }}>{code}</span>
  );
};

Object.assign(window, { WiredBadge, SiteNav, SiteFooter, SectionHeader, ReasonCodePill });
