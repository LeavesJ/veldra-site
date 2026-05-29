/* Variant C — TRUST LAYERS (concept-led, animated)
   FRAMING (corrected):
     Layer 1 = Operational Gateway
     Layer 2 = Invariant Shield (one feature, three check classes across two phases)
        Phase 1 = Class S (structural) + Class D (declared-vs-derived re-derivation)
                  Phase 1.5 fills remaining 7 Tier 3 invariants under Phase 1
        Phase 2 = Class M (mempool ground truth)

   Hero feature: a "trust prism" with TWO faces (the two layers).
   Layer 2 expands to reveal its three internal check classes (S, D, M)
   in a stacked sub-card. */

const VariantLayers = () => {
  const [layer, setLayer] = React.useState(1);  // 0 = Operational Gateway, 1 = Invariant Shield
  const [shieldClass, setShieldClass] = React.useState(
    (typeof window !== "undefined" && window.__tweaks && window.__tweaks.activeShieldClass) || "D"
  );
  const [autoRotate, setAutoRotate] = React.useState(
    typeof window === "undefined" || !window.__tweaks ? true : !!window.__tweaks.autoRotatePrism
  );
  // Re-render whenever language changes so every t() call re-evaluates.
  const [, setLangTick] = React.useState(0);
  React.useEffect(() => {
    const onLang = () => setLangTick(x => x + 1);
    window.addEventListener("__lang_changed", onLang);
    return () => window.removeEventListener("__lang_changed", onLang);
  }, []);

  // Listen to Tweaks-panel changes so the prism reflects the panel state live.
  React.useEffect(() => {
    const onTweaks = (e) => {
      const t = e.detail || {};
      if (typeof t.autoRotatePrism === "boolean") setAutoRotate(t.autoRotatePrism);
      if (t.activeShieldClass && ["S", "D", "M"].includes(t.activeShieldClass)) {
        setShieldClass(t.activeShieldClass);
      }
    };
    window.addEventListener("__tweaks_changed", onTweaks);
    return () => window.removeEventListener("__tweaks_changed", onTweaks);
  }, []);

  // Auto-cycle through the Shield's classes when on Shield
  React.useEffect(() => {
    if (!autoRotate) return;
    const id = setInterval(() => {
      setLayer(l => {
        if (l === 0) return 1;
        // when on shield, cycle classes
        return 1;
      });
      setShieldClass(c => (c === "S" ? "D" : c === "D" ? "M" : "S"));
    }, 4200);
    return () => clearInterval(id);
  }, [autoRotate]);

  return (
    <div className="variant-page" data-variant="layers" style={{ minHeight: 3500 }}>
      <LayersNav />
      <LayersHero layer={layer} setLayer={setLayer}
                  shieldClass={shieldClass} setShieldClass={setShieldClass}
                  setAutoRotate={setAutoRotate} />
      <LayersThesis />
      <ShieldAnatomy />
      <LayersFlowDiagram />
      <LayersThreatToggle />
      <LayersTimeline />
      <LayersFooterCTA />
    </div>
  );
};

const LayersNav = () => {
  const [lang, setLangState] = React.useState((typeof window !== "undefined" && window.getLang && window.getLang()) || "en");
  const switchLang = (l) => {
    if (window.setLang) window.setLang(l);
    setLangState(l);
  };
  // Mirrors shared/page-shell.jsx::TopNav so the homepage banner matches
  // every other page. "Invariant Shield" used to be a no-target nav entry;
  // its content is the homepage hero itself, so a dedicated link added
  // confusion. Product, Docs, and Status are now reachable from the homepage.
  const navItems = [
    [t("nav.architecture"),  "Architecture.html"],
    [t("shell.nav.product"), "Product.html"],
    [t("nav.atlas"),         "Failure Atlas.html"],
    [t("nav.qa"),            "questions.html"],
    ["Docs",                 "Docs.html"],
    ["Status",               "status.html"],
  ];
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
    padding: "22px 48px", position: "absolute", top: 0, left: 0, right: 0, zIndex: 50,
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
      <a href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: "inherit" }}>
        <img src="assets/brand/veldra-mark.png" style={{ width: 26, height: 26, filter: "invert(1) brightness(0.95)" }} />
        <span style={{ fontFamily: "var(--grotesk)", fontSize: 18, fontWeight: 600, letterSpacing: "0.04em" }}>VELDRA</span>
      </a>
      <div style={{ display: "flex", gap: 28, fontSize: 13, color: "var(--fg-dim)" }}>
        {navItems.map(([l, h]) => (
          <a key={l} href={h || "#"} style={{ color: "inherit", textDecoration: "none", cursor: "pointer" }}>{l}</a>
        ))}
      </div>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ display: "flex", gap: 2, alignItems: "center", fontSize: 11, color: "var(--fg-dim)" }}>
        {langBtn("en", "EN")}<span>·</span>{langBtn("es", "ES")}<span>·</span>{langBtn("zh", "中")}
      </div>
      <a className="btn btn-ghost" href="https://github.com/LeavesJ/veldra" target="_blank" rel="noreferrer" style={{ fontSize: 12, padding: "8px 16px" }}>{t("nav.github")}</a>
      <a className="btn btn-primary" href="/register/" style={{ fontSize: 12, padding: "8px 16px" }}>{t("nav.try")}</a>
      <a href="/login/" title="Sign in" style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 32, height: 32, borderRadius: "50%",
        border: "1px solid var(--line)", color: "var(--fg-dim)",
        cursor: "pointer", textDecoration: "none", transition: "all 0.25s",
        position: "relative",
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent-2)"; e.currentTarget.style.color = "var(--accent-2)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.color = "var(--fg-dim)"; }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" /></svg>
      </a>
    </div>
  </nav>
  );
};

