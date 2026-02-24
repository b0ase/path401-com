# The $401 Standard

**Version**: 1.0.0
**Status**: Living Document
**Reference Implementation**: [PATH401.com](https://path401.com) + [bit-sign.online](https://bit-sign.online)
**Companion Protocols**: [$402 Standard](https://path402.com) (Payment) | [$403 Protocol](https://path403.com) (Securities)

---

## Abstract

The $401 standard defines a protocol for **decentralised, self-sovereign identity** on Bitcoin SV. It maps the HTTP 401 (Unauthorized) status code to a tiered identity verification system where:

1. **Root Inscriptions**: A cryptographically signed bundle of identity data is inscribed on-chain as an immutable root token.
2. **Identity Strands**: Additional proofs (OAuth accounts, self-attestation, paid signings, peer attestations, KYC) are appended as child inscriptions forming a verifiable chain.
3. **Tiered Trust Levels**: Identity strength graduates from Lv.1 (Basic) to Lv.4 (Sovereign) based on the types and diversity of attached strands.
4. **IP Threads**: $401 tokens double as intellectual property registration threads, accumulating signed attestations over time.

The protocol completes the HTTP status code trilogy: **401 for identity, 402 for payment, 403 for permissions**.

---

## Core Concepts

### 1. The Identity Challenge (HTTP 401)

When a service requires identity verification, it returns an HTTP 401 response with $401-specific headers indicating the minimum trust level required:

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json
X-401-Min-Level: 2
X-401-Required-Strands: self_attestation
X-401-Verify-Url: https://path401.com/verify
```

The client responds by presenting a valid $401 identity token meeting the required level. This is analogous to the $402 payment challenge but for identity rather than money.

### 2. Root Inscription (The Identity Token)

Every $401 identity begins with a **root inscription** — an encrypted, cryptographically signed bundle inscribed on BSV as a 1Sat Ordinal. The root contains:

- User handle (e.g. `$alice`)
- Encrypted identity payload (passport, driving licence, or social proof)
- Cryptographic signature binding the bundle to the user's keys
- Timestamp of creation
- Protocol version

```json
{
  "p": "401",
  "op": "root",
  "v": "1.0",
  "handle": "$alice",
  "payloadHash": "sha256(encrypted_identity_bundle)",
  "publicKey": "02abc...def",
  "signature": "3045...abcd",
  "ts": "2026-02-24T12:00:00Z"
}
```

The encrypted payload is controlled exclusively by the user's private keys. The inscription proves *when* the identity was established; the payload proves *who* without revealing it publicly.

### 3. Identity Strands

Strands are child inscriptions that reference the root, each proving a different facet of identity. Every strand contains:

```json
{
  "p": "401",
  "op": "strand",
  "v": "1.0",
  "root": "<root_txid>",
  "provider": "github",
  "handle": "@alice",
  "proofHash": "sha256(<oauth_access_token>)",
  "metadata": {},
  "ts": "2026-02-24T12:05:00Z"
}
```

**Key property**: The OAuth access token is hashed, never stored or inscribed. The `proofHash` proves the user completed OAuth verification at a specific time without exposing credentials.

---

## Strand Types

### Category 1: OAuth Strands (Lv.1 — Basic)

| Provider | Category | Points | What It Proves |
|----------|----------|--------|----------------|
| GitHub | Developer | 2 | Controls a developer account |
| Google | Email | 2 | Controls an email address |
| Twitter/X | Social | 1 | Controls a social account |
| Discord | Social | 1 | Controls a community account |
| LinkedIn | Professional | 2 | Controls a professional profile |
| Microsoft | Email | 1 | Controls an enterprise email |

OAuth strands prove account control but not legal identity. They can be botted and are therefore Lv.1 only.

### Category 2: Self-Attestation & Identity Documents (Lv.2 — Verified)

| Strand Type | Points | What It Proves |
|-------------|--------|----------------|
| `self_attestation` | 3 | User declares legal name + address |
| `CAMERA` (selfie) | 1 | Visual proof of personhood |
| `VIDEO` (liveness) | 2 | Video proof with liveness |
| `id_document/passport` | 5 | Government-issued ID scan |
| `id_document/driving_licence` | 5 | Government-issued ID scan |
| `id_document/proof_of_address` | 5 | Address verification document |

Self-attestation is the minimum bar for Lv.2: the user explicitly declares their legal name and address, creating an on-chain record they are accountable for. ID documents provide stronger evidence.

### Category 3: Economic & Peer Verification (Lv.3 — Strong)

| Strand Type | Points | What It Proves |
|-------------|--------|----------------|
| `paid_signing` | 3 | Paid real money to sign a legal document (via HandCash) |
| `peer_attestation/cosign` | 5 | Co-signed a legal document with another verified human |
| `registered_signature` | 3 | Registered an on-chain signature |

These strands require either economic cost (stops bots — you can't pay for millions of fake signings) or human interaction (a real person co-signed a legal document with you). This makes Lv.3 significantly harder to game than OAuth alone.

### Category 4: Third-Party KYC (Lv.4 — Sovereign)

| Strand Type | Points | What It Proves |
|-------------|--------|----------------|
| `kyc/veriff` | 10 | Biometric passport verification via Veriff |

Lv.4 is the gold standard: a third-party KYC provider (Veriff) biometrically verifies the user's passport. This proves that a specific biological human signed a specific document at a specific time, with the proof inscribed immutably on-chain. This is stronger than a traditional notary because it cannot be backdated, altered, or forged.

---

## Trust Levels

| Level | Label | Gating Requirement | Use Cases |
|-------|-------|--------------------|-----------|
| **Lv.1** | Basic | Any OAuth strand | Browsing, small speculation, social features |
| **Lv.2** | Verified | `self_attestation` OR `id_document/*` OR `CAMERA`/`VIDEO` | Content creation, basic trading |
| **Lv.3** | Strong | `paid_signing` OR `peer_attestation/cosign` | Staking, dividend receipt, legal signing |
| **Lv.4** | Sovereign | `kyc/veriff` | Node operation, equity trading, legal documents, $403 securities |

**Level determination is type-gated, not score-gated.** A user with 50 OAuth strands is still Lv.1. A user with one `paid_signing` strand is Lv.3. This prevents gaming through volume.

### Level Graduation

Levels are **auto-graduated** when qualifying strands are created:

1. User signs a document and pays via HandCash → `paid_signing` strand auto-created → Lv.3
2. User completes a co-sign flow → `peer_attestation/cosign` strand auto-created for both parties → Lv.3
3. User fills self-attestation form (name + address) → `self_attestation` strand created → Lv.2
4. User completes Veriff biometric check → `kyc/veriff` strand created → Lv.4

---

## Identity Strength Score

Beyond the level system, each identity has a numeric **strength score** calculated from strand diversity:

```
score = sum(STRAND_POINTS[strand_type] for each strand)
```

The score provides granularity within levels. Two Lv.3 users may have different scores: one with `paid_signing` (3 pts) + 2 OAuth strands (4 pts) = 7, versus one with `peer_attestation/cosign` (5 pts) + 5 OAuth strands (8 pts) + `self_attestation` (3 pts) = 16.

### Cross-Category Diversity

Strands are classified into categories: `developer`, `social`, `professional`, `email`, `wallet`, `identity`, `economic`. Identity strength considers both count and categorical diversity — an identity verified across multiple independent categories is harder to forge than one concentrated in a single category.

---

## $401/$402 Pairing

$401 identity tokens and $402 payment tokens are designed to be **paired**:

- A **$402 token without a $401** is anonymous spending power — useful but untrusted.
- A **$401 token without a $402** is identity without economic capability — verifiable but inert.
- **Together**, they create an **accountable economic actor** on the network.

This pairing is enforced at the protocol level:
- **Staking** $402 tokens to earn content-serving revenue requires a minimum $401 level.
- **$403 securities** operations require both a $401 identity (for KYC compliance) and $402 tokens (for economic participation).
- **ClawMiner** devices ship with both tokens pre-configured, creating a fully accountable autonomous agent from day one.

| $401 Level | $402 Capability Unlocked |
|------------|-------------------------|
| Lv.1 | Browse paywalled content, small tips |
| Lv.2 | Create content, basic trading |
| Lv.3 | Stake $402 for revenue share, receive dividends |
| Lv.4 | Operate facilitator nodes, equity trading via $403 |

---

## IP Threads (Bit Trust)

$401 tokens serve a dual purpose: beyond identity verification, they function as **intellectual property registration threads**.

### The Thread Model

A single $401 token can accumulate multiple signed attestations over time, each appended as a strand. For an inventor, the thread might look like:

1. Sign an initial concept sketch via bit-sign.online → root inscription mints $401 token
2. Sign a working prototype description one month later → appended to the same $401 thread
3. Sign the final specification → appended to the thread
4. Sign a patent application draft → appended to the thread
5. Sign evidence of first commercial use → appended to the thread

The resulting $401 token is a complete, timestamped, cryptographically verified chain of invention from concept to commercialisation.

### Evidentiary Weight

IP registrations carry different evidentiary weight based on the registrant's trust level:

| $401 Level | IP Registration Strength |
|------------|------------------------|
| Lv.1 | Weak: proves control of an account, not identity |
| Lv.2 | Basic: proves contact details |
| Lv.3 | Strong: proves legal identity of registrant |
| Lv.4 | Maximum: biometric + document proof of inventorship |

A Lv.4 IP registration is stronger than a traditional inventor's notebook because it cannot be backdated, altered, or forged after the fact.

### Bit Trust Vault

**Bit Trust** is the encrypted container that holds a user's complete portfolio of $401 IP threads. It functions as both:

- A **technical structure**: an encrypted, access-controlled container on BSV where all IP registrations are indexed and browsable.
- A **legal structure**: a trust holding intellectual property assets, with the blockchain providing the trust's ledger.

The vault is controlled exclusively by the owner's cryptographic keys. Contents are encrypted and unreadable without authorisation. The owner can selectively reveal individual $401 threads to specific parties (a patent attorney, a potential licensee, a court) without exposing the rest of their IP portfolio. This selective disclosure is managed through per-thread access control keys derived from the owner's master key.

---

## On-Chain Inscription Format

### Root Inscription

```json
{
  "p": "401",
  "op": "root",
  "v": "1.0",
  "handle": "$alice",
  "payloadHash": "<sha256_of_encrypted_bundle>",
  "publicKey": "<user_public_key>",
  "signature": "<signature_of_payload_hash>",
  "symbol": "$ALICE",
  "ts": "<iso8601_timestamp>"
}
```

### Strand Inscription

```json
{
  "p": "401",
  "op": "strand",
  "v": "1.0",
  "root": "<root_inscription_txid>",
  "type": "<strand_type>",
  "subtype": "<strand_subtype_or_null>",
  "provider": "<oauth_provider_or_null>",
  "handle": "<provider_handle>",
  "proofHash": "<sha256_of_proof_material>",
  "label": "<human_readable_label>",
  "metadata": {},
  "ts": "<iso8601_timestamp>"
}
```

### Broadcast Status

Strands progress through inscription states:

| Status | Meaning |
|--------|---------|
| `local` | Created in database, not yet inscribed |
| `pending` | Inscription transaction broadcast to mempool |
| `confirmed` | Transaction confirmed on-chain (1+ confirmations) |
| `failed` | Inscription attempt failed (retryable) |

---

## The Signing Tool: bit-sign.online

**bit-sign.online** is the reference implementation of the $401 signing interface. It provides:

1. **Document sealing**: Upload or create documents, sign with drawn signature + optional HandCash wallet verification.
2. **Identity minting**: Mint $401 root inscriptions from signed identity bundles.
3. **Strand management**: Link OAuth providers, submit self-attestation, view identity strength.
4. **Co-signing**: Two-party document signing that auto-creates `peer_attestation/cosign` strands for both parties.
5. **Envelope signing**: Multi-party document workflows with payment-gated signatures that auto-create `paid_signing` strands.
6. **E2E encryption**: Client-side encryption using ECDH key exchange — the server never sees plaintext documents.

bit-sign.online is the first implementation but not the only one. The $401 inscription format is an open standard; any signing service that produces spec-compliant root inscriptions and strands is a valid $401 implementation.

---

## Integration with $403 (Securities)

$403 security tokens, compliance records, and access grants **require $401 identity** for KYC compliance:

- Minting or transferring $403 security tokens requires a minimum $401 level (typically Lv.3 or Lv.4).
- $403 compliance records reference the holder's $401 identity token, creating an auditable chain from security → identity → KYC proof.
- The $401 identity bridge (`path401d :4011`) provides identity verification to the $403 daemon (`path403d :8403`).

This separation ensures identity is never embedded in security tokens — it is referenced, allowing identity to be upgraded independently of securities holdings.

---

## Infrastructure

### Ports

| Service | Port | Purpose |
|---------|------|---------|
| path401d daemon | 8401 | Identity verification service |
| MCP server | 3401 | AI agent integration |
| Web app (path401.com) | 4010 | Protocol website |
| API server | 4011 | Identity bridge API |

### Data Directory

```
~/.path401d/
├── identity.json       # Local identity cache
├── strands/            # Strand inscription queue
├── keys/               # Encrypted key material
└── config.toml         # Daemon configuration
```

### Database Schema

```sql
CREATE TABLE path401_identity_strands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identity_token_id UUID NOT NULL,
  holder_id UUID NOT NULL,
  provider TEXT NOT NULL,
  provider_user_id TEXT NOT NULL,
  provider_handle TEXT,
  provider_display_name TEXT,
  provider_avatar_url TEXT,
  provider_metadata JSONB DEFAULT '{}',
  proof_hash TEXT NOT NULL,
  inscription_data JSONB,
  strand_txid TEXT,
  broadcast_status TEXT NOT NULL DEFAULT 'local',
  oauth_verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(identity_token_id, provider)
);
```

---

## Security Considerations

### Proof Hash Privacy

OAuth access tokens are **never stored or inscribed**. The `proofHash` is `SHA256(access_token)` — sufficient to prove verification occurred without exposing the token. Even if the on-chain inscription is public, the original OAuth token cannot be derived from the hash.

### CSRF Protection

All OAuth flows use:
- **State parameter**: Random CSRF token stored in httpOnly cookie, validated on callback.
- **PKCE**: Code challenge/verifier for providers that support it (Twitter/X).

### Selective Disclosure

$401 identity data is encrypted by default. The user controls what is revealed and to whom:
- **Public strands**: Provider name and handle are visible (e.g. "GitHub @alice").
- **Private payload**: Passport scans, ID documents, and address details are encrypted and only accessible with the user's keys.
- **Per-thread keys**: Individual IP threads in the Bit Trust vault can be shared with specific parties without exposing other threads.

### Soft Deletion

Strands are soft-deleted (`is_active = false`), not hard-deleted. This maintains the audit trail while allowing users to unlink providers. The on-chain inscription remains permanent.

### Level Anti-Gaming

Trust levels are gated by strand *type*, not strand *count*. This prevents:
- Creating 100 OAuth accounts to reach higher levels.
- Using the same provider multiple times (UNIQUE constraint on `identity_token_id + provider`).
- Bypassing economic barriers (paid_signing requires real money; peer_attestation requires a real counterparty).

---

## Reference Implementations

| Component | Implementation | Role |
|-----------|---------------|------|
| **Signing Tool** | bit-sign.online | Create identity bundles, manage strands, co-sign |
| **Protocol Site** | path401.com | OAuth strands, 3D identity tree, documentation |
| **Identity Bridge** | path401d | Daemon providing identity verification to $402/$403 |
| **Hardware** | ClawMiner (b0-x.com) | Ships with pre-configured $401 + $402 tokens |

---

## BCorp Mint Integration

The $401 identity system integrates with the Bitcoin Corporation (BCorp) token minting infrastructure:

- **$401 root inscriptions** are minted through BCorp's inscription engine.
- **Identity verification levels** gate access to BCorp mint operations (higher levels required for security token minting via $403).
- **bit-sign.online** serves as the universal signing interface for BCorp — all document signing, identity verification, and IP registration flows through the same tool.

---

*This standard is part of the $4xx protocol trilogy by The Bitcoin Corporation Ltd.*
*$401 (Identity) | $402 (Payment) | $403 (Securities)*

*Last updated: February 2026*
