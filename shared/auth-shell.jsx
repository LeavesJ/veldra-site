/* ============================================================================
   VELDRA · Auth page shell
   Mirrors shared/page-shell.jsx::TopNav with ../-prefixed paths so the auth
   pages at /login/, /register/, /verify/, /forgot-password/, /reset-password/,
   /account/ render the same banner as Architecture, Product, etc.

   Internal nav links use absolute paths (/login/, /register/, etc.) so they
   resolve cleanly regardless of which auth page is hosting the shell. Cross
   surface links use ../ to step out of the auth page directory back to root.
   ============================================================================ */

const AuthNav = ({ active }) => {
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
            { k: "architecture",  l: t("nav.architecture"),  h: "../architecture.html" },
            { k: "product",       l: t("shell.nav.product"), h: "../product.html" },
            { k: "atlas",         l: t("nav.atlas"),         h: "../failure-atlas.html" },
            { k: "qa",            l: t("nav.qa"),            h: "../questions.html" },
            { k: "docs",          l: t("nav.docs"),          h: "../docs.html" },
            { k: "status",        l: t("nav.status"),        h: "../status.html" },
          ].map(({ k, l, h }) => {
            const isActive = k === active;
            return (
              <a key={k} href={h} style={{
                color: isActive ? "var(--fg)" : "inherit", textDecoration: "none",
                borderBottom: isActive ? "1px solid var(--accent)" : "1px solid transparent",
                paddingBottom: 2,
              }}>{l}</a>
            );
          })}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ display: "flex", gap: 2, alignItems: "center", fontSize: 11, color: "var(--fg-dim)" }}>
          {langBtn("en", "EN")}<span>·</span>{langBtn("es", "ES")}<span>·</span>{langBtn("zh", "中")}
        </div>
        <a className="btn btn-ghost" href="https://github.com/LeavesJ/veldra" target="_blank" rel="noreferrer" style={{ fontSize: 12, padding: "8px 16px" }}>{t("nav.github")}</a>
        <a className="btn btn-primary" href="/register/" style={{ fontSize: 12, padding: "8px 16px" }}>{t("nav.try")}</a>
        <a href="/login/" title={t("auth.link.signin")} style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 32, height: 32, borderRadius: "50%", border: "1px solid var(--line)", color: "var(--fg-dim)",
          textDecoration: "none",
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>
        </a>
      </div>
    </nav>
  );
};

const AuthFooter = () => {
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
            [t("nav.docs"),          "../docs.html"],
            [t("nav.status"),        "../status.html"],
          ]}/>
          <FootCol title={t("shell.footer.col.operate")} items={[
            [t("auth.link.signin"),    "/login/"],
            [t("auth.link.request_access"), "/register/"],
            [t("shell.footer.license"),"../legal/license.html"],
            [t("nav.github"),          "https://github.com/LeavesJ/veldra"],
          ]}/>
          <FootCol title={t("shell.footer.col.company")} items={[
            [t("shell.footer.about"),  "../legal/about.html"],
            [t("shell.footer.contact"),"../legal/contact.html"],
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
          <a href="../legal/privacy.html"   style={{ color: "inherit", textDecoration: "none" }}>{t("footer.privacy")}</a>
          <span>·</span>
          <a href="../legal/terms.html"     style={{ color: "inherit", textDecoration: "none" }}>{t("footer.terms")}</a>
          <span>·</span>
          <a href="../legal/disclaimer.html" style={{ color: "inherit", textDecoration: "none" }}>{t("footer.disclaimer")}</a>
        </span>
      </div>
    </footer>
  );
};

Object.assign(window, { AuthNav, AuthFooter });