/* ============== HERO ============== */
const LayersHero = ({ layer, setLayer, shieldClass, setShieldClass, setAutoRotate }) => {
  const layerData = [
    { num: "01", name: t("hero.layer.gateway"), short: "Gateway", color: "var(--accent)",   desc: t("hero.gateway.desc"),
      cta: { primary: t("hero.cta.gateway.primary"), ghost: t("hero.cta.gateway.ghost") } },
    { num: "02", name: t("hero.layer.shield"),  short: "Shield",  color: "var(--accent-2)", desc: t("hero.shield.desc"),
      cta: { primary: t("hero.cta.shield.primary"),  ghost: t("hero.cta.shield.ghost") } },
  ];
  const active = layerData[layer];
  return (
    <section style={{ position: "relative", padding: "140px 48px 100px", minHeight: 880, overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 900px 600px at 70% 50%, ${active.color}22, transparent 60%)`,
        transition: "background 1s ease",
      }} />
      <div style={{
        position: "absolute", inset: 0, opacity: 0.4,
        backgroundImage: "linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        maskImage: "radial-gradient(ellipse at center, #000 30%, transparent 80%)",
      }} />

      <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 64, alignItems: "center", maxWidth: 1320, margin: "0 auto" }}>
        <div>
          <div className="mono" style={{ fontSize: 11, color: active.color, letterSpacing: "0.2em", marginBottom: 24, transition: "color 0.6s" }}>
            {layer === 0 ? t("hero.eyebrow.l1") : t("hero.eyebrow.l2")}
          </div>
          <h1 style={{
            fontFamily: "var(--grotesk)", fontSize: 76, lineHeight: 1.0, fontWeight: 500,
            margin: 0, letterSpacing: "-0.03em",
          }}>
            {t("hero.h1.line1")}<br/>
            <span style={{ color: active.color, transition: "color 0.6s" }}>{t("hero.h1.line2")}</span><br/>
            <span style={{ color: "var(--fg-dim)" }}>{t("hero.h1.line3")}</span>
          </h1>
          <p style={{ fontSize: 19, lineHeight: 1.55, color: "var(--fg-dim)", maxWidth: 560, marginTop: 32 }}
             dangerouslySetInnerHTML={{ __html: t("hero.lede.html") }} />

          {/* Layer pills */}
          <div style={{ display: "flex", gap: 8, marginTop: 36 }}>
            {layerData.map((l, i) => (
              <button
                key={i}
                onClick={() => { setLayer(i); setAutoRotate(false); }}
                style={{
                  padding: "10px 16px", borderRadius: 999,
                  background: layer === i ? `${l.color}1a` : "transparent",
                  border: `1px solid ${layer === i ? l.color : "var(--line)"}`,
                  color: layer === i ? l.color : "var(--fg-dim)",
                  fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.1em",
                  cursor: "pointer", transition: "all 0.3s",
                }}
              >
                <span style={{ marginRight: 6 }}>L{l.num}</span>
                {l.name}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
            <a className="btn btn-primary" key={`p-${layer}`}>{active.cta.primary}</a>
            <a className="btn btn-ghost"   key={`g-${layer}`}>{active.cta.ghost}</a>
          </div>
        </div>

        <TrustPrism layer={layer} layerData={layerData}
                    shieldClass={shieldClass} setShieldClass={setShieldClass}
                    setAutoRotate={setAutoRotate} />
      </div>

      <LayersTicker />
    </section>
  );
};

/* Two-face device. Front = active layer.
   Layer 1 = Gateway (perimeter checkpoint, packets flowing through, declared-field stamps)
   Layer 2 = Shield (concentric runic shield with S / D / M check-classes inscribed) */
const TrustPrism = ({ layer, layerData, shieldClass, setShieldClass, setAutoRotate }) => {
  const angles = [0, -180];
  const rotY = angles[layer];
  return (
    <div style={{ position: "relative", height: 520, perspective: 1800, perspectiveOrigin: "50% 50%" }}>
      <div style={{
        position: "absolute", inset: 0, transformStyle: "preserve-3d",
        transform: `rotateY(${rotY}deg) rotateX(-6deg)`,
        transition: "transform 1.4s cubic-bezier(0.65, 0.0, 0.15, 1)",
      }}>
        {/* Layer 1 face — Gateway */}
        <DeviceFace layerData={layerData[0]} angle={0}>
          <GatewayIllustration color={layerData[0].color} />
        </DeviceFace>

        {/* Layer 2 face — Shield */}
        <DeviceFace layerData={layerData[1]} angle={180}>
          <ShieldIllustration color={layerData[1].color}
            shieldClass={shieldClass} setShieldClass={setShieldClass} setAutoRotate={setAutoRotate} />
        </DeviceFace>
      </div>
      {/* Pedestal glow */}
      <div style={{
        position: "absolute", left: "50%", bottom: 20, width: 360, height: 70,
        transform: "translateX(-50%)",
        background: `radial-gradient(ellipse, ${layerData[layer].color}44, transparent 70%)`,
        filter: "blur(24px)",
        transition: "background 1s ease",
      }} />
    </div>
  );
};

const DeviceFace = ({ layerData: l, angle, children }) => (
  <div style={{
    position: "absolute", left: "50%", top: "50%",
    width: 420, height: 500,
    transformOrigin: "50% 50%",
    transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(220px)`,
    background: `linear-gradient(180deg, ${l.color}1f 0%, ${l.color}05 60%, transparent 100%)`,
    border: `1px solid ${l.color}`,
    borderRadius: 10,
    padding: "26px 26px 22px",
    boxShadow: `0 0 100px ${l.color}33, inset 0 0 80px ${l.color}0a`,
    backfaceVisibility: "hidden",
    display: "flex", flexDirection: "column",
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
      <div className="mono" style={{ fontSize: 11, color: l.color, letterSpacing: "0.22em" }}>LAYER {l.num}</div>
      <div className="mono" style={{ fontSize: 9, color: "var(--fg-dim)", letterSpacing: "0.18em" }}>RG-CONSENSUS</div>
    </div>
    <div style={{ fontFamily: "var(--grotesk)", fontSize: 30, fontWeight: 500, marginTop: 6, letterSpacing: "-0.02em" }}>{l.name}</div>
    <div className="mono" style={{ fontSize: 10, color: "var(--fg-dim)", marginTop: 6, letterSpacing: "0.05em", lineHeight: 1.5 }}>{l.desc}</div>
    <div style={{ flex: 1, marginTop: 14, position: "relative", minHeight: 0 }}>
      {children}
    </div>
  </div>
);

/* Gateway = a checkpoint arch. Block-template packets enter from the left lane,
   pass under a stone-cut archway where declared fields are inspected against
   the policy threshold strip, and exit stamped/verdicted on the right.
   Architecture: portcullis frame + lintel + base plinth + inspection lane. */
const GatewayIllustration = ({ color }) => {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60);
    return () => clearInterval(id);
  }, []);

  // Sliding row of declared-field tags being inspected (purely visual).
  const tags = ["coinbase_value", "merkle_root", "weight", "sigops", "tx_count", "fee_avg", "header"];

  // Packet positions (0..1 along the lane). When a packet is under the arch,
  // it dims and the lintel scan-line crosses it.
  const packets = [0, 1, 2, 3].map(i => {
    const phase = ((tick * 0.014) + i * 0.27) % 1;
    return { id: i, t: phase };
  });

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <svg viewBox="0 0 380 340" style={{ width: "100%", height: "100%", display: "block" }} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="gw-pillar" x1="0" x2="1">
            <stop offset="0%"  stopColor={color} stopOpacity="0.35" />
            <stop offset="50%" stopColor={color} stopOpacity="0.12" />
            <stop offset="100%" stopColor={color} stopOpacity="0.35" />
          </linearGradient>
          <linearGradient id="gw-floor" x1="0" x2="1">
            <stop offset="0%"   stopColor={color} stopOpacity="0" />
            <stop offset="50%"  stopColor={color} stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--good)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gw-scan" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%"   stopColor={color} stopOpacity="0" />
            <stop offset="50%"  stopColor={color} stopOpacity="0.55" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
          <clipPath id="gw-arch-clip">
            <path d="M 110,200 L 110,110 Q 110,80 140,80 L 240,80 Q 270,80 270,110 L 270,200 Z" />
          </clipPath>
          <clipPath id="gw-tagstrip">
            <rect x="120" y="206" width="140" height="20" rx="3" />
          </clipPath>
        </defs>

        {/* === Lane (floor) === */}
        <line x1="20"  y1="200" x2="360" y2="200" stroke="url(#gw-floor)" strokeWidth="1.4" />
        <line x1="20"  y1="204" x2="360" y2="204" stroke="url(#gw-floor)" strokeWidth="0.6" strokeOpacity="0.35" />

        {/* lane endpoints */}
        <text x="22" y="214" fontSize="8" fontFamily="var(--mono)" fill="var(--fg-dim)" letterSpacing="1">INGRESS</text>
        <text x="358" y="214" fontSize="8" fontFamily="var(--mono)" fill="var(--good)" textAnchor="end" letterSpacing="1">VERDICT →</text>

        {/* === Plinth / base === */}
        <rect x="92"  y="200" width="36" height="14" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="0.8" />
        <rect x="252" y="200" width="36" height="14" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="0.8" />

        {/* === Pillars === */}
        <rect x="100" y="100" width="20" height="100" fill="url(#gw-pillar)" stroke={color} strokeWidth="1" />
        <rect x="260" y="100" width="20" height="100" fill="url(#gw-pillar)" stroke={color} strokeWidth="1" />
        {/* pillar inner shadows / depth marks */}
        <line x1="106" y1="104" x2="106" y2="196" stroke={color} strokeOpacity="0.5" strokeWidth="0.6" />
        <line x1="266" y1="104" x2="266" y2="196" stroke={color} strokeOpacity="0.5" strokeWidth="0.6" />

        {/* === Arch / lintel === */}
        <path d="M 100,100 L 100,90 Q 100,60 130,60 L 250,60 Q 280,60 280,90 L 280,100 Z"
              fill={color} fillOpacity="0.22" stroke={color} strokeWidth="1" />
        {/* keystone */}
        <rect x="183" y="58" width="14" height="14" fill={color} fillOpacity="0.5" stroke={color} strokeWidth="1" />
        <text x="190" y="69" fontSize="7" fontFamily="var(--mono)" fontWeight="600" textAnchor="middle" fill="var(--bg)">L1</text>

        {/* === Inside the arch: scan beam + sliding tag strip === */}
        <g clipPath="url(#gw-arch-clip)">
          {/* moving horizontal scan light */}
          <rect x="110" y="100" width="160" height="14" fill="url(#gw-scan)">
            <animate attributeName="y" from="100" to="186" dur="2.6s" repeatCount="indefinite" />
          </rect>
          {/* faint vertical inspection rays */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <line key={i} x1={120 + i * 28} y1="100" x2={120 + i * 28} y2="200"
                  stroke={color} strokeOpacity="0.08" strokeWidth="0.6" />
          ))}
        </g>

        {/* === Declared-field tag strip — moves under the arch === */}
        <g clipPath="url(#gw-tagstrip)">
          {tags.map((t, i) => {
            const offset = (((tick * 0.6) + i * 24) % 200) - 24;
            return (
              <g key={i} transform={`translate(${120 + offset}, 210)`}>
                <rect x="0" y="0" width="22" height="12" rx="1.5"
                      fill="var(--bg-3)" stroke={color} strokeWidth="0.8" strokeOpacity="0.7" />
                <text x="11" y="8.5" fontSize="6" fontFamily="var(--mono)" textAnchor="middle" fill={color}>
                  {t.slice(0, 6)}
                </text>
              </g>
            );
          })}
        </g>
        {/* tag-strip frame */}
        <rect x="120" y="206" width="140" height="20" rx="3"
              fill="none" stroke={color} strokeWidth="0.8" strokeOpacity="0.5" />
        <text x="124" y="240" fontSize="7" fontFamily="var(--mono)" fill="var(--fg-dim)" letterSpacing="1.5">DECLARED FIELDS · INSPECTED</text>

        {/* === Packets traversing the lane === */}
        {packets.map(p => {
          const x = 30 + p.t * 320;
          const inArch = x > 110 && x < 270;
          const passed = x >= 270;
          const c = passed ? "var(--good)" : color;
          return (
            <g key={p.id}>
              <rect x={x - 9} y={193} width="18" height="14" rx="2"
                    fill={c} fillOpacity={inArch ? 0.45 : 0.85}
                    stroke={c} strokeWidth="0.8" />
              <line x1={x - 5} y1={196} x2={x + 5} y2={196} stroke="var(--bg)" strokeOpacity="0.5" strokeWidth="0.6" />
              <line x1={x - 5} y1={199} x2={x + 5} y2={199} stroke="var(--bg)" strokeOpacity="0.5" strokeWidth="0.6" />
              <line x1={x - 5} y1={202} x2={x + 5} y2={202} stroke="var(--bg)" strokeOpacity="0.5" strokeWidth="0.6" />
              {/* pass-stamp halo on the verdict side */}
              {passed && (
                <circle cx={x} cy={200} r="13" fill="none" stroke="var(--good)"
                        strokeWidth="0.8" strokeOpacity={Math.max(0, 1 - (p.t - 0.71) * 5)} />
              )}
            </g>
          );
        })}

        {/* === Footer counter (in its own framed strip — no overflow) === */}
        <g transform="translate(20, 280)">
          <rect width="340" height="38" rx="3" fill="var(--bg-3)" stroke={color} strokeOpacity="0.4" strokeWidth="0.8" />
          {/* divider */}
          <line x1="113" y1="6" x2="113" y2="32" stroke={color} strokeOpacity="0.3" strokeWidth="0.6" />
          <line x1="226" y1="6" x2="226" y2="32" stroke={color} strokeOpacity="0.3" strokeWidth="0.6" />
          {/* col 1 */}
          <text x="56" y="16" fontSize="7" fontFamily="var(--mono)" textAnchor="middle" fill="var(--fg-dim)" letterSpacing="1.5">REASON CODES</text>
          <text x="56" y="30" fontSize="13" fontFamily="var(--mono)" fontWeight="600" textAnchor="middle" fill={color}>59</text>
          {/* col 2 */}
          <text x="170" y="16" fontSize="7" fontFamily="var(--mono)" textAnchor="middle" fill="var(--fg-dim)" letterSpacing="1.5">POLICY KEYS</text>
          <text x="170" y="30" fontSize="13" fontFamily="var(--mono)" fontWeight="600" textAnchor="middle" fill={color}>69</text>
          {/* col 3 */}
          <text x="283" y="16" fontSize="7" fontFamily="var(--mono)" textAnchor="middle" fill="var(--fg-dim)" letterSpacing="1.5">P99 LATENCY</text>
          <text x="283" y="30" fontSize="13" fontFamily="var(--mono)" fontWeight="600" textAnchor="middle" fill={color}>35ms</text>
        </g>
      </svg>
    </div>
  );
};

