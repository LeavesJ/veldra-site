/* ============================================================================
   VELDRA — Failure Atlas shared content
   8 documented public incidents (source doc §D items 15–22).
   Variants present this differently; numbers + sources stay aligned.

   Each incident maps to:
     - the v1 gateway reason code that fires today
     - the v2 invariant code that catches the same defect independently
     - the trust layer (L1/L2/L3) that closes the gap
   The point of the page: history shows this class of failure happens.
   The system was built around this history, not in spite of it.
   ============================================================================ */

window.ATLAS_CONTENT = {

  /* -----------------------------------------------------------
     Page-level framing (all variants share)
     ----------------------------------------------------------- */
  framing: {
    eyebrow: "▸ FAILURE ATLAS",
    title_lines: ["Eight times the network", "shipped a bad block."],
    lede: "Public incidents, public sources. Every one mapped to the reason code Veldra would emit, and the trust layer that would have caught it before it left the pool.",
    hed_facts: [
      { k: "8",    l: "documented incidents · 2015–2025" },
      { k: "$50K+", l: "publicly-reported direct loss · SPV 2015 alone" },
      { k: "26%",  l: "network share dependent on a single template source · 2024" },
      { k: "3",    l: "distinct loss classes named · orphan, invalid, censorship" },
    ],
    disclaimer: "Sources cited per incident. No claim is made that Veldra was deployed at any of these pools at the time. The argument is that the v2.0.0 reason-code surface is the surface that names these failures; that is testable against the historical record.",
  },

  /* -----------------------------------------------------------
     Trust-layer key (Section B of the source doc, as Atlas legend)
     ----------------------------------------------------------- */
  layer_key: [
    { L: "L1", name: "Policy",          blurb: "Trusts what the template declares; thresholds the operator tunes.",                  catches: "Threshold breaches, declared anomalies." },
    { L: "L2", name: "Invariant Shield", blurb: "Re-derives consensus quantities from raw block bytes. Trusts no declared field.",   catches: "Declared-vs-bytes mismatch. Structural exceed-max." },
    { L: "L3", name: "Mempool Truth",    blurb: "Independent bitcoind. Cross-references template tx set against the network.",       catches: "Consistent template-manager tampering. Phantom tx sets." },
  ],

  /* -----------------------------------------------------------
     Threat-class taxonomy (Section C, items 12-13)
     ----------------------------------------------------------- */
  threat_classes: [
    { id: "T1", name: "raw_block tampering",                   coverage: "in",  by: "L2" },
    { id: "T2", name: "declared-vs-bytes mismatch",            coverage: "in",  by: "L2" },
    { id: "T3", name: "consistent template-manager tampering", coverage: "in",  by: "L3" },
    { id: "T4", name: "compromised operator bitcoind",         coverage: "out", by: "—"  },
    { id: "T5", name: "selfish mining · policy divergence",    coverage: "out", by: "v3.x" },
  ],

  /* -----------------------------------------------------------
     The 8 incidents (source doc §D, items 15-22)
     Field discipline:
       slug:        url-safe handle
       date:        ISO YYYY-MM-DD or YYYY-MM (range -> first occurrence)
       date_label:  display label
       year:        for sort
       title:       editorial headline (operator-blunt, factual)
       actor:       pool(s) named in source
       loss_class:  "orphan" | "invalid" | "empty" | "censorship" | "near-miss" | "structural"
       headline_metric: { v: <number>, u: <unit/short label> }
       summary:     2-4 sentences, plain-language operator narrative
       facts:       short bullets — concrete numbers + nouns
       sources:     [{ name, kind: "blog"|"chain"|"news", note? }]
       v1_codes:    gateway reason codes that fire today
       v2_codes:    v2_invariant_* code(s) that close the declared-vs-derived gap
       layer:       "L1" | "L2" | "L3"
       threat:      "T1" | "T2" | "T3"
       caught_now:  short sentence stating what v2.0.0 emits if this template arrives
     ----------------------------------------------------------- */
  incidents: [
    {
      slug: "foundry-2blk-reorg-941881",
      date: "2025",
      date_label: "Date not pinned in source",
      year: 2025,
      title: "Foundry triggers a 2-block reorg at height 941,881.",
      actor: "Foundry · AntPool · ViaBTC",
      loss_class: "orphan",
      headline_metric: { v: 2, u: "blocks orphaned" },
      summary:
        "A Foundry-mined block produced a chain segment that orphaned an AntPool block and a ViaBTC block. The reason code that fires today is weight_ratio_exceeded; the v2.0.0 invariant codes name the declared-vs-derived gap and the structural-exceed-max condition independently of the policy threshold.",
      facts: [
        "Height 941,881 · 2 confirmations rolled back",
        "AntPool block · ViaBTC block · both orphaned",
        "Reason code that fires today: weight_ratio_exceeded",
        "Found post-hoc by independent observers (b10c)",
      ],
      sources: [
        { name: "b10c · 2-block reorg analysis",            kind: "blog" },
        { name: "mempool.space · block 941881 history",     kind: "chain" },
      ],
      v1_codes: ["weight_ratio_exceeded"],
      v2_codes: ["v2_invariant_template_weight_mismatch", "v2_invariant_weight_exceeds_max"],
      layer: "L2",
      threat: "T2",
      caught_now: "v2_invariant_template_weight_mismatch fires before the template is forwarded to the miner. No reorg, no orphan, no payout dispute.",
    },

    {
      slug: "f2pool-sigops-783426-784121",
      date: "2023-04",
      date_label: "Apr 2023",
      year: 2023,
      title: "F2Pool ships two invalid blocks · custom sigops patch in production.",
      actor: "F2Pool",
      loss_class: "invalid",
      headline_metric: { v: 2, u: "invalid blocks · same operator" },
      summary:
        "F2Pool deployed a custom Bitcoin Core patch that lowered the coinbase-reserved sigops budget. Two blocks at heights 783,426 and 784,121 were emitted with sigops accounting that disagreed with the network. Both were rejected. The patch was internal, the failure was external.",
      facts: [
        "Heights 783,426 · 784,121",
        "Custom patch reduced reserved sigops",
        "Coinbase sigops abnormal · sigops budget warning",
        "Public source: BitMEX Research, b10c",
      ],
      sources: [
        { name: "BitMEX Research · F2Pool sigops",          kind: "blog" },
        { name: "b10c · sigops budget anomaly",             kind: "blog" },
      ],
      v1_codes: ["sigops_budget_warning", "coinbase_sigops_abnormal"],
      v2_codes: ["v2_invariant_sigops_mismatch", "v2_invariant_sigops_exceed_max"],
      layer: "L2",
      threat: "T2",
      caught_now: "v2_invariant_sigops_mismatch fires on declared-vs-derived divergence; v2_invariant_sigops_exceed_max fires on the structural breach. Either rejects the template at the gateway.",
    },

    {
      slug: "antpool-coinbase-fork-2024-12",
      date: "2024-12",
      date_label: "Dec 2024",
      year: 2024,
      title: "Antpool fleet emits 17 seconds of jobs with a stale coinbase value.",
      actor: "Antpool · proxy fleet",
      loss_class: "near-miss",
      headline_metric: { v: 17, u: "seconds of invalid jobs" },
      summary:
        "During a brief fork at heights 874,037 / 873,559 / 875,590, Antpool’s job-distribution path served work whose coinbase value was cached against the prior tip. The cached path bypassed the policy that would have rejected a zero/stale coinbase. 17 seconds of hashrate was burned on jobs that could not have been valid.",
      facts: [
        "Heights 874,037 · 873,559 · 875,590",
        "17 seconds of stale-coinbase jobs distributed",
        "Cached coinbase values from the prior tip",
        "No block accepted on the bad templates",
      ],
      sources: [
        { name: "b10c · December 2024 coinbase fork notes", kind: "blog" },
      ],
      v1_codes: ["coinbase_value_zero_rejected"],
      v2_codes: ["v2_invariant_coinbase_value_mismatch"],
      layer: "L2",
      threat: "T2",
      caught_now: "v2_invariant_coinbase_value_mismatch is computed from the raw coinbase outputs every template — there is no cached path the verifier consults. Stale coinbase fails the re-derivation comparator immediately.",
    },

    {
      slug: "shared-template-source-2024",
      date: "2024-09",
      date_label: "Sep 2024",
      year: 2024,
      title: "Five pools shared one template source · 26% of network hashrate.",
      actor: "Antpool · BTC.com · Poolin · Binance Pool · EMCD · Rawpool",
      loss_class: "structural",
      headline_metric: { v: 26, u: "% network share · single template origin" },
      summary:
        "Template-similarity analysis of Sep 2024 blocks showed BTC.com (99%), Poolin (98%), and three smaller pools were forwarding templates from the same upstream. A single defect at that source would have propagated to a quarter of network hashrate. This is not a past failure; it is the structural condition that makes the rest of this atlas inevitable.",
      facts: [
        "BTC.com 99% template match · Poolin 98% match",
        "Binance Pool · EMCD · Rawpool also dependent",
        "Combined network share 26%+ from one origin",
        "No single-pool fix would have addressed this",
      ],
      sources: [
        { name: "b10c · template similarity analysis",      kind: "blog" },
      ],
      v1_codes: ["—"],
      v2_codes: ["v2_invariant_*"],
      layer: "L2",
      threat: "T3",
      caught_now: "Independent re-derivation at each pool’s boundary breaks the single-source dependency. The Atlas of past failures becomes the per-pool floor; defects do not propagate downstream.",
    },

    {
      slug: "f2pool-half-empty-878889",
      date: "2025-01",
      date_label: "Jan 2025",
      year: 2025,
      title: "F2Pool ships a half-empty block · 87 seconds after the prior tip.",
      actor: "F2Pool",
      loss_class: "empty",
      headline_metric: { v: 50, u: "% template fill · 87s after tip" },
      summary:
        "Block 878,889 came in roughly 50% empty. Cause: the pool’s block-maker node had been restarted without mempool.dat, so its mempool view was sparse. The block was valid; the operator simply earned half the fees they would have. A v3.x mempool-divergence detector would have flagged the gap before submission.",
      facts: [
        "Height 878,889 · ~50% template fill",
        "87 seconds after previous block",
        "Block-maker restarted without mempool.dat",
        "Block valid · fee revenue forgone",
      ],
      sources: [
        { name: "mempool.space · mononautical thread",      kind: "chain" },
        { name: "PANews · F2Pool half-empty block",         kind: "news" },
      ],
      v1_codes: ["—"],
      v2_codes: ["v2_invariant_mempool_tolerance_exceeded"],
      layer: "L3",
      threat: "T3",
      caught_now: "v2.0.0 Class M cross-references the template tx set against an independent mempool view. A 50% gap exceeds the default 4% tolerance by an order of magnitude · v2_invariant_mempool_tolerance_exceeded fires.",
    },

    {
      slug: "antpool-30s-empty-jobs",
      date: "2024",
      date_label: "2024 · ongoing",
      year: 2024,
      title: "Antpool serves empty-block jobs for 30 seconds after every tip.",
      actor: "Antpool",
      loss_class: "empty",
      headline_metric: { v: 2, u: "% empty block rate · vs <1% norm" },
      summary:
        "Antpool’s job distribution emits empty templates for the first ~30 seconds after every new block, until a full template is available. Industry norm is <1% empty blocks; Antpool has held at ~2% across the year. Operationally legal; economically lossy.",
      facts: [
        "~30 seconds of empty jobs per new tip",
        "~2% empty block rate · vs <1% network norm",
        "Pattern stable across the year · not an outage",
        "Operator can opt out of the practice with policy",
      ],
      sources: [
        { name: "b10c · empty block report",                kind: "blog" },
        { name: "mempool.space · empty block tracker",      kind: "chain" },
      ],
      v1_codes: ["template_tx_count_low_warning"],
      v2_codes: ["v2_invariant_mempool_tolerance_exceeded"],
      layer: "L1",
      threat: "T3",
      caught_now: "L1 emits template_tx_count_low_warning under default policy. Operators choosing to surface this as a verdict_warn_forward get a structured signal in their telemetry instead of an opaque pattern in the chain.",
    },

    {
      slug: "f2pool-ofac-2023-11",
      date: "2023-11",
      date_label: "Nov 2023",
      year: 2023,
      title: "F2Pool censors 6 blocks of OFAC-sanctioned transactions.",
      actor: "F2Pool",
      loss_class: "censorship",
      headline_metric: { v: 6, u: "blocks · sanctioned txs missing" },
      summary:
        "Across November 2023, six F2Pool-mined blocks were missing transactions involving OFAC-sanctioned addresses that were otherwise accepted by the rest of the network. The censorship was opaque — no public policy, no public reason. Whether one agrees with the policy or not, structured filtering with named codes is more auditable than silent omission.",
      facts: [
        "6 blocks · Nov 2023",
        "Sanctioned txs absent · accepted elsewhere",
        "No public policy disclosure at the time",
        "Public coverage: CoinDesk, TheMinerMag, b10c",
      ],
      sources: [
        { name: "CoinDesk · F2Pool OFAC filtering",         kind: "news" },
        { name: "TheMinerMag · censorship report",          kind: "news" },
        { name: "b10c · F2Pool tx omissions",               kind: "blog" },
      ],
      v1_codes: ["template_tx_filter_policy_applied"],
      v2_codes: ["—"],
      layer: "L1",
      threat: "T3",
      caught_now: "Veldra does not enforce a censorship policy in either direction. It does insist that a filter that is applied is named — operators get an audit trail of which filter ran on which template.",
    },

    {
      slug: "spv-mining-2015-07",
      date: "2015-07",
      date_label: "Jul 2015",
      year: 2015,
      title: "Half the network mines without validating · multiple miners lose >$50K.",
      actor: "F2Pool · BTCNuggets · others",
      loss_class: "invalid",
      headline_metric: { v: 50, u: "K USD+ direct loss · multiple miners" },
      summary:
        "After a soft-fork activation, several large pools continued building on a chain segment without fully validating it. SPV-mining: trust the previous block’s header, mine on top, validate later. The chain segment turned out to contain an invalid block. Multiple pools combined lost more than $50,000 in subsidy and fees. The bitcoin.org alert at the time made the cost of skipping validation explicit.",
      facts: [
        "July 2015",
        "Half of network hashrate mining unvalidated headers",
        ">$50,000 combined direct loss · public estimate",
        "Bitcoin.org issued a network alert",
      ],
      sources: [
        { name: "bitcoin.org · network alert (Jul 2015)",   kind: "news" },
      ],
      v1_codes: ["—"],
      v2_codes: [],
      layer: "L2",
      threat: "T1",
      caught_now: "SPV-mining has no v2_invariant_* code — the verifier can’t observe a header it never receives. The structural answer is gateway behaviour: validate-then-forward holds regardless of what an upstream pool does, so a misconfigured proxy can’t leak unvalidated work through a Veldra-fronted miner.",
    },
  ],

  /* -----------------------------------------------------------
     Closing argument — connects atlas to the rest of the site
     ----------------------------------------------------------- */
  closing: {
    title: "What this atlas is for.",
    body: [
      "Pool operators are asked to evaluate Veldra against the question: do we need this? The eight incidents above are the answer in the form of evidence — not a sales pitch.",
      "Each one is mapped to a v2.0.0 reason code. The reason codes are public; the source is public; the code path that emits each one is in services/rg-consensus and services/pool-verifier in the repo.",
      "If a future incident is not on this atlas, it is because it has not happened yet, not because Veldra would not name it.",
    ],
    cta_text: "Read the architecture →",
    cta_link: "Architecture.html",
  },
};
