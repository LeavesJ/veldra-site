/* ============================================================================
   VELDRA · Legal page shell  (Phase 4 · Approach C — chrome i18n only)
   - Top nav: lang toggle (EN · ES · 中) flips chrome strings.
   - Body of each legal page stays English (legally controlling text).
   - In ES / ZH a controlling-language notice appears above the body.
   ============================================================================ */

const LegalNav = () => {
  const [lang, setLangState] = React.useState(
    (typeof window !== "undefined" && window.getLang && window.getLang()) || "en"
  );
  React.useEffect(() => {
    const onLang = (e) => setLangState((e && e.detail && e.detail.lang) || window.getLang());
    window.addEventListener("__lang_changed", onLang);
    return () => window.removeEventListener("__lang_changed", onLang);
  }, []);
  const switchLang = (l) => { if (window.setLang) window.setLang(l); };
  const langBtn = (code, label) => (
    <button onClick={() => switchLang(code)} style={{
      background: "transparent", border: "none", padding: "2px 4px", cursor: "pointer",
      color: lang === code ? "var(--fg)" : "var(--fg-dim)",
      fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.1em",
      textDecoration: lang === code ? "underline" : "none", textUnderlineOffset: 4,
    }}>{label}</button>
  );

  return (
    <nav style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "22px 64px", borderBottom: "1px solid var(--line)",
      background: "var(--bg)", position: "sticky", top: 0, zIndex: 50,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
        <a href="/" style={{
          display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: "inherit",
        }}>
          <img src="../assets/brand/veldra-mark.png" alt="Veldra"
               style={{ width: 26, height: 26, filter: "invert(1) brightness(0.95)" }} />
          <span style={{ fontFamily: "var(--grotesk)", fontSize: 18, fontWeight: 600, letterSpacing: "0.04em" }}>VELDRA</span>
        </a>
        <div style={{ display: "flex", gap: 28, fontSize: 13, color: "var(--fg-dim)" }}>
          {[
            { l: t("nav.architecture"),  h: "../architecture.html" },
            { l: t("shell.nav.product"), h: "../product.html" },
            { l: t("nav.atlas"),         h: "../failure-atlas.html" },
            { l: t("nav.qa"),            h: "../questions.html" },
          ].map(({ l, h }) => (
            <a key={h} href={h} style={{ color: "inherit", textDecoration: "none" }}>{l}</a>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ display: "flex", gap: 2, alignItems: "center", fontSize: 11, color: "var(--fg-dim)" }}>
          {langBtn("en", "EN")}<span>·</span>{langBtn("es", "ES")}<span>·</span>{langBtn("zh", "中")}
        </div>
        <a className="btn btn-ghost" href="https://github.com/LeavesJ/veldra" target="_blank" rel="noreferrer" style={{ fontSize: 12, padding: "8px 16px" }}>{t("nav.github")}</a>
        <a className="btn btn-primary" href="contact.html" style={{ fontSize: 12, padding: "8px 16px" }}>{t("nav.try")}</a>
      </div>
    </nav>
  );
};

const LegalFooter = () => {
  const [, setTick] = React.useState(0);
  React.useEffect(() => {
    const onLang = () => setTick(x => x + 1);
    window.addEventListener("__lang_changed", onLang);
    return () => window.removeEventListener("__lang_changed", onLang);
  }, []);

  return (
    <footer style={{
      padding: "48px 64px 64px", borderTop: "1px solid var(--line)",
      background: "var(--bg-2)", marginTop: 64,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 48, flexWrap: "wrap" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <img src="../assets/brand/veldra-mark.png" alt="Veldra"
                 style={{ width: 22, height: 22, filter: "invert(1) brightness(0.95)" }} />
            <span style={{ fontFamily: "var(--grotesk)", fontSize: 16, fontWeight: 600, letterSpacing: "0.04em" }}>VELDRA</span>
          </div>
          <p style={{ fontSize: 12, color: "var(--fg-dim)", lineHeight: 1.6, maxWidth: 360, margin: 0 }}>
            {t("shell.footer.tagline")}
          </p>
        </div>
        <div style={{ display: "flex", gap: 64, flexWrap: "wrap" }}>
          <FootCol title={t("shell.footer.col.surfaces")} items={[
            [t("nav.architecture"),  "../architecture.html"],
            [t("shell.nav.product"), "../product.html"],
            [t("nav.atlas"),         "../failure-atlas.html"],
            [t("nav.qa"),            "../questions.html"],
          ]}/>
          <FootCol title={t("shell.footer.col.operate")} items={[
            [t("shell.footer.try"),     "contact.html"],
            [t("shell.footer.license"), "license.html"],
            [t("nav.github"),           "https://github.com/LeavesJ/veldra"],
          ]}/>
          <FootCol title={t("shell.footer.col.company")} items={[
            [t("shell.footer.about"),   "about.html"],
            [t("shell.footer.contact"), "contact.html"],
          ]}/>
        </div>
      </div>
      <div style={{
        marginTop: 48, paddingTop: 24, borderTop: "1px solid var(--line)",
        display: "flex", justifyContent: "space-between", color: "var(--fg-dim)",
        fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.1em",
        flexWrap: "wrap", gap: 16,
      }}>
        <span>{t("footer.copy")}</span>
        <span>{t("footer.version")}</span>
        <span style={{ display: "flex", gap: 14 }}>
          <a href="privacy.html" style={{ color: "inherit", textDecoration: "none" }}>{t("footer.privacy")}</a>
          <span>·</span>
          <a href="terms.html" style={{ color: "inherit", textDecoration: "none" }}>{t("footer.terms")}</a>
          <span>·</span>
          <a href="disclaimer.html" style={{ color: "inherit", textDecoration: "none" }}>{t("footer.disclaimer")}</a>
        </span>
      </div>
    </footer>
  );
};

const FootCol = ({ title, items }) => (
  <div>
    <div className="mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--fg-dim)", marginBottom: 12, textTransform: "uppercase" }}>{title}</div>
    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map(([l, h]) => (
        <li key={l}>
          <a href={h} style={{ fontSize: 13, color: "var(--fg)", textDecoration: "none" }}>{l}</a>
        </li>
      ))}
    </ul>
  </div>
);