/* Shield = concentric protective form. Block bytes sit inside; three rings of inscriptions
   represent Class S, D, M. Click a class to highlight its ring + show its detail card. */
const ShieldIllustration = ({ color, shieldClass, setShieldClass, setAutoRotate }) => {
  const classes = {
    S: { label: "Class S · structural",            desc: "Header version, weight bound, sigops bound", phase: "Phase 1", count: "7 reserved (Phase 1.5)" },
    D: { label: "Class D · declared vs derived",   desc: "Re-derive coinbase, merkle, witness, tx_count from raw bytes", phase: "Phase 1", count: "22 reason codes (Class S + D + M)" },
    M: { label: "Class M · mempool ground truth",  desc: "Cross-reference template tx set vs operator's bitcoind", phase: "Phase 2", count: "4 metrics · fail-stale state machine" },
  };
  const c = classes[shieldClass];
  const ringConfig = {
    S: { r: 110, label: "S · structural" },
    D: { r: 86,  label: "D · declared vs derived" },
    M: { r: 62,  label: "M · mempool ground truth" },
  };
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
      {/* Shield SVG */}
      <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
        <svg viewBox="-160 -150 320 300" style={{ width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="shield-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%"   stopColor={color} stopOpacity="0.22" />
              <stop offset="60%"  stopColor={color} stopOpacity="0.08" />
              <stop offset="100%" stopColor={color} stopOpacity="0.02" />
            </linearGradient>
            <radialGradient id="shield-core" cx="0" cy="0" r="0.5">
              <stop offset="0%" stopColor={color} stopOpacity="0.7" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </radialGradient>
            <radialGradient id="shield-aura" cx="0" cy="0" r="0.7">
              <stop offset="0%"  stopColor={color} stopOpacity="0" />
              <stop offset="55%" stopColor={color} stopOpacity="0" />
              <stop offset="80%" stopColor={color} stopOpacity="0.18" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Aura behind everything */}
          <circle cx="0" cy="0" r="140" fill="url(#shield-aura)" />

          {/* Sigil rays — 24 thin radial lines outside the rings, fade outward */}
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i * 15) * Math.PI / 180;
            const r1 = 124, r2 = 138;
            return (
              <line key={`ray-${i}`}
                x1={Math.cos(a) * r1} y1={Math.sin(a) * r1}
                x2={Math.cos(a) * r2} y2={Math.sin(a) * r2}
                stroke={color} strokeOpacity={i % 6 === 0 ? 0.7 : 0.25} strokeWidth={i % 6 === 0 ? 1 : 0.6} />
            );
          })}

          {/* Outer shield silhouette — heater shape */}
          <path d="M 0,-140 C 90,-130 130,-100 130,-50 C 130,40 90,110 0,140 C -90,110 -130,40 -130,-50 C -130,-100 -90,-130 0,-140 Z"
            fill="url(#shield-fill)" stroke={color} strokeWidth="1.5" />

          {/* Inner shield bevel echo */}
          <path d="M 0,-126 C 80,-118 116,-92 116,-48 C 116,36 80,98 0,126 C -80,98 -116,36 -116,-48 C -116,-92 -80,-118 0,-126 Z"
            fill="none" stroke={color} strokeOpacity="0.35" strokeWidth="0.7" />

          {/* Concentric rings (S outer, D mid, M inner) */}
          {Object.entries(ringConfig).map(([k, cfg]) => {
            const isActive = shieldClass === k;
            // 12 tick marks per ring (every 30°); active ring shows all, inactive only cardinal
            const ticks = isActive ? 24 : 12;
            return (
              <g key={k} style={{ cursor: "pointer", transition: "all 0.4s" }}
                onClick={() => { setShieldClass(k); setAutoRotate(false); }}>
                <circle cx="0" cy="0" r={cfg.r}
                  fill="none"
                  stroke={isActive ? color : "var(--fg-dim)"}
                  strokeWidth={isActive ? 1.6 : 0.7}
                  strokeOpacity={isActive ? 1 : 0.35}
                  strokeDasharray={isActive ? "none" : "1.5 4"} />
                {/* runic tick marks around the ring */}
                {Array.from({ length: ticks }).map((_, i) => {
                  const a = (i * 360 / ticks) * Math.PI / 180;
                  const t1 = cfg.r - 4, t2 = cfg.r + (i % (ticks / 4) === 0 ? 6 : 3);
                  return (
                    <line key={`t-${k}-${i}`}
                      x1={Math.cos(a) * t1} y1={Math.sin(a) * t1}
                      x2={Math.cos(a) * t2} y2={Math.sin(a) * t2}
                      stroke={isActive ? color : "var(--fg-dim)"}
                      strokeOpacity={isActive ? 0.85 : 0.4}
                      strokeWidth={i % (ticks / 4) === 0 ? 1 : 0.6} />
                  );
                })}
                {/* Class glyph at top of ring (on a hex stamp) */}
                <g transform={`translate(0, ${-cfg.r})`}>
                  {/* hex stamp */}
                  <polygon points="0,-15 13,-7.5 13,7.5 0,15 -13,7.5 -13,-7.5"
                    fill={isActive ? color : "var(--bg-2)"}
                    stroke={color}
                    strokeWidth={isActive ? 0 : 1.2} />
                  <text y="5" fontSize="14" fontFamily="var(--grotesk)" fontWeight="600"
                    textAnchor="middle"
                    fill={isActive ? "var(--bg)" : color}>{k}</text>
                </g>
              </g>
            );
          })}

          {/* Cardinal-point compass marks at outer ring (NESW) — runic flavor */}
          {[
            { a: 90,  g: "▼" }, // bottom
            { a: 180, g: "◀" }, // left
            { a: 270, g: "▲" }, // top, hidden behind class hex anyway — keep subtle
            { a: 0,   g: "▶" }, // right
          ].map((p, i) => {
            if (p.a === 270) return null; // top is the class glyph
            const rad = p.a * Math.PI / 180;
            const r = 110;
            return (
              <g key={`c-${i}`} transform={`translate(${Math.cos(rad) * r}, ${Math.sin(rad) * r})`}>
                <circle r="6" fill="var(--bg)" stroke={color} strokeWidth="0.8" strokeOpacity="0.6" />
                <text y="2" fontSize="6" fontFamily="var(--mono)" textAnchor="middle" fill={color} fillOpacity="0.7">{p.g}</text>
              </g>
            );
          })}

          {/* Core — the "block bytes" being protected, with a breathing aura */}
          <circle cx="0" cy="0" r="40" fill="url(#shield-core)">
            <animate attributeName="r" values="38;44;38" dur="3.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.85;1;0.85" dur="3.4s" repeatCount="indefinite" />
          </circle>
          {/* core hex frame */}
          <polygon points="0,-26 22.5,-13 22.5,13 0,26 -22.5,13 -22.5,-13"
            fill="var(--bg)" stroke={color} strokeWidth="1.1" strokeOpacity="0.85" />
          {/* binary glyph row */}
          <text y="-7" fontSize="6" fontFamily="var(--mono)" textAnchor="middle" fill={color} fillOpacity="0.55">01101011</text>
          <text y="3"  fontSize="7" fontFamily="var(--mono)" fontWeight="600" textAnchor="middle" fill={color}>BLOCK</text>
          <text y="13" fontSize="6" fontFamily="var(--mono)" textAnchor="middle" fill={color} fillOpacity="0.55">11010100</text>

          {/* Animated sweep on the active ring */}
          <g>
            <circle cx="0" cy={-ringConfig[shieldClass].r} r="3.5" fill={color}>
              <animateTransform attributeName="transform" type="rotate"
                from="0" to="360" dur="4s" repeatCount="indefinite" />
            </circle>
            {/* trailing arc */}
            <path d={`M 0,${-ringConfig[shieldClass].r} A ${ringConfig[shieldClass].r},${ringConfig[shieldClass].r} 0 0 1 ${ringConfig[shieldClass].r * Math.sin(0.7)},${-ringConfig[shieldClass].r * Math.cos(0.7)}`}
              fill="none" stroke={color} strokeWidth="1.4" strokeOpacity="0.5" strokeLinecap="round">
              <animateTransform attributeName="transform" type="rotate"
                from="0" to="360" dur="4s" repeatCount="indefinite" />
            </path>
          </g>
        </svg>
      </div>

      {/* Class detail strip */}
      <div style={{ marginTop: 8, padding: "10px 12px", background: "var(--bg-3)", border: `1px solid ${color}55`, borderRadius: 4 }}>
        <div className="mono" style={{ fontSize: 10, color: color, letterSpacing: "0.12em" }}>
          {c.phase.toUpperCase()} · {c.count.toUpperCase()}
        </div>
        <div className="mono" style={{ fontSize: 12, fontWeight: 600, marginTop: 4 }}>{c.label}</div>
        <div style={{ fontSize: 11, color: "var(--fg-dim)", marginTop: 4, lineHeight: 1.5 }}>{c.desc}</div>
      </div>
    </div>
  );
};

