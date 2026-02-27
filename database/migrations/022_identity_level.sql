-- Add identity_level and identity_strength_score to path402_identity_tokens
-- Enables type-gated strength levels (Basic/Verified/Strong/Sovereign)

ALTER TABLE path402_identity_tokens ADD COLUMN IF NOT EXISTS identity_level INTEGER DEFAULT 1;
ALTER TABLE path402_identity_tokens ADD COLUMN IF NOT EXISTS identity_strength_score INTEGER DEFAULT 0;
ALTER TABLE path402_identity_tokens ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'path401';