/* Sticky-TOC active-section tracking */
const useActiveSection = (ids) => {
  const [active, setActive] = React.useState(ids[0] || "");
  React.useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      const visible = entries.filter(e => e.isIntersecting);
      if (visible.length > 0) {
        const top = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b
        );
        setActive(top.target.id);
      }
    }, { rootMargin: "-20% 0px -70% 0px", threshold: 0 });
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [ids.join("|")]);
  return active;
};

/* Controlling-language notice — only renders when lang !== "en". */
const ControllingNotice = () => {
  const [lang, setLangState] = React.useState(
    (typeof window !== "undefined" && window.getLang && window.getLang()) || "en"
  );
  React.useEffect(() => {
    const onLang = () => setLangState(window.getLang());
    window.addEventListener("__lang_changed", onLang);
    return () => window.removeEventListener("__lang_changed", onLang);
  }, []);
  if (lang === "en") return null;
  return (
    <div style={{
      border: "1px solid var(--line)",
      borderLeft: "3px solid var(--accent)",
      background: "var(--bg-2)",
      padding: "16px 20px",
      marginBottom: 32,
      fontSize: 13,
      lineHeight: 1.6,
    }}>
      <div className="mono" style={{
        fontSize: 10, letterSpacing: "0.18em", color: "var(--accent)",
        textTransform: "uppercase", marginBottom: 6,
      }}>
        ▸ {t("legal.controlling.title")}
      </div>
      <p style={{ margin: 0, color: "var(--fg-dim)" }}>
        {t("legal.controlling.body")}
      </p>
    </div>
  );
};

