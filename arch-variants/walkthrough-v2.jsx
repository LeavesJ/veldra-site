/* Architecture · C — WALKTHROUGH (v2 · PDF-grounded)
   ============================================================================
   Scrubbable timeline of one template through the gateway, told as 6 steps.

   AUDIT (vs. site-redesign-content-additions.pdf):
     ✗ removed: "574 LOC", "12 FFI calls", "zero consensus rules" (invented exact #s)
     ✗ removed: "0.1ms cache hit", "full pass" timings (no PDF perf numbers)
     ✗ removed: "10-second snapshot" implying snapshot model (PDF says 10s POLL)
     ✗ removed: "Three thresholds govern anomaly" (PDF lists 8 keys, no count)
     ✗ removed: "FAIL_STALE FSM" terminology (PDF: fail-stale state machine
                with FRESH/STALE/DEGRADED states for the bitcoind itself)
     ✗ removed: "Two illegal combinations" verdict count (not in PDF)
     ✗ removed: post-walkthrough VerdictBlock + PerfBlock (those blocks are
                themselves PDF-unsupported on the verdict-FSM details and the
                exact perf numbers — same reason atlas-v2 dropped them)
     ✓ kept   : staged narrative · WIRED chip on Class M · scrubber UX
     ✓ added  : "What happens next" pointers to real pages (Q&A + Failure Atlas)
                instead of inventing details that aren't published.
   ============================================================================ */

