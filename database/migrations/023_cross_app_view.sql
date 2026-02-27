-- Cross-app view: see ALL strands for an identity regardless of source app
-- Joins path401_identity_strands with path402_identity_tokens

CREATE OR REPLACE VIEW v_identity_strands_unified AS
SELECT
  s.id,
  s.identity_token_id,
  t.symbol,
  t.holder_id,
  s.provider,
  s.provider_user_id,
  s.provider_handle,
  s.provider_display_name,
  s.provider_avatar_url,
  s.provider_metadata,
  s.proof_hash,
  s.strand_txid,
  s.broadcast_status,
  s.strand_type,
  s.strand_subtype,
  s.signature_id,
  s.label,
  s.source,
  s.is_active,
  s.created_at,
  t.identity_level,
  t.identity_strength_score
FROM path401_identity_strands s
JOIN path402_identity_tokens t ON s.identity_token_id = t.id
WHERE s.is_active = true;