const LegalShell = ({ title, eyebrow, updated, toc, children }) => {
  // Re-render whole shell on lang change so eyebrow/title/toc t() calls update
  const [, setTick] = React.useState(0);
  React.useEffect(() => {
    const onLang = () => setTick(x => x + 1);
    window.addEventListener("__lang_changed", onLang);
    return () => window.removeEventListener("__lang_changed", onLang);
  }, []);

  const ids = toc.map(([id]) => id);
  const active = useActiveSection(ids);

  return (
    <>
      <LegalNav />
      <main>
        {/* Hero */}
        <section style={{
          padding: "96px 80px 64px", maxWidth: 1320, margin: "0 auto",
        }}>
          <div className="eyebrow">{t(`legal.eyebrow.${eyebrow}`)}</div>
          <h1 style={{
            fontFamily: "var(--grotesk)", fontSize: 84, fontWeight: 500,
            lineHeight: 1.0, letterSpacing: "-0.035em",
            margin: "16px 0 24px", maxWidth: 1100, textWrap: "balance",
          }}>
            {t(`legal.title.${eyebrow}`)}
          </h1>
          <p className="mono" style={{
            fontSize: 12, color: "var(--fg-dim)", letterSpacing: "0.12em",
            margin: 0,
          }}>
            {t("legal.updated_label")} · {updated}
          </p>
        </section>

        {/* Two-column body */}
        <section style={{
          padding: "16px 80px 64px", maxWidth: 1320, margin: "0 auto",
          display: "grid", gridTemplateColumns: "240px 1fr", gap: 64,
        }}>
          {/* Sticky TOC */}
          <aside style={{ position: "sticky", top: 96, alignSelf: "start", maxHeight: "calc(100vh - 120px)", overflowY: "auto" }}>
            <div className="mono" style={{
              fontSize: 10, color: "var(--fg-dim)", letterSpacing: "0.18em",
              marginBottom: 16, textTransform: "uppercase",
            }}>
              {t("legal.toc_label")}
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {toc.map(([id, label]) => (
                <li key={id}>
                  <a href={`#${id}`} style={{
                    fontSize: 13, lineHeight: 1.4,
                    color: active === id ? "var(--fg)" : "var(--fg-dim)",
                    textDecoration: "none",
                    paddingLeft: 12,
                    borderLeft: active === id
                      ? "2px solid var(--accent)"
                      : "2px solid transparent",
                    display: "block",
                    transition: "color 0.15s, border-color 0.15s",
                  }}>{label}</a>
                </li>
              ))}
            </ul>
          </aside>

          {/* Body — English text remains controlling. ES/ZH show notice above. */}
          <article className="legal-body" style={{
            fontSize: 16, lineHeight: 1.7, color: "var(--fg)",
            maxWidth: 760,
          }}>
            <ControllingNotice />
            {children}
          </article>
        </section>
      </main>
      <LegalFooter />

      {/* Body styles for legal long-form copy */}
      <style>{`
        .legal-body h2 {
          font-family: var(--grotesk);
          font-size: 28px;
          font-weight: 500;
          letter-spacing: -0.015em;
          margin: 56px 0 16px;
          line-height: 1.2;
          scroll-margin-top: 96px;
          color: var(--fg);
        }
        .legal-body h2:first-of-type { margin-top: 0; }
        .legal-body h3 {
          font-family: var(--grotesk);
          font-size: 18px;
          font-weight: 500;
          letter-spacing: -0.005em;
          margin: 32px 0 10px;
          color: var(--fg);
        }
        .legal-body p {
          margin: 0 0 18px;
          color: var(--fg-dim);
        }
        .legal-body strong { color: var(--fg); font-weight: 500; }
        .legal-body a {
          color: var(--accent);
          text-decoration: none;
          border-bottom: 1px solid color-mix(in oklch, var(--accent) 40%, transparent);
        }
        .legal-body a:hover { border-bottom-color: var(--accent); }
        .legal-body ul, .legal-body ol {
          color: var(--fg-dim);
          padding-left: 22px;
          margin: 0 0 18px;
        }
        .legal-body ul li, .legal-body ol li { margin-bottom: 8px; }
        .legal-body code {
          font-family: var(--mono);
          font-size: 13.5px;
          background: var(--bg-2);
          border: 1px solid var(--line);
          padding: 2px 6px;
          border-radius: 3px;
          color: var(--fg);
        }
      `}</style>
    </>
  );
};

window.LegalShell = LegalShell;
window.LegalNav = LegalNav;
window.LegalFooter = LegalFooter;
