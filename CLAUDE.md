# path401-com — $401 Identity Protocol

> The identity layer of the $4xx protocol trilogy: 401 (identity), 402 (payment), 403 (securities).

## What This Is

path401-com is a multi-variant Next.js site that serves the $401 identity protocol at **path401.com**. The same codebase also hosts path402.com and path403.com content under `/402` and `/403` routes.

The $401 protocol provides **tiered, self-sovereign identity** on Bitcoin SV using on-chain inscriptions. Identity strength graduates from OAuth (Lv.1) through self-attestation (Lv.2) and paid/peer verification (Lv.3) to biometric KYC (Lv.4).

**Companion project**: bit-sign.online (`/Volumes/2026/Projects/bit-sign/`) is the signing tool and primary UI for $401 identity management.

## Stack

| Component | Technology |
|-----------|-----------|
| Framework | Next.js 16.1.6 (App Router) |
| Language | TypeScript 5, React 19.2.4 |
| Styling | Tailwind CSS, Framer Motion 12.29 |
| 3D | Three.js 0.182 (ID Tree visualisation) |
| Blockchain | BSV (`bsv@2.0.10`), HandCash SDK |
| Database | Self-hosted Supabase on Hetzner |
| Auth | HandCash OAuth + GitHub/Twitter/Google strands |
| Testing | Vitest |
| Hosting | Vercel (auto-deploy on push to main) |
| Package Manager | **pnpm** (always) |

## Directory Structure

```
path401-com/
├── app/
│   ├── 401/                    # $401 identity hero page
│   ├── 402/                    # $402 content variant
│   ├── 403/                    # $403 securities variant (planned)
│   ├── api/
│   │   ├── auth/
│   │   │   ├── handcash/       # HandCash login flow
│   │   │   ├── strand/[provider]/          # OAuth strand initiation
│   │   │   └── strand/callback/[provider]/ # OAuth strand callback
│   │   ├── client/
│   │   │   ├── identity/       # Get current identity
│   │   │   └── strands/        # CRUD + broadcast strands
│   │   ├── domain/             # Domain verification
│   │   ├── token/              # Token operations
│   │   └── wallet/             # Wallet registration
│   ├── id-tree/                # 3D identity tree (Three.js)
│   ├── identity/               # Strand management UI
│   ├── token/                  # Token trading
│   └── account/                # User dashboard
├── lib/
│   ├── strand-store.ts         # Strand CRUD (Supabase + in-memory fallback)
│   ├── strand-providers.ts     # OAuth provider configs (GitHub, Twitter, Google)
│   ├── strand-inscribe.ts      # On-chain inscription wrapper
│   ├── strand-strength.ts      # Identity strength scoring
│   ├── auth-guard.ts           # HandCash auth middleware
│   ├── bsv-inscribe.ts         # BSV inscription engine
│   ├── supabase.ts             # Database client
│   └── x402/                   # x402 protocol library
├── database/
│   └── migrations/
│       └── 010_identity_strands.sql  # Strand table schema
├── docs/
│   ├── $401-STANDARD.md        # Protocol specification
│   ├── $402-STANDARD.md        # Payment protocol spec
│   ├── PROTOCOL_VISION.md      # Protocol design vision
│   ├── ARCHITECTURE.md         # Five-layer system
│   └── DOC_INDEX.md            # Documentation hub
├── components/
│   ├── heroes/                 # Hero animations
│   ├── WalletProvider.tsx      # Wallet context
│   └── ThemeProvider.tsx       # Theme context
└── middleware.ts               # Auth/routing middleware
```

## Key Concepts

### Identity Strands

Each $401 identity has a **root inscription** (the identity token) and zero or more **strands** (proof chains). Strands are OAuth verifications, self-attestations, or other identity proofs appended to the root.

```
Root ($401 token) ← GitHub strand ← Twitter strand ← paid_signing strand
```

### Trust Levels

| Level | Label | Gating Strand | Anti-Gaming |
|-------|-------|---------------|-------------|
| Lv.1 | Basic | Any OAuth | Can be botted |
| Lv.2 | Verified | `self_attestation`, `CAMERA`, `VIDEO`, `id_document/*` | Requires personal declaration |
| Lv.3 | Strong | `paid_signing`, `peer_attestation/cosign` | Costs money or needs real counterparty |
| Lv.4 | Sovereign | `kyc/veriff` | Biometric verification |

Levels are **type-gated**, not score-gated. 50 OAuth strands = still Lv.1.

### On-Chain Format

