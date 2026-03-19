# Veriff KYC Integration for $401 Protocol

## Overview

Veriff KYC integration enables **Level 4 (Sovereign) identity verification** on the $401 protocol. When a user completes Veriff verification, a `kyc/veriff` strand is automatically created on their identity token.

**Identity Level Gating:**
- **Level 1**: OAuth strands only (botnets possible)
- **Level 2**: Self-attestation, camera/video, ID documents
- **Level 3**: Paid signing, peer attestation (costs money or real counterparty)
- **Level 4**: Veriff KYC + biometric verification (sovereign identity)

## Architecture

### Components

| Component | Location | Purpose |
|-----------|----------|---------|
| Migration | `database/migrations/024_kyc_sessions.sql` | Stores `path401_kyc_sessions` table |
| Start Endpoint | `app/api/auth/kyc/veriff/start/route.ts` | Initiates Veriff session |
| Webhook Endpoint | `app/api/auth/kyc/veriff/webhook/route.ts` | Receives decision, creates strand |
| Status Endpoint | `app/api/auth/kyc/veriff/status/[identityTokenId]/route.ts` | Poll for verification status |
| Client Library | `lib/kyc-veriff.ts` | Frontend integration utilities |
| React Component | `components/KycVeriffButton.tsx` | "Verify with Veriff" button UI |

### Database Schema

```sql
path401_kyc_sessions
├── id (UUID primary key)
├── identity_token_id (FK → path402_identity_tokens)
├── holder_id (FK → path402_holders)
├── veriff_session_id (TEXT unique) ← Veriff assigns this
├── status (TEXT) ← pending | approved | declined | expired
├── veriff_response (JSONB) ← Full Veriff API response
├── decision_payload (JSONB) ← Scrubbed decision data
├── strand_id (FK → path401_identity_strands) ← Created on approval
├── created_at, updated_at
```

On approval, a strand record is created in `path401_identity_strands`:
```json
{
  "identity_token_id": "...",
  "provider": "kyc",
  "handle": "veriff",
  "proof_hash": "<random>",
  "is_active": true,
  "broadcast_status": "pending_inscription",
  "metadata": {
    "provider_id": "<veriff_session_id>",
    "first_name": "...",
    "last_name": "...",
    "document_type": "PASSPORT",
    "document_country": "US"
  }
}
```

## Flow Diagram

```
User → /identity page
       ↓
  [Verify with Veriff button]
       ↓
POST /api/auth/kyc/veriff/start
       ↓
Create path401_kyc_sessions record (status: pending)
       ↓
Call Veriff API → Get verification_url + session_id
       ↓
Redirect user to verification_url (Veriff platform)
       ↓
User completes identity verification (biometric, document, etc.)
       ↓
Veriff POSTs webhook → /api/auth/kyc/veriff/webhook
       ↓
HMAC verification + update path401_kyc_sessions (status: approved/declined)
       ↓
IF approved:
  ├─ Create kyc/veriff strand in path401_identity_strands
  ├─ Update strand_id in path401_kyc_sessions
  └─ Attempt on-chain inscription
       ↓
User redirected back, identity now has Lv.4 status
```

## Configuration

### Environment Variables

```bash
# Veriff API credentials (sign up at https://www.veriff.com)
VERIFF_API_KEY=<your-api-key>
VERIFF_WEBHOOK_SECRET=<webhook-signing-secret>
VERIFF_CALLBACK_URL=https://path401.com/api/auth/kyc/veriff/webhook

# Required for inscription (already in .env)
TREASURY_ADDRESS=<bsv-address>
TREASURY_PRIVATE_KEY=<wif-key>
NEXT_PUBLIC_APP_URL=https://path401.com  # Production URL
```

### Veriff Setup

1. Create account at https://www.veriff.com
2. Create API integration in dashboard
3. Set webhook URL: `https://path401.com/api/auth/kyc/veriff/webhook`
4. Copy API key and webhook secret to `.env.local`

## API Endpoints

### POST /api/auth/kyc/veriff/start

Initiates a KYC verification session.

**Request:**
```json
{
  "identity_token_id": "uuid-of-identity-token"
}
```

**Response (Success):**
```json
{
  "success": true,
  "verification_url": "https://stationapi.veriff.com/v1/sessions/<sessionId>",
  "session_id": "veriff-session-id",
  "message": "Redirecting to Veriff for identity verification..."
}
```

**Response (Error):**
```json
{
  "error": "Identity token not found",
  "details": "optional-details"
}
```

**Status Codes:**
- `200` — Session created, redirect user to `verification_url`
- `400` — Missing required parameters
- `404` — Identity token not found
- `409` — KYC already pending/approved for this identity
- `503` — Veriff service not configured or unreachable
- `500` — Unexpected server error

