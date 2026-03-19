-- PATH401.com Veriff KYC Sessions
-- Tracks Veriff identity verification sessions for creating kyc/veriff strands

CREATE TABLE IF NOT EXISTS path401_kyc_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identity_token_id UUID NOT NULL REFERENCES path402_identity_tokens(id) ON DELETE CASCADE,
  holder_id UUID NOT NULL REFERENCES path402_holders(id) ON DELETE CASCADE,
  veriff_session_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'declined', 'expired')),
  veriff_response JSONB,
  decision_payload JSONB,
  strand_id UUID REFERENCES path401_identity_strands(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_path401_kyc_sessions_identity ON path401_kyc_sessions(identity_token_id);
CREATE INDEX IF NOT EXISTS idx_path401_kyc_sessions_holder ON path401_kyc_sessions(holder_id);
CREATE INDEX IF NOT EXISTS idx_path401_kyc_sessions_status ON path401_kyc_sessions(status);
CREATE INDEX IF NOT EXISTS idx_path401_kyc_sessions_veriff_id ON path401_kyc_sessions(veriff_session_id);
