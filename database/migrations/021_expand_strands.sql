-- Expand path401_identity_strands to support all strand types (not just OAuth)
-- Adds strand_type, strand_subtype, signature_id, label, source columns
-- Adjusts unique constraint: one-per-provider only for oauth strand_type

-- New columns
ALTER TABLE path401_identity_strands ADD COLUMN IF NOT EXISTS strand_type TEXT DEFAULT 'oauth';
ALTER TABLE path401_identity_strands ADD COLUMN IF NOT EXISTS strand_subtype TEXT;
ALTER TABLE path401_identity_strands ADD COLUMN IF NOT EXISTS signature_id UUID;
ALTER TABLE path401_identity_strands ADD COLUMN IF NOT EXISTS label TEXT;
ALTER TABLE path401_identity_strands ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'path401';

-- Drop the old unique constraint (one strand per provider per identity)
-- and replace with a partial unique index (only for oauth strands)
ALTER TABLE path401_identity_strands DROP CONSTRAINT IF EXISTS path401_identity_strands_identity_token_id_provider_key;

CREATE UNIQUE INDEX IF NOT EXISTS idx_strands_unique_oauth
  ON path401_identity_strands(identity_token_id, provider)
  WHERE strand_type = 'oauth' AND is_active = true;

-- Index for strand_type queries
CREATE INDEX IF NOT EXISTS idx_strands_type ON path401_identity_strands(strand_type);
CREATE INDEX IF NOT EXISTS idx_strands_source ON path401_identity_strands(source);
