/* ============================================================================
   VELDRA — Product page shared content (PDF-grounded, audit pass)
   Source of truth: uploads/site-redesign-content-additions.pdf
   Every claim here cites a PDF item number (#1-#44) or current site baseline.
   No invented metrics, prices, dates, code names, or comparison vendors.
   If a claim is downstream of "the source wins" but not in the PDF, it's out.
   ============================================================================ */

window.PRODUCT_CONTENT = {

  /* -----------------------------------------------------------
     0) Page-level framing — operator-blunt
     ----------------------------------------------------------- */
  framing: {
    eyebrow: "▸ PRODUCT · v2.0.0",
    title: "The verifier doesn't trust the template. It re-derives it.",
    lede: "Veldra v2.0.0 ships the Invariant Shield: 22 canonical re-derivation checks (Phase 1) plus mempool ground truth (Phase 2). Layered on top of the existing 91-code v1 policy gateway and 61-key TOML config baseline.",
    note_in_ci: "v2.0.0 is wired, on origin, CI green. The launch claim that the system catches consistent template-manager tampering in production at the verifier layer requires the production observation cycle to complete. Until then this site distinguishes “wired and tested in CI” from “validated against mainnet over a multi-week observation window.”",
  },

  /* -----------------------------------------------------------
     1) Reason-code surface — PDF-grounded counts only
     PDF facts:
       - 91 v1 reason codes (current site baseline)
       - 22 canonical v2_invariant_* codes (PDF #3, list lives in
         rg-consensus::ConsensusViolation::ALL_CODES — we do NOT fabricate names)
       - Tier 1 (5 critical) + Tier 2 (5 high) shipped Phase 1 (#4)
         · Tier 1: CoinbaseValue, CoinbaseHeight, MerkleRoot,
                   WitnessCommitmentMismatch, TxCount
         · Tier 2: TemplateWeight, Sigops, CoinbaseSigops,
                   WitnessCommitmentMissing, CoinbaseBip34
       - Tier 3 (7 belt-and-suspenders) ships Phase 1.5 (#42)
         · Tier 3: CoinbaseScriptLength, CoinbaseOutputCount, WeightExceedsMax,
                   SigopsExceedMax, NonCoinbaseNullPrevout, HeaderVersionLow,
                   DuplicateTx
     ----------------------------------------------------------- */
  reason_codes: {
    v1_baseline: 91,
    v2_invariant_total: 22,
    canonical_source: "rg-consensus::ConsensusViolation::ALL_CODES",

    tiers: [
      {
        id: "T1", label: "Tier 1 · critical", count: 5, ships_in: "Phase 1 (v2.0.0)",
        names: [
          "CoinbaseValue", "CoinbaseHeight", "MerkleRoot",
          "WitnessCommitmentMismatch", "TxCount",
        ],
        gloss: "Defects that produce an immediately invalid block. Re-derived from raw block bytes.",
      },
      {
        id: "T2", label: "Tier 2 · high", count: 5, ships_in: "Phase 1 (v2.0.0)",
        names: [
          "TemplateWeight", "Sigops", "CoinbaseSigops",
          "WitnessCommitmentMissing", "CoinbaseBip34",
        ],
        gloss: "Defects that produce orphan-likely or downstream-invalid blocks.",
      },
      {
        id: "T3", label: "Tier 3 · belt-and-suspenders", count: 7, ships_in: "Phase 1.5 (post observation cycle)",
        names: [
          "CoinbaseScriptLength", "CoinbaseOutputCount", "WeightExceedsMax",
          "SigopsExceedMax", "NonCoinbaseNullPrevout", "HeaderVersionLow",
          "DuplicateTx",
        ],
        gloss: "Wires after the v2.0.0 production observation cycle completes cleanly.",
      },
    ],

    class_M_phase2: {
      label: "Class M · mempool ground truth (Phase 2)",
      gloss: "Cross-references the template's non-coinbase txids against an independent bitcoind mempool view. Rejects when the unknown-tx ratio exceeds tolerance_pct.",
    },
  },

  /* -----------------------------------------------------------
     2) rg-consensus facade — exact public surface from PDF #2
     ----------------------------------------------------------- */
  rg_consensus_facade: {
    blurb: "rg-consensus is a separable facade wrapping rust-bitcoin behind a narrow boundary.",
    re_derivation_fns: [
      "re_derive_coinbase_value",
      "re_derive_template_weight",
      "re_derive_merkle_root",
      "re_derive_witness_commitment",
      "count_sigops",
    ],
    class_accessors: [
      "template_txids",
      "parse_block",
      "total_sigops",
      "coinbase_sigops",
      "bip34_height",
    ],
  },

  /* -----------------------------------------------------------
     3) TOML config — PDF-grounded
     PDF facts:
       - 61 TOML keys baseline (current site)
       - 8 new [policy.mempool] keys (PDF #8) — names below
       - All 8 optional with defaults; older configs continue to load
     We do NOT fabricate the 61 v1 keys. We only show the 8 new ones plus
     the section names from the current site baseline.
     ----------------------------------------------------------- */
  toml: {
    v1_baseline_keys: 61,
    v1_baseline_sections: ["[gateway]", "[timing]", "[share]", "[auth]"],

    new_phase2_section: {
      section: "[policy.mempool]",
      added_in: "v2.0.0",
      keys: [
        { name: "enforce",            default: "false", note: "advisory until operator opts in" },
        { name: "tolerance_pct",      default: "4.0",   note: "unknown-tx ratio threshold; tunable down toward 2.0" },
        { name: "poll_interval_secs", default: "10",    note: "getrawmempool poll cadence" },
        { name: "max_stale_secs",     default: "60",    note: "fail-stale window before view becomes Degraded" },
        { name: "per_tx_detail",      default: "false", note: "expand SAMPLE_UNKNOWN_CAP=10 to all unknown txids" },
        { name: "rpc_url",            default: "—",     note: "operator-side bitcoind RPC endpoint" },
        { name: "rpc_user",           default: "—",     note: "RPC auth · or via env var" },
        { name: "rpc_pass",           default: "—",     note: "RPC auth · or via env var" },
      ],
    },

    backwards_compat: "All 8 new keys optional with defaults so older configs continue to load unchanged.",
  },

  /* -----------------------------------------------------------
     4) Telemetry — exact metric names from PDF #9
     We do NOT add invented `veldra_*` counters. The PDF specifies four.
     ----------------------------------------------------------- */
  telemetry: {
    new_in_v20: [
      { name: "verifier_phase2_checks_total{result}", kind: "counter",   note: "result ∈ {agreed, rejected, skipped, stale}" },
      { name: "verifier_phase2_degraded_total",       kind: "counter",   note: "incremented per template served while view is Degraded" },
      { name: "verifier_mempool_view_age_seconds",    kind: "gauge",     note: "age of last successful refresh" },
      { name: "verifier_mempool_view_size",           kind: "gauge",     note: "tx count in last successful refresh" },
    ],
    baseline: "Existing exports unchanged. Prometheus / Grafana / CSV / NDJSON observability per current site. [site baseline]",
  },

  /* -----------------------------------------------------------
     5) Phase-2 fail-stale FSM — PDF #6
     ----------------------------------------------------------- */
  fsm: {
    blurb: "Mempool-view state machine.",
    states: [
      { id: "Fresh",    enter: "successful poll within poll_interval_secs",        behavior: "Class M check runs against fresh view." },
      { id: "Stale",    enter: "refresh failure, age ≤ max_stale_secs",            behavior: "Class M still runs against last-known view." },
      { id: "Degraded", enter: "age > max_stale_secs × 2",                          behavior: "Class M skipped. Templates fall through to Phase 1. verifier_phase2_degraded_total ++." },
    ],
    defaults: { max_stale_secs: 60, sample_unknown_cap: 10 },
  },

  /* -----------------------------------------------------------
     6) Performance — PDF E (#23-#25) plus current site baseline
     ----------------------------------------------------------- */
  performance: {
    site_baseline: {
      verdict_timeout_ms: 2000,
      prevhash_p50_ms: 50,
      prevhash_p95_ms: 150,
      prevhash_p99_ms: 300,
    },
    cl01_pending: "Concrete verdict latency under load — average plus p50/p95/p99 percentiles. The current site lists the 2000ms timeout but does not list the actual measured latency. Pending publication post-observation.",
    cl02: {
      headline: "Zero drops at 100 concurrent connections × 2000 templates/sec.",
      detail: "Templates submitted, templates verdict-returned, drops. Test set produced zero drops.",
    },
    cold_build_pending: "Cargo cold-build wall clock at v2.0.0 Phase 1 baseline — useful for engineers evaluating fitness as a build dependency. Pending publication.",
  },

  /* -----------------------------------------------------------
     7) Threat model — PDF #12, #13, #14
     ----------------------------------------------------------- */
  threats: [
    { id: "T1", name: "raw_block tampering",                          coverage: "in",  by: "L2 Phase 1" },
    { id: "T2", name: "declared-versus-bytes mismatch",               coverage: "in",  by: "L2 Phase 1" },
    { id: "T3", name: "consistent template-manager tampering",        coverage: "in",  by: "L3 Phase 2" },
    { id: "T4", name: "compromised operator bitcoind",                coverage: "out", by: "explicitly out of scope" },
    { id: "T5", name: "selfish mining · aggressive mempool divergence", coverage: "out", by: "v3.x territory" },
  ],
  trust_boundary: "ReserveGrid OS v2.0.0 with Phase 1 plus Phase 2 catches T1, T2, T3. T4 and T5 are explicitly out of scope.",

  /* -----------------------------------------------------------
     8) Architectural ceilings — PDF #11
     ----------------------------------------------------------- */
  ceilings: [
    { layer: "L1", cant: "any template whose declared fields pass operator thresholds, even if underlying bytes are fabricated" },
    { layer: "L2", cant: "tampering whose declared values and raw bytes are internally consistent by construction" },
    { layer: "L3", cant: "tampering operating within the configured tolerance window, or while bitcoind itself is compromised" },
  ],

  /* -----------------------------------------------------------
     9) Caveats named upfront — PDF #14
     ----------------------------------------------------------- */
  caveats: [
    "The 4% tolerance window in Phase 2 absorbs benign mempool divergence (legitimate propagation latency between operator’s bitcoind and the network).",
    "Tuning down toward 2.0 narrows the window but cannot reach zero without producing false positives on real templates.",
    "Phase 2 trusts the operator’s bitcoind by definition. If that bitcoind is itself compromised, Class M is blind.",
  ],

  /* -----------------------------------------------------------
     10) Comparison axis — PDF #26 (only SRI is named)
     PDF: "SRI is the canonical proof that the SV2 protocol is implementable.
            ReserveGrid is built specifically for pool operators who need
            verification, not just connectivity. SRI catches the v1 policy class
            only (and not all of it); ReserveGrid adds the re-derivation and
            mempool-ground-truth layers."
     We do NOT invent a multi-vendor matrix. Single comparison: Veldra vs SRI.
     ----------------------------------------------------------- */
  compare_sri: {
    intro: "The Stratum Reference Implementation (SRI) is the canonical proof that the SV2 protocol is implementable. Veldra is built for pool operators who need verification, not just connectivity.",
    rows: [
      { axis: "SV2 protocol surface",            sri: "Yes · canonical reference",  veldra: "Yes · production-shaped" },
      { axis: "v1 policy-class checks",          sri: "Partial",                    veldra: "Full · 91 v1 reason codes" },
      { axis: "L2 invariant re-derivation",      sri: "No",                         veldra: "Yes · 22 v2_invariant codes" },
      { axis: "L3 mempool ground truth",         sri: "No",                         veldra: "Yes · Phase 2 Class M" },
      { axis: "Built for pool operator deployment", sri: "Implementation reference",  veldra: "Yes" },
    ],
    note: "DATUM and other miner-side template protocols are ecosystem context. Veldra’s verification layer is independent of which miner-side protocol the pool runs.",
  },

  /* -----------------------------------------------------------
     11) Differentiation content beyond SRI — PDF #28-#34
     ----------------------------------------------------------- */
  differentiation: {
    bitcoin_core_30_anchor: "Bitcoin Core 30.0 IPC mining interface (October 2025). Ocean and DEMAND in production. Braiins ships SV2 firmware at scale.",
    why_not_diy: "Pools do not build their own ASICs, firmware, or networking stacks. Template verification is the same kind of specialization. Engineering hours spent on verification infrastructure are hours not spent on payout, uptime, fees.",
    escrow_continuity: "If Veldra ceases operations, full source releases under a permissive license. Pool keeps deployment, configuration, data. No lock-in risk.",
    license: "Source-available. Every line auditable. Commercial deployment requires a license; no opacity.",
    dual_prevhash: {
      headline: "Dual prevhash buffer.",
      detail: "Gateway holds two pending templates simultaneously during block transitions with a 50ms verdict window. Miners never wait on the verifier across a block transition.",
    },
    rg_desktop: "Native macOS / Linux app (Tauri-built). Wraps the dashboard, manages licensing, includes signed auto-update.",
    rg_feed_server: "Veldra-hosted authenticated WebSocket relay. Streams identical mainnet template data to operators running observe-mode without their own production bitcoind.",
  },

  /* -----------------------------------------------------------
     12) Adoption — PDF #35-#37
     ----------------------------------------------------------- */
  adoption: {
    modes: [
      { id: "shadow",  label: "Shadow",    cost: "Free",                         time: "~1 day to wire",
        gloss: "Run the gateway behind your existing path with verdict = warn-only. Zero share-flow change." },
      { id: "observe", label: "Observe",   cost: "License",                      time: "~1 week",
        gloss: "Self-hosted Docker stack plus license key. Mainnet bitcoind required (or use rg-feed-server)." },
      { id: "inline",  label: "Inline",    cost: "License",                      time: "Depends on infra readiness",
        gloss: "Fail-closed enforcement. Gateway in the share path." },
    ],
    license_key_flow: "Operators who want observe or inline mode get a license key from their veldra.org account (Sign In).",
    bitcoind_prereq: "Observe and inline both require operator-side bitcoind: synced, resourced, RPC reachable, env-var or [policy.mempool] rpc_* credentials wired.",
  },

  /* -----------------------------------------------------------
     13) Industry context — PDF H (#38-#39)
     ----------------------------------------------------------- */
  industry: {
    halving: "Block reward 3.125 BTC. Each invalid block, half-empty block, or policy-violating template costs more than 18 months ago.",
    concentration: "Foundry plus Antpool 51% (August 2025). Five pools control ~80%. Source: b10c. Fewer independent template validation points raises the cost of any one pool's verification gap.",
  },

  /* -----------------------------------------------------------
     14) Roadmap — PDF J (#41-#43)
     PDF gives NO calendar dates. Only ordered milestones.
     ----------------------------------------------------------- */
  roadmap: [
    { id: "v2.0.0",   label: "v2.0.0 launch milestone", status: "current",
      blurb: "Invariant Shield Phase 1 plus Phase 2 mempool ground truth." },
    { id: "p1.5",     label: "Phase 1.5",                status: "next engineering bucket",
      blurb: "Seven Tier 3 belt-and-suspenders invariants wire after the v2.0.0 production observation cycle completes cleanly." },
    { id: "v3.x",     label: "v3.x (mild vision)",       status: "design sketch",
      blurb: "Selfish mining detection. Per-tx detail mode plus the four Phase 2 metrics shipped in v2.0.0 set up the data shape for time-series detection of templates whose unknown-tx sets cluster temporally with structurally coherent fingerprints. v3.x design begins from the shipped Phase 2 surface — no protocol change required, no migration cost beyond enabling per-tx detail in operator policy. Source: docs/v3-selfish-mining-design-sketch.md." },
  ],

  /* -----------------------------------------------------------
     15) Translation parity — PDF K #44
     ----------------------------------------------------------- */
  i18n_note: "Every content topic must land in EN, ES, ZH to maintain language-toggle integrity. ES and ZH currently mirror EN. v2.0.0 additions need translation parity before public launch.",

  /* -----------------------------------------------------------
     16) Honest scoping callout — PDF I #40
     ----------------------------------------------------------- */
  honest_scoping: "v2.0.0 wired, on origin, CI green. Independent consensus re-derivation runs. Mempool ground truth runs. The launch claim that the system catches consistent template-manager tampering at the verifier layer in production requires the production observation cycle to complete first. Until then, public messaging distinguishes “wired and tested in CI” from “validated against real mainnet templates over a multi-week observation window.”",
};
