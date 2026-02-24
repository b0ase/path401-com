-- PATH401.com Identity Strands Schema
-- Run on Hetzner Supabase: ssh hetzner "docker exec supabase-db psql -U postgres -d postgres" < database/migrations/010_identity_strands.sql

-- Identity Strands ($401 OAuth proof chains)
CREATE TABLE IF NOT EXISTS path401_identity_strands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identity_token_id UUID NOT NULL REFERENCES path402_identity_tokens(id) ON DELETE CASCADE,
  holder_id UUID NOT NULL REFERENCES path402_holders(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  provider_user_id TEXT NOT NULL,
  provider_handle TEXT,
  provider_display_name TEXT,
  provider_avatar_url TEXT,
  provider_metadata JSONB DEFAULT '{}',
  proof_hash TEXT NOT NULL,
  inscription_data JSONB,
  strand_txid TEXT,
  broadcast_status TEXT NOT NULL DEFAULT 'local'
    CHECK (broadcast_status IN ('local', 'pending', 'confirmed', 'failed')),
  oauth_verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(identity_token_id, provider)
);

CREATE INDEX IF NOT EXISTS idx_strands_identity ON path401_identity_strands(identity_token_id);
CREATE INDEX IF NOT EXISTS idx_strands_holder ON path401_identity_strands(holder_id);
CREATE INDEX IF NOT EXISTS idx_strands_provider ON path401_identity_strands(provider, provider_user_id);