```json
{
  "p": "401",
  "op": "strand",
  "v": "1.0",
  "root": "<root_txid>",
  "provider": "github",
  "handle": "@alice",
  "proofHash": "sha256(<oauth_token>)",
  "ts": "<iso8601>"
}
```

## Development

```bash
pnpm install
pnpm dev --port 4010
```

### Environment Variables

See `.env.example`. Key vars:

| Variable | Purpose |
|----------|---------|
| `TREASURY_ADDRESS` | BSV address for inscriptions |
| `TREASURY_PRIVATE_KEY` | WIF key for signing transactions |
| `HANDCASH_APP_ID` / `SECRET` | HandCash OAuth |
| `GITHUB_CLIENT_ID` / `SECRET` | GitHub OAuth strand |
| `TWITTER_CLIENT_ID` / `SECRET` | Twitter/X OAuth strand (uses PKCE) |
| `GOOGLE_CLIENT_ID` / `SECRET` | Google OAuth strand |
| `SUPABASE_URL` / `SERVICE_KEY` | Database (self-hosted Hetzner) |
| `NEXT_PUBLIC_APP_URL` | Production URL (https://path401.com) |

### Database

Self-hosted Supabase on Hetzner. **Never use supabase.com dashboard.**

```bash
# Run SQL
ssh hetzner "docker exec supabase-db psql -U postgres -d postgres -c 'SELECT ...'"

# Apply migration
ssh hetzner "docker exec -i supabase-db psql -U postgres -d postgres" < database/migrations/010_identity_strands.sql
```

Key tables:
- `path401_identity_strands` — OAuth proof chains
- `path402_identity_tokens` — Root identity tokens
- `path402_holders` — Registered users (HandCash)

## OAuth Strand Flow

1. User clicks "Link GitHub" → `GET /api/auth/strand/github` → redirects to GitHub OAuth
2. GitHub callback → `GET /api/auth/strand/callback/github` → exchanges code for token
3. Token is hashed (`SHA256`), never stored. User profile fetched.
4. Strand record created in DB with `broadcast_status: 'local'`
5. User clicks "Inscribe" → `POST /api/client/strands/[id]/broadcast` → inscribes on BSV
6. Status updates to `confirmed` with `strand_txid`

Twitter uses PKCE (code_challenge/code_verifier). GitHub and Google use standard OAuth 2.0.

## Integration Points

### bit-sign.online (Signing Tool)

bit-sign.online is the primary UI for:
- Document sealing and signing
- Identity strand management (self-attestation, paid signing, peer attestation)
- Co-signing flows that auto-create `peer_attestation/cosign` strands
- Envelope signing with payment that auto-creates `paid_signing` strands

The two projects share the $401 identity model but have separate codebases and databases.

### $402 Protocol (Payment)

$401 and $402 tokens are designed to be **paired**. $401 identity levels gate $402 capabilities:
- Lv.1: browse + small tips
- Lv.3: stake $402 for revenue share
- Lv.4: operate facilitator nodes

### $403 Protocol (Securities)

$403 security token operations require $401 identity for KYC compliance. The identity bridge (`path401d :4011`) provides verification to the $403 daemon.

### BCorp Mint

$401 identity integrates with Bitcoin Corporation's minting infrastructure. Identity levels gate access to mint operations.

## Deployment

```bash
pnpm build          # Build for production
git push origin main # Auto-deploys to Vercel
```

Domain routing:
- `path401.com` → this project (Vercel)
- `path402.com` → this project (Vercel, different domain binding)
- `path403.com` → path403 project (separate)

## Files You'll Touch Most

| File | What It Does |
|------|-------------|
| `app/identity/page.tsx` | Strand management UI (710 lines) |
| `app/id-tree/page.tsx` | 3D identity visualisation (740 lines) |
| `lib/strand-store.ts` | Strand CRUD operations (250 lines) |
| `lib/strand-providers.ts` | OAuth provider config (128 lines) |
| `lib/strand-strength.ts` | Strength scoring algorithm (40 lines) |
| `app/api/auth/strand/callback/[provider]/route.ts` | OAuth callback handler (167 lines) |
| `docs/$401-STANDARD.md` | Protocol specification |

## Security Rules

1. **Never store OAuth tokens** — hash them immediately, discard the plaintext.
2. **CSRF on all OAuth flows** — state parameter in httpOnly cookie.
3. **PKCE for Twitter** — code_challenge/code_verifier pair.
4. **No secrets in git** — use `.env.local`, update `.env.example` for new vars.
5. **Soft delete strands** — `is_active = false`, never hard delete.
6. **Treasury keys** — referenced by env var name only, never embedded in code.

---

*Last updated: February 2026*