### GET /api/auth/kyc/veriff/status/[identityTokenId]

Check the status of a KYC verification session.

**Response (Pending):**
```json
{
  "status": "pending",
  "session_id": "uuid",
  "strand_id": null,
  "strand_verified": false,
  "created_at": "2026-03-19T12:00:00Z",
  "updated_at": "2026-03-19T12:00:00Z"
}
```

**Response (Approved):**
```json
{
  "status": "approved",
  "session_id": "uuid",
  "strand_id": "uuid-of-created-strand",
  "strand_verified": true,
  "decision_payload": {
    "status": "approved",
    "person": {
      "firstName": "Alice",
      "lastName": "Smith",
      "dateOfBirth": "1990-01-15"
    },
    "document": {
      "type": "PASSPORT",
      "country": "US",
      "numberSuffix": "1234"
    },
    "decisionTime": "2026-03-19T12:05:00Z"
  }
}
```

### POST /api/auth/kyc/veriff/webhook

Receives Veriff decision webhooks. **Requires HMAC signature validation.**

**Webhook Payload (from Veriff):**
```json
{
  "verification": {
    "id": "session-id",
    "url": "https://stationapi.veriff.com/v1/sessions/...",
    "status": "approved", // or "declined"
    "person": {
      "firstName": "Alice",
      "lastName": "Smith",
      "dateOfBirth": "1990-01-15"
    },
    "document": {
      "type": "PASSPORT",
      "country": "US",
      "number": "A1234567890"
    }
  }
}
```

## Client Integration

### Using the Veriff Button Component

```tsx
import KycVeriffButton from '@/components/KycVeriffButton';

export default function IdentityPage() {
  const identityTokenId = '...'; // From useAuth or props
  const kycStatus = 'unverified'; // or 'pending', 'approved', 'declined'

  return (
    <div>
      <h2>Verify Your Identity (Level 4)</h2>
      <KycVeriffButton
        identityTokenId={identityTokenId}
        kycStatus={kycStatus}
      />
    </div>
  );
}
```

### Manual API Calls

```typescript
import { startKycSession, checkKycSessionStatus } from '@/lib/kyc-veriff';

// Initiate KYC
const result = await startKycSession(identityTokenId);
if (result.success) {
  // User is redirected to Veriff
  console.log('Redirecting to:', result.verification_url);
} else {
  console.error('KYC failed:', result.error);
}

// Check status (after user returns from Veriff)
const status = await checkKycSessionStatus(identityTokenId);
console.log('Status:', status.status); // 'approved', 'declined', etc.
```

## Security

### HMAC Signature Verification

The webhook endpoint validates all Veriff webhooks using HMAC-SHA256:

```
signature = HMAC-SHA256(webhook_body, VERIFF_WEBHOOK_SECRET)
```

The header `X-HMAC-SIGNATURE` must match. Invalid signatures are rejected with 401.

### Sensitive Data Handling

- **OAuth tokens**: Never stored. Hashed immediately, plaintext discarded.
- **Decision payload**: Scrubbed before storage. Only safe fields retained:
  - Person: firstName, lastName, dateOfBirth
  - Document: type, country, numberSuffix (last 4 digits only)
  - Full number, SSN, etc. never stored

### Treasury Keys

- `TREASURY_ADDRESS` and `TREASURY_PRIVATE_KEY` are environment variables only
- Never hardcoded or logged
- Used only for on-chain inscription (optional, falls back to local strand)

## Troubleshooting

### "KYC service not configured"
- Ensure `VERIFF_API_KEY` is set in `.env.local`
- Restart Next.js dev server

### "KYC verification already in progress"
- User already has a pending/approved session
- Clear the session from database if needed (development only)

### "HMAC mismatch"
- Webhook signature validation failed
- Verify `VERIFF_WEBHOOK_SECRET` matches Veriff dashboard
- Check raw request body hasn't been modified

### Inscription Pending But Not Confirmed
- On-chain inscription is optional; strand is created locally first
- Inscription retry logic can be added to a background job
- Check `broadcast_status` in `path401_identity_strands`

## Future Enhancements

1. **Background job**: Retry failed inscriptions using a cron service
2. **Email notifications**: Send KYC approved/declined emails (like KWEGWONG)
3. **Re-verification**: Allow users to re-verify after `declined` status
4. **Liveness checks**: Use Veriff's liveness module for fraud detection
5. **Webhook replay**: Add idempotency to prevent double-approvals
6. **Audit log**: Track all KYC decisions in audit table for compliance

## References

- **Veriff API Docs**: https://developers.veriff.com
- **KWEGWONG Integration**: `/Volumes/2026/Projects/kwegwong/src/app/api/staking/kyc/veriff/`
- **$401 Spec**: `docs/$401-STANDARD.md`
- **Strand Specification**: `lib/strand-store.ts`