const LayersTicker = () => {
  const items = [
    "v2_invariant_coinbase_value_mismatch",
    "v2_invariant_merkle_root_mismatch",
    "v2_invariant_mempool_tolerance_exceeded",
    "weight_ratio_exceeded",
    "v2_invariant_sigops_mismatch",
    "share_replay_detected",
    "v2_invariant_witness_commitment_mismatch",
    "avg_fee_below_minimum",
    "v2_invariant_tx_count_mismatch",
    "noise_handshake_timeout",
    "v2_invariant_coinbase_height_mismatch",
    "verifier_phase2_degraded",
  ];
  return (
    <div style={{
      position: "absolute", bottom: 24, left: 0, right: 0,
      borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)",
      background: "var(--bg-2)", overflow: "hidden", whiteSpace: "nowrap", padding: "12px 0",
    }}>
      <div style={{
        display: "inline-flex", gap: 48, animation: "ticker-scroll 60s linear infinite",
        fontFamily: "var(--mono)", fontSize: 11, color: "var(--fg-dim)", letterSpacing: "0.05em",
      }}>
        {[...items, ...items, ...items].map((it, i) => (
          <span key={i}>
            <span style={{ color: "var(--accent)", marginRight: 8 }}>▸</span>{it}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ============== Thesis ============== */
const LayersThesis = () => (
  <section className="section" style={{ background: "var(--bg-2)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
    <div style={{ maxWidth: 1320, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 2fr", gap: 80 }}>
      <div>
        <div className="eyebrow">{t("thesis.eyebrow")}</div>
        <h2 style={{ fontFamily: "var(--grotesk)", fontSize: 44, fontWeight: 500, lineHeight: 1.1, letterSpacing: "-0.025em", margin: 0 }}>
          {t("thesis.h2")}
        </h2>
      </div>
      <div>
        <p style={{ fontSize: 19, lineHeight: 1.55, color: "var(--fg)", margin: 0 }}>
          {t("thesis.body")}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 40 }}>
          {[
            { n: t("thesis.stat1.n"), t: t("thesis.stat1.t"), s: t("thesis.stat1.s") },
            { n: t("thesis.stat2.n"), t: t("thesis.stat2.t"), s: t("thesis.stat2.s") },
            { n: t("thesis.stat3.n"), t: t("thesis.stat3.t"), s: t("thesis.stat3.s") },
          ].map((s, i) => (
            <div key={i} style={{ borderTop: "1px solid var(--line)", paddingTop: 20 }}>
              <div className="mono" style={{ fontSize: 24, fontWeight: 500, color: "var(--accent)", letterSpacing: "-0.01em" }}>{s.n}</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 10 }}>{s.t}</div>
              <div style={{ fontSize: 12, color: "var(--fg-dim)", marginTop: 6, lineHeight: 1.5 }}>{s.s}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ============== Shield Anatomy — the heart of the new framing ============== */
const ShieldAnatomy = () => {
  const [pick, setPick] = React.useState("D");
  const data = {
    S: {
      title: t("anatomy.S.title"),
      phase: t("anatomy.S.phase"),
      desc:  t("anatomy.S.desc"),
      catches: t("anatomy.S.catches"),
      examples: ["v2_invariant_weight_exceeds_max", "v2_invariant_sigops_exceed_max", "v2_invariant_header_version_low", "v2_invariant_coinbase_output_count"],
    },
    D: {
      title: t("anatomy.D.title"),
      phase: t("anatomy.D.phase"),
      desc:  t("anatomy.D.desc"),
      catches: t("anatomy.D.catches"),
      examples: ["v2_invariant_coinbase_value_mismatch", "v2_invariant_merkle_root_mismatch", "v2_invariant_witness_commitment_mismatch", "v2_invariant_template_weight_mismatch", "v2_invariant_sigops_mismatch"],
    },
    M: {
      title: t("anatomy.M.title"),
      phase: t("anatomy.M.phase"),
      desc:  t("anatomy.M.desc"),
      catches: t("anatomy.M.catches"),
      examples: ["v2_invariant_mempool_tolerance_exceeded", "v2_invariant_mempool_tx_unknown", "v2_invariant_mempool_unavailable", "v2_invariant_mempool_view_stale"],
    },
  };
  const c = data[pick];
  return (
    <section className="section">
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <div className="eyebrow">{t("anatomy.eyebrow")}</div>
        <h2 style={{ fontFamily: "var(--grotesk)", fontSize: 56, fontWeight: 500, lineHeight: 1.05, letterSpacing: "-0.03em", margin: 0, maxWidth: 1000 }}>
          {t("anatomy.h2.line1")} <span style={{ color: "var(--accent-2)" }}>{t("anatomy.h2.line2")}</span> {t("anatomy.h2.line3")}
        </h2>
        <p style={{ fontSize: 17, color: "var(--fg-dim)", maxWidth: 760, marginTop: 20, lineHeight: 1.55 }}>
          {t("anatomy.lede")}
        </p>

        {/* Phase ribbon */}
        <div style={{ marginTop: 40, position: "relative", height: 90 }}>
          <div style={{
            position: "absolute", left: 0, right: 0, top: "50%", height: 2,
            background: "var(--line)", transform: "translateY(-50%)",
          }} />
          <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
            {[
              { tag: t("anatomy.phase1.tag"), classes: t("anatomy.phase1.classes"), note: t("anatomy.phase1.note"), color: "var(--accent-2)" },
              { tag: t("anatomy.phase2.tag"), classes: t("anatomy.phase2.classes"), note: t("anatomy.phase2.note"), color: "var(--accent-3)" },
            ].map((p, i) => (              <div key={i} style={{
                padding: "16px 20px", textAlign: i === 0 ? "left" : "right",
              }}>
                <div className="mono" style={{ fontSize: 11, color: p.color, letterSpacing: "0.18em" }}>{p.tag}</div>
                <div className="mono" style={{ fontSize: 14, marginTop: 6 }}>{p.classes}</div>
                <div className="mono" style={{ fontSize: 11, color: "var(--fg-dim)", marginTop: 4 }}>{p.note}</div>
              </div>
            ))}
          </div>
          {/* phase markers */}
          <div style={{ position: "absolute", left: "33%", top: "50%", width: 14, height: 14, background: "var(--accent-2)", borderRadius: "50%", transform: "translate(-50%, -50%)", boxShadow: "0 0 0 4px var(--bg)" }} />
          <div style={{ position: "absolute", left: "75%", top: "50%", width: 14, height: 14, background: "var(--accent-3)", borderRadius: "50%", transform: "translate(-50%, -50%)", boxShadow: "0 0 0 4px var(--bg)" }} />
        </div>

        {/* Class detail */}
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 40, marginTop: 56 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {Object.entries(data).map(([k, v]) => {
              const isActive = pick === k;
              const phaseColor = v.phase.includes("Phase 2") ? "var(--accent-3)" : "var(--accent-2)";
              return (
                <button key={k} onClick={() => setPick(k)} style={{
                  textAlign: "left", padding: "20px 22px", borderRadius: 6,
                  background: isActive ? "var(--bg-3)" : "var(--bg-2)",
                  border: `1px solid ${isActive ? phaseColor : "var(--line)"}`,
                  borderLeft: `4px solid ${phaseColor}`,
                  color: "var(--fg)", cursor: "pointer", transition: "all 0.2s",
                }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                    <span className="mono" style={{ fontSize: 28, fontWeight: 600, color: isActive ? phaseColor : "var(--fg)" }}>{k}</span>
                    <span style={{ fontFamily: "var(--grotesk)", fontSize: 16, fontWeight: 500 }}>{v.title.split("·")[1].trim()}</span>
                  </div>
                  <div className="mono" style={{ fontSize: 10, color: "var(--fg-dim)", letterSpacing: "0.1em", marginTop: 8 }}>{v.phase}</div>
                </button>
              );
            })}
          </div>

          <div style={{ padding: "32px 36px", background: "var(--bg-2)", border: "1px solid var(--line)", borderRadius: 6 }}>
            <div className="mono" style={{ fontSize: 11, color: c.phase.includes("Phase 2") ? "var(--accent-3)" : "var(--accent-2)", letterSpacing: "0.18em" }}>
              {c.phase.toUpperCase()}
            </div>
            <h3 style={{ fontFamily: "var(--grotesk)", fontSize: 32, fontWeight: 500, letterSpacing: "-0.02em", margin: "10px 0 0" }}>{c.title}</h3>
            <p style={{ fontSize: 16, lineHeight: 1.6, marginTop: 20 }}>{c.desc}</p>
            <div style={{ marginTop: 20, padding: "16px 20px", background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 4 }}>
              <div className="mono" style={{ fontSize: 10, color: "var(--good)", letterSpacing: "0.1em" }}>{t("anatomy.label.catches")}</div>
              <p style={{ fontSize: 14, lineHeight: 1.55, margin: "8px 0 0", color: "var(--fg)" }}>{c.catches}</p>
            </div>
            <div style={{ marginTop: 20 }}>
              <div className="mono" style={{ fontSize: 10, color: "var(--fg-dim)", letterSpacing: "0.1em", marginBottom: 12 }}>{t("anatomy.label.examples")}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {c.examples.map((r, i) => (
                  <div key={i} className="mono" style={{
                    fontSize: 11, padding: "8px 10px", background: "var(--bg-3)",
                    border: "1px solid var(--line)", borderRadius: 3, color: "var(--fg-dim)",
                  }}>{r}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ============== Flow diagram ============== */
const LayersFlowDiagram = () => {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 2200);
    return () => clearInterval(id);
  }, []);
  return (
    <section className="section" style={{ background: "var(--bg-2)", borderTop: "1px solid var(--line)" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <div className="eyebrow">{t("flow.eyebrow")}</div>
        <h2 style={{ fontFamily: "var(--grotesk)", fontSize: 56, fontWeight: 500, lineHeight: 1.05, letterSpacing: "-0.03em", margin: 0, maxWidth: 900 }}>
          {t("flow.h2.line1")} <span style={{ color: "var(--accent)" }}>{t("flow.h2.line2")}</span> {t("flow.h2.line3")}
        </h2>
        <p style={{ fontSize: 17, color: "var(--fg-dim)", maxWidth: 720, marginTop: 20, lineHeight: 1.55 }}>
          {t("flow.lede")}
        </p>
        <div style={{ marginTop: 56, padding: "56px 40px", background: "var(--bg-3)", border: "1px solid var(--line)", borderRadius: 8 }}>
          <FlowSvg tick={tick} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 24 }}>
          {[
            ["template-manager", "8082", t("flow.svc.tm.desc")],
            ["pool-verifier",    "8081", t("flow.svc.verifier.desc")],
            ["sv2-gateway",      "3333", t("flow.svc.gateway.desc")],
            ["bitcoind (operator)", "8332", t("flow.svc.bitcoind.desc")],
          ].map(([name, port, desc]) => (
            <div key={name} style={{ padding: "16px 20px", background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 4 }}>
              <div className="mono" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.05em" }}>:{port}</div>
              <div className="mono" style={{ fontSize: 13, fontWeight: 500, marginTop: 6 }}>{name}</div>
              <div style={{ fontSize: 12, color: "var(--fg-dim)", marginTop: 8, lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FlowSvg = ({ tick }) => (
  <svg viewBox="0 0 1180 380" width="100%" style={{ display: "block" }}>
    <defs>
      <linearGradient id="flow-grad" x1="0" x2="1">
        <stop offset="0%" stopColor="oklch(58% 0.16 50)" />
        <stop offset="100%" stopColor="oklch(72% 0.16 145)" />
      </linearGradient>
      <marker id="ah" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
        <path d="M0,0 L8,3 L0,6" fill="oklch(60% 0.012 240)" />
      </marker>
      <marker id="ah-m" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
        <path d="M0,0 L8,3 L0,6" fill="oklch(70% 0.14 220)" />
      </marker>
    </defs>
    {[
      { x: 40, y: 130, w: 180, h: 90, name: "bitcoind", port: ":8332" },
      { x: 280, y: 130, w: 200, h: 90, name: "template-manager", port: ":8082" },
      { x: 540, y: 50, w: 240, h: 240, name: "pool-verifier", port: ":8081", hero: true },
      { x: 840, y: 130, w: 220, h: 90, name: "sv2-gateway → miners", port: ":3333" },
    ].map((n, i) => (
      <g key={i}>
        <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="6"
          fill={n.hero ? "oklch(13% 0.018 244)" : "oklch(10% 0.016 246)"}
          stroke={n.hero ? "var(--accent)" : "oklch(20% 0.020 244)"}
          strokeWidth={n.hero ? 1.5 : 1} />
        <text x={n.x + n.w / 2} y={n.y + 36} textAnchor="middle" fill="oklch(95% 0.004 230)" fontSize="14" fontWeight="600" fontFamily="var(--grotesk)">{n.name}</text>
        <text x={n.x + n.w / 2} y={n.y + 56} textAnchor="middle" fill="oklch(60% 0.012 240)" fontSize="11" fontFamily="var(--mono)">{n.port}</text>
        {n.hero && (
          <>
            <text x={n.x + n.w / 2} y={n.y + 80} textAnchor="middle" fill="var(--accent)" fontSize="10" fontFamily="var(--mono)" letterSpacing="2">TWO-LAYER VERDICT</text>
            {/* Layer 1 chip */}
            <g>
              <rect x={n.x + 24} y={n.y + 100} width={n.w - 48} height={44} rx="3"
                fill="oklch(58% 0.16 50 / 0.10)" stroke="var(--accent)" strokeWidth="1" />
              <circle cx={n.x + 36} cy={n.y + 122} r="3" fill="var(--accent)">
                <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
              </circle>
              <text x={n.x + 48} y={n.y + 117} fill="var(--accent)" fontSize="11" fontFamily="var(--mono)" fontWeight="600" letterSpacing="1">L1 · GATEWAY</text>
              <text x={n.x + 48} y={n.y + 132} fill="var(--accent)" fontSize="9" fontFamily="var(--mono)" fillOpacity="0.7" letterSpacing="0.4">59 codes · 69 keys</text>
            </g>
            {/* Layer 2 chip — Shield as a single feature, no SDM list */}
            <g>
              <rect x={n.x + 24} y={n.y + 154} width={n.w - 48} height={62} rx="3"
                fill="oklch(72% 0.16 145 / 0.08)" stroke="var(--accent-2)" strokeWidth="1" />
              <circle cx={n.x + 36} cy={n.y + 176} r="3" fill="var(--accent-2)">
                <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" begin="0.5s" />
              </circle>
              <text x={n.x + 48} y={n.y + 171} fill="var(--accent-2)" fontSize="11" fontFamily="var(--mono)" fontWeight="600" letterSpacing="1">L2 · INVARIANT SHIELD</text>
              <text x={n.x + 48} y={n.y + 186} fill="var(--accent-2)" fontSize="9" fontFamily="var(--mono)" fillOpacity="0.7" letterSpacing="0.4">22 v2_invariant_* codes</text>
              <text x={n.x + 48} y={n.y + 202} fill="var(--accent-2)" fontSize="9" fontFamily="var(--mono)" fillOpacity="0.55" letterSpacing="0.4">Phase 1 · Phase 2 wired</text>
            </g>
          </>
        )}
      </g>
    ))}

    {/* === Forward primary flow (template path) === */}
    {[
      { x1: 220, y1: 175, x2: 280, y2: 175 },
      { x1: 480, y1: 175, x2: 540, y2: 175 },
      { x1: 780, y1: 175, x2: 840, y2: 175 },
    ].map((a, i) => (
      <g key={i}>
        <line x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2} stroke="oklch(60% 0.012 240)" strokeWidth="1.5" markerEnd="url(#ah)" opacity="0.6" />
        <circle r="4" fill="url(#flow-grad)" opacity="0.9">
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur="2.4s" repeatCount="indefinite" begin={`${i * 0.7}s`} />
          <animateMotion dur="2.4s" repeatCount="indefinite" begin={`${i * 0.7}s`} path={`M${a.x1},${a.y1} L${a.x2},${a.y2}`} />
        </circle>
      </g>
    ))}

    {/* === Class M back-channel: verifier → bitcoind, orthogonal routing === */}
    {/* Path: from verifier bottom-left (570, 290) → down to 330 → left to 130 → up to bitcoind bottom (130, 220) */}
    <g>
      <path d="M 570 290 L 570 330 L 130 330 L 130 220"
        stroke="oklch(70% 0.14 220)" strokeWidth="1.2"
        strokeDasharray="5 4" fill="none" opacity="0.65"
        markerEnd="url(#ah-m)" />
      {/* dot animating along the path (back-direction) */}
      <circle r="3.5" fill="oklch(70% 0.14 220)" opacity="0.9">
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur="3.2s" repeatCount="indefinite" />
        <animateMotion dur="3.2s" repeatCount="indefinite"
          path="M 570 290 L 570 330 L 130 330 L 130 220" />
      </circle>

      {/* Labeled chip on the horizontal segment, centered between turns (350, 330) */}
      <g transform="translate(350, 330)">
        <rect x="-118" y="-13" width="236" height="26" rx="3"
          fill="oklch(13% 0.018 244)"
          stroke="oklch(70% 0.14 220)" strokeWidth="1" strokeOpacity="0.7" />
        <circle cx="-105" cy="0" r="2.5" fill="oklch(70% 0.14 220)">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <text x="-95" y="-2" fill="oklch(70% 0.14 220)" fontSize="10" fontFamily="var(--mono)" fontWeight="600" letterSpacing="0.8">CLASS M BACK-CHANNEL</text>
        <text x="-95" y="9" fill="oklch(60% 0.012 240)" fontSize="9" fontFamily="var(--mono)" letterSpacing="0.4">getrawmempool · poll 10s</text>
      </g>
    </g>
  </svg>
);

/* ============== Threat model ============== */
const LayersThreatToggle = () => {
  // each layer: { L1, S, D, M }
  const [active, setActive] = React.useState("T3");
  const threats = {
    T1: { name: t("threat.T1.name"), scope: "in",
          fires: { L1: false, S: true, D: true, M: true },
          d: t("threat.T1.body") },
    T2: { name: t("threat.T2.name"), scope: "in",
          fires: { L1: false, S: false, D: true, M: false },
          d: t("threat.T2.body") },
    T3: { name: t("threat.T3.name"), scope: "in (Phase 2)",
          fires: { L1: false, S: false, D: false, M: true },
          d: t("threat.T3.body") },
    T4: { name: t("threat.T4.name"), scope: "out",
          fires: { L1: false, S: false, D: false, M: false },
          d: t("threat.T4.body") },
    T5: { name: t("threat.T5.name"), scope: "out (3.x.x)",
          fires: { L1: false, S: false, D: false, M: false },
          d: t("threat.T5.body") },
  };
  const tt = threats[active];
  const checks = [
    { k: "L1", n: t("threat.layer.l1.name"), sub: t("threat.layer.l1.sub"), c: "var(--accent)"   },
    { k: "S",  n: t("threat.layer.s.name"),  sub: t("threat.layer.s.sub"),  c: "var(--accent-2)" },
    { k: "D",  n: t("threat.layer.d.name"),  sub: t("threat.layer.d.sub"),  c: "var(--accent-2)" },
    { k: "M",  n: t("threat.layer.m.name"),  sub: t("threat.layer.m.sub"),  c: "var(--accent-3)" },
  ];
  return (
    <section className="section">
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <div className="eyebrow">{t("threat.eyebrow")}</div>
        <h2 style={{ fontFamily: "var(--grotesk)", fontSize: 52, fontWeight: 500, lineHeight: 1.05, letterSpacing: "-0.025em", margin: 0, maxWidth: 900 }}>
          {t("threat.h2.line1")} <span style={{ color: "var(--fg-dim)" }}>{t("threat.h2.line2")}</span>
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 48, marginTop: 56 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {Object.entries(threats).map(([k, v]) => {
              const isActive = active === k;
              const inScope = v.scope.startsWith("in");
              return (
                <button key={k} onClick={() => setActive(k)} style={{
                  display: "grid", gridTemplateColumns: "60px 1fr 70px", gap: 16,
                  alignItems: "center", textAlign: "left", padding: "16px 18px",
                  background: isActive ? "var(--bg-3)" : "transparent",
                  border: `1px solid ${isActive ? "var(--accent)" : "var(--line)"}`,
                  borderLeft: `3px solid ${inScope ? "var(--accent-2)" : "oklch(64% 0.20 25)"}`,
                  borderRadius: 4, cursor: "pointer", color: "var(--fg)",
                }}>
                  <span className="mono" style={{ fontSize: 18, fontWeight: 600, color: isActive ? "var(--accent)" : "var(--fg)" }}>{k}</span>
                  <span style={{ fontSize: 13, lineHeight: 1.4 }}>{v.name}</span>
                  <span className="mono" style={{ fontSize: 9, letterSpacing: "0.1em", color: inScope ? "var(--accent-2)" : "oklch(64% 0.20 25)", textAlign: "right" }}>
                    {inScope ? t("threat.scope.in") : t("threat.scope.out")}
                  </span>
                </button>
              );
            })}
          </div>
          <div style={{ padding: "32px 36px", background: "var(--bg-2)", border: "1px solid var(--line)", borderRadius: 6, alignSelf: "flex-start" }}>
            <div className="mono" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.18em" }}>
              {active} · {tt.name.toUpperCase()}
            </div>
            <p style={{ fontSize: 17, lineHeight: 1.6, marginTop: 18 }}>{tt.d}</p>
            <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid var(--line)" }}>
              <div className="mono" style={{ fontSize: 10, color: "var(--fg-dim)", letterSpacing: "0.12em", marginBottom: 14 }}>{t("threat.label.fires")}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                {checks.map((l) => (
                  <div key={l.k} style={{
                    padding: "12px 14px",
                    border: `1px solid ${tt.fires[l.k] ? l.c : "var(--line)"}`,
                    background: tt.fires[l.k] ? `${l.c}14` : "transparent",
                    borderRadius: 4,
                  }}>
                    <div className="mono" style={{ fontSize: 9, letterSpacing: "0.1em", color: tt.fires[l.k] ? l.c : "var(--fg-dim)" }}>
                      {tt.fires[l.k] ? t("threat.fires") : t("threat.silent")}
                    </div>
                    <div className="mono" style={{ fontSize: 12, marginTop: 4, color: tt.fires[l.k] ? "var(--fg)" : "var(--fg-dim)" }}>{l.n}</div>
                    <div className="mono" style={{ fontSize: 10, color: "var(--fg-dim)", marginTop: 4 }}>{l.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ============== Roadmap ============== */
const LayersTimeline = () => (
  <section className="section" style={{ background: "var(--bg-2)", borderTop: "1px solid var(--line)" }}>
    <div style={{ maxWidth: 1320, margin: "0 auto" }}>
      <div className="eyebrow">{t("timeline.eyebrow")}</div>
      <h2 style={{ fontFamily: "var(--grotesk)", fontSize: 52, fontWeight: 500, lineHeight: 1.05, letterSpacing: "-0.025em", margin: 0, maxWidth: 900 }}>
        {t("timeline.h2")}
      </h2>
      <div style={{ marginTop: 64, position: "relative" }}>
        <div style={{ position: "absolute", left: 110, top: 20, bottom: 20, width: 1, background: "var(--line)" }} />
        {[
          { v: "v1.0.x",  date: t("timeline.r1.date"),  title: t("timeline.r1.title"), status: t("timeline.r1.status"),                       color: "var(--accent-2)",
            body: t("timeline.r1.body") },
          { v: "v1.1.0",  date: t("timeline.r2.date"),  title: t("timeline.r2.title"), status: t("timeline.r2.status"),                       color: "var(--accent-2)",
            body: t("timeline.r2.body") },
          { v: "v2.0.0",  date: t("timeline.r3.date"),  title: t("timeline.r3.title"), status: t("timeline.r3.status"),                       color: "var(--accent)",
            body: t("timeline.r3.body") },
          { v: "v2.0.x",  date: t("timeline.r4.date"),  title: t("timeline.r4.title"), status: t("timeline.r4.status"),                       color: "var(--fg-dim)",
            body: t("timeline.r4.body") },
          { v: "v3.x.x",  date: t("timeline.r5.date"),  title: t("timeline.r5.title"), status: t("timeline.r5.status"),                       color: "var(--fg-dim)",
            body: t("timeline.r5.body") },
        ].map((r, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "100px 1fr 220px 2fr", gap: 24, padding: "24px 0", borderBottom: "1px solid var(--line)", alignItems: "flex-start", position: "relative" }}>
            <div className="mono" style={{ fontSize: 13, color: r.color, letterSpacing: "0.05em" }}>{r.v}</div>
            <div>
              <div className="mono" style={{ fontSize: 11, color: "var(--fg-dim)", letterSpacing: "0.1em" }}>{r.date}</div>
              <div style={{ fontFamily: "var(--grotesk)", fontSize: 20, fontWeight: 500, marginTop: 6, letterSpacing: "-0.015em" }}>{r.title}</div>
            </div>
            <div className="mono" style={{ fontSize: 11, color: r.color, letterSpacing: "0.12em", marginTop: 4 }}>● {r.status}</div>
            <div style={{ fontSize: 14, color: "var(--fg-dim)", lineHeight: 1.55 }}>{r.body}</div>
            <div style={{ position: "absolute", left: 105, top: 32, width: 11, height: 11, borderRadius: "50%", background: "var(--bg)", border: `2px solid ${r.color}` }} />
          </div>
        ))}
      </div>
    </div>
  </section>
);

const LayersFooterCTA = () => (
  <section className="section" style={{ background: "var(--bg)", borderTop: "1px solid var(--line)" }}>
    <div style={{ maxWidth: 1320, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 64, alignItems: "flex-end" }}>
        <div>
          <div className="eyebrow">{t("footerCta.eyebrow")}</div>
          <h2 style={{ fontFamily: "var(--grotesk)", fontSize: 76, fontWeight: 500, lineHeight: 1.0, letterSpacing: "-0.03em", margin: 0 }}>
            {t("footerCta.h2.line1")}<br/>
            <span style={{ color: "var(--accent)" }}>{t("footerCta.h2.line2")}</span>
          </h2>
          <p style={{ fontSize: 18, color: "var(--fg-dim)", marginTop: 24, lineHeight: 1.55, maxWidth: 540 }}>
            {t("footerCta.body")}
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
            <a className="btn btn-primary" href="../legal/contact.html" style={{ padding: "14px 24px" }}>{t("footerCta.cta.try")}</a>
            <a className="btn btn-ghost" href="../legal/contact.html" style={{ padding: "14px 24px" }}>Contact us</a>
          </div>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {[
            { tag: t("footerCta.tag.free"), t: t("footerCta.tier.shadow"),  time: t("footerCta.tier.shadow.time"),  c: "var(--accent)" },
            { tag: t("footerCta.tag.paid"), t: t("footerCta.tier.observe"), time: t("footerCta.tier.observe.time"), c: "var(--accent-2)" },
            { tag: t("footerCta.tag.paid"), t: t("footerCta.tier.inline"),  time: t("footerCta.tier.inline.time"),  c: "var(--accent-3)" },
          ].map((m, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "60px 1fr 130px", gap: 16,
              padding: "20px 22px", background: "var(--bg-2)", border: "1px solid var(--line)",
              borderLeft: `3px solid ${m.c}`, borderRadius: 4, alignItems: "center",
            }}>
              <span className="mono" style={{ fontSize: 10, color: m.c, letterSpacing: "0.15em" }}>{m.tag}</span>
              <span style={{ fontFamily: "var(--grotesk)", fontSize: 22, fontWeight: 500 }}>{m.t}</span>
              <span className="mono" style={{ fontSize: 11, color: "var(--fg-dim)", letterSpacing: "0.05em", textAlign: "right" }}>{m.time}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{
        marginTop: 80, paddingTop: 32, borderTop: "1px solid var(--line)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        color: "var(--fg-dim)", fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.1em",
        flexWrap: "wrap", gap: 16,
      }}>
        <span>{t("footer.copy")}</span>
        <span>{t("footer.version")}</span>
        <span style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <a href="legal/about.html" style={{ color: "inherit", textDecoration: "none" }}>{t("footer.about")}</a>
          <span>·</span>
          <a href="legal/privacy.html" style={{ color: "inherit", textDecoration: "none" }}>{t("footer.privacy")}</a>
          <span>·</span>
          <a href="legal/terms.html" style={{ color: "inherit", textDecoration: "none" }}>{t("footer.terms")}</a>
          <span>·</span>
          <a href="legal/disclaimer.html" style={{ color: "inherit", textDecoration: "none" }}>{t("footer.disclaimer")}</a>
        </span>
      </div>
    </div>
  </section>
);

window.VariantLayers = VariantLayers;