const ArchWalkthrough = () => {
  // Force re-render on lang change so all t() calls re-evaluate
  const [, setLangTick] = React.useState(0);
  React.useEffect(() => {
    const onLang = () => setLangTick(x => x + 1);
    window.addEventListener("__lang_changed", onLang);
    return () => window.removeEventListener("__lang_changed", onLang);
  }, []);
  const t = window.t || ((k) => k);
  const [step, setStep] = React.useState(0);
  const [playing, setPlaying] = React.useState(true);
  const playRef = React.useRef(null);

  const STEPS = [
    {
      id: "ingress",
      label: t("arch.s1.label"),
      title: t("arch.s1.title"),
      sub:   t("arch.s1.sub"),
      detail: t("arch.s1.detail"),
      meta: { layer: t("arch.s1.layer"), code: null, color: "var(--fg-dim)" },
    },
    {
      id: "facade",
      label: t("arch.s2.label"),
      title: t("arch.s2.title"),
      sub:   t("arch.s2.sub"),
      detail: t("arch.s2.detail"),
      meta: { layer: t("arch.s2.layer"), code: "v2_invariant_merkle_root_mismatch", color: "var(--accent-2)" },
    },
    {
      id: "classd",
      label: t("arch.s3.label"),
      title: t("arch.s3.title"),
      sub:   t("arch.s3.sub"),
      detail: t("arch.s3.detail"),
      meta: { layer: t("arch.s3.layer"), code: "v2_invariant_*_mismatch", color: "var(--accent-2)" },
    },
    {
      id: "classm",
      label: t("arch.s4.label"),
      title: t("arch.s4.title"),
      sub:   t("arch.s4.sub"),
      detail: t("arch.s4.detail"),
      meta: { layer: t("arch.s4.layer"), code: "v2_invariant_mempool_tolerance_exceeded", color: "var(--accent-3)" },
      wired: true,
    },
    {
      id: "verdict",
      label: t("arch.s5.label"),
      title: t("arch.s5.title"),
      sub:   t("arch.s5.sub"),
      detail: t("arch.s5.detail"),
      meta: { layer: t("arch.s5.layer"), code: "v1_* · v2_invariant_*", color: "var(--accent)" },
    },
    {
      id: "gateway",
      label: t("arch.s6.label"),
      title: t("arch.s6.title"),
      sub:   t("arch.s6.sub"),
      detail: t("arch.s6.detail"),
      meta: { layer: t("arch.s6.layer"), code: "prevhash_switch_timeout", color: "var(--accent)" },
    },
  ];

  React.useEffect(() => {
    if (!playing) return;
    playRef.current = setTimeout(() => {
      setStep(s => (s + 1) % STEPS.length);
    }, 3200);
    return () => clearTimeout(playRef.current);
  }, [step, playing]);

  const cur = STEPS[step];

  return (
    <div className="variant-page" data-variant="layers" style={{ minHeight: 1100, paddingTop: 0 }}>
      <section style={{ padding: "96px 80px 32px", maxWidth: 1320, margin: "0 auto" }}>
        <div className="eyebrow">{t("arch.eyebrow")}</div>
        <h1 style={{ fontFamily: "var(--grotesk)", fontSize: 76, fontWeight: 500, lineHeight: 1.02, letterSpacing: "-0.035em", margin: "12px 0 20px", maxWidth: 1100 }}>
          {t("arch.h1")}
        </h1>
        <p style={{ fontSize: 17, color: "var(--fg-dim)", lineHeight: 1.55, maxWidth: 720 }}>
          {t("arch.lede")}
        </p>
      </section>

      {/* Stage */}
      <section style={{ padding: "0 80px 32px", maxWidth: 1320, margin: "0 auto" }}>
        <div style={{
          position: "relative", height: 460,
          background: "var(--bg-2)", border: "1px solid var(--line)", borderRadius: 6,
          overflow: "hidden",
        }}>
          {/* Track */}
          <div style={{ position: "absolute", top: 80, left: 60, right: 60, height: 2, background: "var(--line)" }}/>
          {/* Track stations */}
          {STEPS.map((s, i) => {
            const pct = i / (STEPS.length - 1);
            const isPast = i <= step;
            return (
              <div key={s.id} style={{
                position: "absolute", top: 64, left: `calc(60px + ${pct} * (100% - 120px))`,
                transform: "translateX(-50%)", textAlign: "center", width: 140,
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%", margin: "0 auto",
                  background: isPast ? s.meta.color : "var(--bg)",
                  border: `2px solid ${isPast ? s.meta.color : "var(--line)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--mono)", fontSize: 11, fontWeight: 600,
                  color: isPast ? "var(--bg)" : "var(--fg-dim)",
                  transition: "all 0.4s ease",
                  boxShadow: i === step ? `0 0 0 6px color-mix(in oklab, ${s.meta.color} 22%, transparent)` : "none",
                }}>{i + 1}</div>
                <div className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: i === step ? s.meta.color : "var(--fg-dim)", marginTop: 12 }}>
                  {s.label}
                </div>
              </div>
            );
          })}

          {/* Active step panel */}
          <div style={{ position: "absolute", left: 60, right: 60, top: 184 }}>
            <div className="mono" style={{ fontSize: 10.5, letterSpacing: "0.16em", color: cur.meta.color, marginBottom: 8 }}>
              {cur.meta.layer}
            </div>
            <h2 style={{ fontFamily: "var(--grotesk)", fontSize: 36, fontWeight: 500, letterSpacing: "-0.025em", margin: "0 0 16px", lineHeight: 1.15, maxWidth: 920 }}>
              {cur.title}
            </h2>
            <p style={{ fontSize: 15.5, color: "var(--fg)", lineHeight: 1.55, marginBottom: 12, maxWidth: 880 }}>{cur.sub}</p>
            <p style={{ fontSize: 13.5, color: "var(--fg-dim)", lineHeight: 1.55, marginBottom: 16, maxWidth: 880 }}>{cur.detail}</p>
            {cur.meta.code && (
              <code style={{ fontFamily: "var(--mono)", fontSize: 12, padding: "4px 10px", background: "var(--bg-3)", border: `1px solid ${cur.meta.color}`, color: cur.meta.color, borderRadius: 2 }}>
                {cur.meta.code}
              </code>
            )}
          </div>

          {/* WIRED chip on Class M step */}
          {cur.wired && (
            <div style={{ position: "absolute", top: 184, right: 60 }}>
              <WiredBadge variant="chip"/>
            </div>
          )}
        </div>

        {/* Scrubber + transport */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 16, padding: "16px 20px", background: "var(--bg-2)", border: "1px solid var(--line)", borderRadius: 4 }}>
          <button onClick={() => setPlaying(p => !p)} style={{
            width: 38, height: 38, borderRadius: "50%", border: "1px solid var(--line)",
            background: "var(--bg)", color: "var(--accent)", cursor: "pointer", fontSize: 14,
          }}>{playing ? "❚❚" : "▶"}</button>
          <input type="range" min={0} max={STEPS.length - 1} value={step}
            onChange={(e) => { setPlaying(false); setStep(parseInt(e.target.value)); }}
            style={{ flex: 1, accentColor: cur.meta.color }}/>
          <div className="mono tabular" style={{ fontSize: 11, letterSpacing: "0.14em", color: "var(--fg-dim)", minWidth: 80, textAlign: "right" }}>
            {t("arch.scrubber.step")} {String(step + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
          </div>
        </div>
      </section>

      <div style={{ paddingBottom: 96 }}/>
    </div>
  );
};

Object.assign(window, { ArchWalkthrough });
