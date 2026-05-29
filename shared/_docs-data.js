/* ============================================================================
   VELDRA · Docs canonical data
   Authority: Veldra/services/reservegrid-common/src/reason.rs (ALL/ALL_CODES)
   95 reason codes total. Phase 1 = 91. Phase 2 = +4 mempool codes.
   ============================================================================ */

window.DOCS_DATA = {
  totals: {
    reason_codes: 95,
    config_keys: 60,
    phase1_codes: 91,
    phase2_codes: 4,
  },

  // Category metadata — order matters (used in section order on page).
  categories: [
    { id: "verify",    label: "Verifier · Template Policy",       count: 14,    accent: "#a78bfa" },
    { id: "shield",    label: "Invariant Shield · Phase 1 (S+D)", count: 18,    accent: "#fbbf24" },
    { id: "shield_m",  label: "Invariant Shield · Phase 2 (M)",   count: 4,  accent: "#f87171" },
    { id: "gateway",   label: "Gateway · Operational",            count: 17,   accent: "#60a5fa" },
    { id: "transport", label: "Transport · SV2 + Connection",     count: 9, accent: "#34d399" },
    { id: "auth",      label: "Auth · Miner Authorization",       count: 3,      accent: "#22d3ee" },
    { id: "channel",   label: "Channel · Lifecycle",              count: 5,   accent: "#22d3ee" },
    { id: "job",       label: "Job · Template + Prevhash",        count: 5,       accent: "#f472b6" },
    { id: "ingest",    label: "Share Ingestion · HMAC",           count: 4,    accent: "#94a3b8" },
    { id: "share",     label: "Share Validation",                 count: 11,     accent: "#fb923c" },
    { id: "recovery",  label: "Crash Recovery",                   count: 2,  accent: "#94a3b8" },
    { id: "health",    label: "Health Probe",                     count: 2,    accent: "#94a3b8" },
    { id: "system",    label: "System",                           count: 1,    accent: "#94a3b8" },
  ],

  codes: [
  {
    "code": "protocol_version_mismatch",
    "cat": "verify",
    "gloss": "Template protocol version does not match expected"
  },
  {
    "code": "invalid_prev_hash",
    "cat": "verify",
    "gloss": "Template prev_hash is not 32 bytes or does not parse"
  },
  {
    "code": "prev_hash_len_mismatch",
    "cat": "verify",
    "gloss": "Wire prev_hash length differs from header expectation"
  },
  {
    "code": "coinbase_value_zero_rejected",
    "cat": "verify",
    "gloss": "Coinbase output value is zero and policy rejects it"
  },
  {
    "code": "empty_template_rejected",
    "cat": "verify",
    "gloss": "Template contains zero non-coinbase transactions"
  },
  {
    "code": "tx_count_exceeded",
    "cat": "verify",
    "gloss": "Template tx count exceeds policy maximum"
  },
  {
    "code": "total_fees_below_minimum",
    "cat": "verify",
    "gloss": "Sum of fees below configured minimum"
  },
  {
    "code": "avg_fee_below_minimum",
    "cat": "verify",
    "gloss": "Average fee per vByte below configured minimum"
  },
  {
    "code": "policy_load_error",
    "cat": "verify",
    "gloss": "policy.toml could not be parsed or violates schema"
  },
  {
    "code": "mempool_backend_unavailable",
    "cat": "verify",
    "gloss": "Phase 2 RPC backend unreachable; verifier degrades to Phase 1"
  },
  {
    "code": "weight_ratio_exceeded",
    "cat": "verify",
    "gloss": "Template weight ratio exceeds policy maximum"
  },
  {
    "code": "template_stale",
    "cat": "verify",
    "gloss": "Template age exceeds max_template_age_ms"
  },
  {
    "code": "sigops_budget_warning",
    "cat": "verify",
    "gloss": "Sigops within block budget but ratio above warn threshold"
  },
  {
    "code": "coinbase_sigops_abnormal",
    "cat": "verify",
    "gloss": "Coinbase script sigops count is abnormally high"
  },
  {
    "code": "v2_invariant_coinbase_value_mismatch",
    "cat": "shield",
    "gloss": "Re-derived coinbase value disagrees with declared total"
  },
  {
    "code": "v2_invariant_template_weight_mismatch",
    "cat": "shield",
    "gloss": "Re-derived template weight differs from declared"
  },
  {
    "code": "v2_invariant_merkle_root_mismatch",
    "cat": "shield",
    "gloss": "Re-derived merkle root does not match block header"
  },
  {
    "code": "v2_invariant_witness_commitment_missing",
    "cat": "shield",
    "gloss": "Block has segwit txs but no witness commitment output"
  },
  {
    "code": "v2_invariant_witness_commitment_mismatch",
    "cat": "shield",
    "gloss": "Witness commitment output does not match witness root"
  },
  {
    "code": "v2_invariant_sigops_mismatch",
    "cat": "shield",
    "gloss": "Re-derived total sigops disagrees with declared"
  },
  {
    "code": "v2_invariant_coinbase_sigops_mismatch",
    "cat": "shield",
    "gloss": "Re-derived coinbase sigops disagrees with declared"
  },
  {
    "code": "v2_invariant_tx_count_mismatch",
    "cat": "shield",
    "gloss": "Re-counted txs disagrees with declared count"
  },
  {
    "code": "v2_invariant_coinbase_script_length",
    "cat": "shield",
    "gloss": "Coinbase script length outside protocol bounds (2..=100 bytes)"
  },
  {
    "code": "v2_invariant_coinbase_output_count",
    "cat": "shield",
    "gloss": "Coinbase output count is zero"
  },
  {
    "code": "v2_invariant_coinbase_bip34_missing",
    "cat": "shield",
    "gloss": "Coinbase script lacks BIP-34 height push"
  },
  {
    "code": "v2_invariant_coinbase_height_mismatch",
    "cat": "shield",
    "gloss": "BIP-34 height in coinbase ≠ declared template height"
  },
  {
    "code": "v2_invariant_weight_exceeds_max",
    "cat": "shield",
    "gloss": "Template weight exceeds 4 000 000 (consensus max)"
  },
  {
    "code": "v2_invariant_sigops_exceed_max",
    "cat": "shield",
    "gloss": "Template sigops exceed 80 000 (consensus max)"
  },
  {
    "code": "v2_invariant_nontcb_null_prevout",
    "cat": "shield",
    "gloss": "Non-coinbase transaction has a null prevout"
  },
  {
    "code": "v2_invariant_header_version_low",
    "cat": "shield",
    "gloss": "Block header version below BIP-34 minimum (2)"
  },
  {
    "code": "v2_invariant_duplicate_tx",
    "cat": "shield",
    "gloss": "Duplicate txid present in template"
  },
  {
    "code": "v2_invariant_decode_failed",
    "cat": "shield",
    "gloss": "Could not decode raw transaction bytes"
  },
  {
    "code": "v2_invariant_mempool_tx_unknown",
    "cat": "shield_m",
    "gloss": "Phase 2: template tx not present in operator mempool snapshot"
  },
  {
    "code": "v2_invariant_mempool_tolerance_exceeded",
    "cat": "shield_m",
    "gloss": "Phase 2: unknown-tx ratio exceeds [policy.mempool] tolerance_pct"
  },
  {
    "code": "v2_invariant_mempool_unavailable",
    "cat": "shield_m",
    "gloss": "Phase 2: bitcoind RPC unavailable; degraded to Phase 1"
  },
  {
    "code": "v2_invariant_mempool_view_stale",
    "cat": "shield_m",
    "gloss": "Phase 2: mempool snapshot age exceeds max_stale_secs"
  },
  {
    "code": "auth_failed",
    "cat": "gateway",
    "gloss": "API key or HMAC signature did not validate"
  },
  {
    "code": "unsupported_algorithm",
    "cat": "gateway",
    "gloss": "Auth or signing algorithm unknown to this build"
  },
  {
    "code": "rate_limited",
    "cat": "gateway",
    "gloss": "Caller exceeded RPS quota for this endpoint"
  },
  {
    "code": "payload_too_large",
    "cat": "gateway",
    "gloss": "Body exceeds max_payload_bytes"
  },
  {
    "code": "invalid_content_type",
    "cat": "gateway",
    "gloss": "Content-Type does not match expected media"
  },
  {
    "code": "payload_unknown_field",
    "cat": "gateway",
    "gloss": "JSON payload contains an unknown field (strict deserializer)"
  },
  {
    "code": "payload_field_out_of_range",
    "cat": "gateway",
    "gloss": "Numeric field outside accepted bounds"
  },
  {
    "code": "payload_malformed",
    "cat": "gateway",
    "gloss": "Body could not be parsed as JSON"
  },
  {
    "code": "payload_nesting_exceeded",
    "cat": "gateway",
    "gloss": "JSON nesting exceeds the parser ceiling"
  },
  {
    "code": "request_expired",
    "cat": "gateway",
    "gloss": "Signed request timestamp outside replay window"
  },
  {
    "code": "request_replayed",
    "cat": "gateway",
    "gloss": "Request HMAC matches a previously-seen one"
  },
  {
    "code": "handler_timeout",
    "cat": "gateway",
    "gloss": "Handler exceeded handler_timeout_ms before responding"
  },
  {
    "code": "config_invalid",
    "cat": "gateway",
    "gloss": "Config file failed validation at startup"
  },
  {
    "code": "internal_line_too_large",
    "cat": "gateway",
    "gloss": "Internal NDJSON message exceeded MAX_INTERNAL_LINE_BYTES (1 MiB)"
  },
  {
    "code": "internal_framing_error",
    "cat": "gateway",
    "gloss": "Internal NDJSON message could not be parsed"
  },
  {
    "code": "internal_version_mismatch",
    "cat": "gateway",
    "gloss": "Internal msg_type version not supported"
  },
  {
    "code": "internal_unknown_msg_flood",
    "cat": "gateway",
    "gloss": "Unknown msg_type exceeded MAX_UNKNOWN_MSG_TYPE_PER_MINUTE"
  },
  {
    "code": "noise_handshake_failed",
    "cat": "transport",
    "gloss": "Noise NX handshake did not complete"
  },
  {
    "code": "noise_handshake_timeout",
    "cat": "transport",
    "gloss": "Handshake exceeded handshake_timeout_ms"
  },
  {
    "code": "unsupported_protocol_version",
    "cat": "transport",
    "gloss": "Miner offered unsupported SV2 protocol version"
  },
  {
    "code": "frame_decode_error",
    "cat": "transport",
    "gloss": "SV2 binary frame could not be decoded"
  },
  {
    "code": "frame_too_large",
    "cat": "transport",
    "gloss": "Frame exceeded maximum allowed size"
  },
  {
    "code": "connection_rate_limited",
    "cat": "transport",
    "gloss": "Inbound connections exceeded per-IP rate limit"
  },
  {
    "code": "peer_quota_exceeded",
    "cat": "transport",
    "gloss": "Peer exceeded rate_limit_messages_per_sec or _bytes_per_sec"
  },
  {
    "code": "miner_unauthorized",
    "cat": "auth",
    "gloss": "Miner credentials did not validate against whitelist"
  },
  {
    "code": "identity_prefix_unmatched",
    "cat": "auth",
    "gloss": "Worker identity prefix not in pool's expected list"
  },
  {
    "code": "identity_too_long",
    "cat": "auth",
    "gloss": "Worker identity longer than max_worker_id_bytes"
  },
  {
    "code": "channel_open_rejected",
    "cat": "channel",
    "gloss": "OpenMiningChannel denied (mapped to SV2 error)"
  },
  {
    "code": "channel_limit_exceeded",
    "cat": "channel",
    "gloss": "Connection exceeded max_channels_per_connection"
  },
  {
    "code": "invalid_channel_id",
    "cat": "channel",
    "gloss": "Channel ID not recognized for this connection"
  },
  {
    "code": "extended_channel_unsupported",
    "cat": "channel",
    "gloss": "Extended channel requested; this build only supports standard channels"
  },
  {
    "code": "prevhash_switch_timeout",
    "cat": "job",
    "gloss": "Prevhash verdict not received within prevhash_verdict_timeout_ms"
  },
  {
    "code": "prevhash_verdict_rejected",
    "cat": "job",
    "gloss": "Prevhash verdict was 'reject'; gateway fail-closed"
  },
  {
    "code": "template_cache_miss",
    "cat": "job",
    "gloss": "Job references a template the gateway no longer has"
  },
  {
    "code": "stale_job_submission",
    "cat": "job",
    "gloss": "Submission references a job from a prior prevhash epoch"
  },
  {
    "code": "upstream_unavailable",
    "cat": "job",
    "gloss": "Template source (template-manager) not reachable"
  },
  {
    "code": "missing_gateway_signature",
    "cat": "ingest",
    "gloss": "Share posted without HMAC header"
  },
  {
    "code": "malformed_gateway_signature",
    "cat": "ingest",
    "gloss": "HMAC header could not be decoded"
  },
  {
    "code": "malformed_event_id",
    "cat": "ingest",
    "gloss": "Event ID is not a valid v7 ULID/UUID"
  },
  {
    "code": "invalid_gateway_signature",
    "cat": "ingest",
    "gloss": "HMAC signature did not validate against gateway key"
  },
  {
    "code": "share_replay_detected",
    "cat": "share",
    "gloss": "Share event_id matches a recently-seen one (dedup window)"
  },
  {
    "code": "share_difficulty_below_target",
    "cat": "share",
    "gloss": "Submitted difficulty below configured minimum"
  },
  {
    "code": "share_invalid_job_id",
    "cat": "share",
    "gloss": "Submission references unknown job ID"
  },
  {
    "code": "share_invalid_nonce",
    "cat": "share",
    "gloss": "Header bytes hash does not satisfy share difficulty"
  },
  {
    "code": "version_bit_violation",
    "cat": "share",
    "gloss": "version_bits outside BIP-320 general purpose mask"
  },
  {
    "code": "ntime_out_of_range",
    "cat": "share",
    "gloss": "Submitted ntime outside template-allowed window"
  },
  {
    "code": "share_forward_failed",
    "cat": "share",
    "gloss": "Could not POST share to upstream within retry budget"
  },
  {
    "code": "share_upstream_rejected",
    "cat": "share",
    "gloss": "Upstream (pool/template-manager) returned a non-2xx status"
  },
  {
    "code": "share_dropped_queue_full",
    "cat": "share",
    "gloss": "Outbound share queue at capacity; backpressure policy = drop"
  },
  {
    "code": "share_evicted_from_queue",
    "cat": "share",
    "gloss": "Share evicted by newer entry under FIFO eviction"
  },
  {
    "code": "share_rate_limited",
    "cat": "share",
    "gloss": "Per-account share rate exceeded pool_account_rate_limit"
  },
  {
    "code": "process_crash_recovery",
    "cat": "recovery",
    "gloss": "Synthetic forward result for shares orphaned by a crash"
  },
  {
    "code": "wal_write_failure",
    "cat": "recovery",
    "gloss": "WAL append failed; gateway shutting down to preserve durability"
  },
  {
    "code": "peer_transport_error",
    "cat": "transport",
    "gloss": "Peer TCP connection dropped or transport I/O error"
  },
  {
    "code": "channel_open_timeout",
    "cat": "channel",
    "gloss": "Peer did not OpenMiningChannel within channel_open_timeout_ms"
  },
  {
    "code": "setup_connection_rejected",
    "cat": "transport",
    "gloss": "SV2 SetupConnection exchange failed"
  },
  {
    "code": "shutdown_drain",
    "cat": "health",
    "gloss": "Gateway is draining connections during graceful shutdown"
  },
  {
    "code": "startup_pending",
    "cat": "health",
    "gloss": "Gateway has not completed startup initialization"
  },
  {
    "code": "internal_error",
    "cat": "system",
    "gloss": "Catch-all for unexpected internal failures"
  }
],
};
