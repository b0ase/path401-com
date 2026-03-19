# $401 Federated Signing Protocol (FSP)

**Version:** 1.0.0
**Date:** 2026-02-27
**Author:** Richard Boase (b0ase.com)
**Status:** Draft
**Companion Specs:** [$401 Standard](/$401-STANDARD.md) | [$401 Identity Spec](/app/401/spec.md)

---

## Abstract

The Federated Signing Protocol (FSP) extends the $401 identity standard to enable **cross-platform document signing interoperability**. Any platform that implements FSP can create, co-sign, counter-sign, and verify documents originating from any other FSP-compatible service.

The first two peers are **bit-sign.online** (the reference $401 signing tool) and **agreemint.com**. The protocol is designed so that additional services can join without permission from existing peers — registration is on-chain and discovery is automatic.

**Design principles:**
- No central authority — all services are equal peers
- Document content never crosses service boundaries — only hashes are transmitted
- Identity is resolved on-chain via $401 — no trust required between services
- Inscription format extends (does not break) existing bit-sign operations

---

## 1. Definitions & Scope

| Term | Definition |
|------|-----------|
| **Service** | A platform implementing the FSP (e.g. bit-sign.online, agreemint.com). |
| **Envelope** | A signable document container with an ordered list of signatories. |
| **Endorsement** | A cryptographic signature on an envelope by one signatory. |
| **Seal** | Final state — all required endorsements collected, summary hash inscribed on-chain. |
| **Service Pair** | Two services that have exchanged HMAC keys and can communicate via the FSP REST API. |
| **Canonical Hash** | SHA-256 of a deterministically serialised envelope (see Section 4). |

### Scope

FSP covers **document signing interoperability only**:
- Cross-service envelope creation, signing, and verification
- Shared on-chain inscription format for indexer compatibility
- Identity bridging via $401 root txids
- Webhook notification of signing events

FSP does **not** cover:
- Identity issuance — that remains with the $401 core protocol
- Document storage or transfer — only hashes cross service boundaries
- Payment processing — each service handles its own payment flows
- Key management — each service manages its own signing infrastructure

---

## 2. Service Registration

### 2.1 On-Chain Registration

A service announces itself by inscribing a `service` operation on BSV:

```json
{
  "p": "401",
  "op": "service",
  "v": "1.0",
  "serviceId": "agreemint.com",
  "name": "Agreemint",
  "endpoint": "https://agreemint.com/.well-known/bit-sign.json",
  "capabilities": ["sign", "verify", "seal"],
  "registeredBy": "<BSV address of service operator>",
  "ts": "2026-02-27T00:00:00Z"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `p` | string | Yes | Protocol identifier. Always `"401"`. |
| `op` | string | Yes | Always `"service"`. |
| `v` | string | Yes | Spec version. Currently `"1.0"`. |
| `serviceId` | string | Yes | Unique service identifier (typically the domain). |
| `name` | string | Yes | Human-readable service name. |
| `endpoint` | URL | Yes | URL to the service's `.well-known/bit-sign.json` discovery file. |
| `capabilities` | string[] | Yes | Supported operations: `"sign"`, `"verify"`, `"seal"`. |
| `registeredBy` | string | Yes | BSV address of the service operator. |
| `ts` | ISO 8601 | Yes | Registration timestamp. |

The inscription uses the standard $401 OP_RETURN format: `<"401"> <"application/json"> <json_payload>`.

### 2.2 Discovery File

Each service hosts a discovery file at `/.well-known/bit-sign.json`:

```json
{
  "serviceId": "agreemint.com",
  "name": "Agreemint",
  "version": "1.0",
  "publicKey": "<service secp256k1 compressed public key>",
  "algorithms": ["ECDSA-secp256k1-SHA256"],
  "webhookUrl": "https://agreemint.com/api/fsp/webhook",
  "apiBase": "https://agreemint.com/api/fsp",
  "registrationTxid": "<txid of on-chain service inscription>",
  "capabilities": ["sign", "verify", "seal"],
  "contact": "admin@agreemint.com"
}
```

Any service can discover a peer by fetching its `.well-known/bit-sign.json`. The `registrationTxid` allows verification that the discovery file matches an on-chain registration.

### 2.3 Service Update

A service updates its registration by inscribing a new `service` operation referencing the original:

```json
{
  "p": "401",
  "op": "service",
  "v": "1.0",
  "ref": "<txid of original service inscription>",
  "serviceId": "agreemint.com",
  "endpoint": "https://agreemint.com/.well-known/bit-sign.json",
  "capabilities": ["sign", "verify", "seal", "notarise"],
  "ts": "2026-06-01T00:00:00Z"
}
```

The latest `service` inscription for a given `serviceId` takes precedence. The `ref` field creates an auditable history chain.

---

## 3. Shared Inscription Format

FSP introduces two new inscription operations that extend the existing $401 format. Both use `p: "401"` to ensure any $401 indexer can parse them.

### 3.1 Endorsement Inscription (`op: "sign"`)

Inscribed when a signatory endorses an envelope:

```json
{
  "p": "401",
  "op": "sign",
  "v": "1.0",
  "envelopeHash": "<SHA-256 of canonical envelope JSON>",
  "signatoryIndex": 2,
  "signatoryAddress": "<BSV address of signer>",
  "signatoryIdentity": "<$401 root txid, if available>",
  "signature": "<ECDSA signature of envelopeHash by signatoryAddress>",
  "service": "agreemint.com",
  "ts": "2026-02-27T12:30:00Z"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `envelopeHash` | hex string | Yes | SHA-256 of the canonical envelope (see Section 4). |
| `signatoryIndex` | integer | Yes | Zero-based position in the envelope's signatory list. |
| `signatoryAddress` | string | Yes | BSV address of the signing party. |
| `signatoryIdentity` | string | No | $401 root inscription txid for identity resolution. |
| `signature` | hex string | Yes | ECDSA signature of the `envelopeHash` using the signatory's private key. |
| `service` | string | Yes | `serviceId` of the platform where this endorsement was created. |

### 3.2 Seal Inscription (`op: "seal"`)

Inscribed when all required endorsements have been collected:

```json
{
  "p": "401",
  "op": "seal",
  "v": "1.0",
  "envelopeHash": "<SHA-256 of canonical envelope JSON>",
  "documentHash": "<SHA-256 of the original source document>",
  "signatories": [
    "<address_0>",
    "<address_1>",
    "<address_2>"
  ],
  "signatures": [
    "<sig_0>",
    "<sig_1>",
    "<sig_2>"
  ],
  "signTxids": [
    "<txid of op:sign for index 0>",
    "<txid of op:sign for index 1>",
    "<txid of op:sign for index 2>"
  ],
  "service": "bit-sign.online",
  "ts": "2026-02-27T14:00:00Z"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `envelopeHash` | hex string | Yes | SHA-256 of the canonical envelope. Must match all `op: "sign"` inscriptions. |
| `documentHash` | hex string | Yes | SHA-256 of the original source document (PDF, image, etc.). |
| `signatories` | string[] | Yes | Ordered array of BSV addresses, matching envelope signatory order. |
| `signatures` | string[] | Yes | Ordered array of ECDSA signatures, one per signatory. |
| `signTxids` | string[] | No | Ordered array of individual `op: "sign"` inscription txids. |
| `service` | string | Yes | `serviceId` of the platform that produced the seal. |

### 3.3 Compatibility with Existing Inscriptions

The existing bit-sign inscription format (`protocol: "b0ase-bitsign"`) remains valid for single-service operations. FSP inscriptions use the `p: "401"` canonical format to ensure all $401-aware indexers can parse them without additional logic.

Indexers differentiate inscription types by the `op` field:

| `op` value | Origin | Purpose |
|------------|--------|---------|
| `root` | $401 core | Identity root inscription |
| `strand` | $401 core | Identity strand (OAuth, attestation, etc.) |
| `mint` | $401 spec v0.2 | Identity token with economic params |
| `service` | FSP | Service registration |
| `sign` | FSP | Individual endorsement |
| `seal` | FSP | Completed envelope seal |

---

## 4. Canonical Envelope Format

For cross-service hash consistency, both platforms must produce **identical JSON** for the same logical envelope. The canonical envelope format is:

```json
{
  "documentHash": "<SHA-256 of the source document>",
  "title": "Partnership Agreement",
  "description": "Operating agreement between Alice and Bob",
  "signatories": [
    {
      "address": "<BSV address>",
      "name": "Alice Smith",
      "role": "Party A",
      "identityRoot": "<$401 root txid or null>"
    },
    {
      "address": "<BSV address>",
      "name": "Bob Jones",
      "role": "Party B",
      "identityRoot": "<$401 root txid or null>"
    }
  ],
  "createdAt": "2026-02-27T10:00:00Z",
  "createdByService": "bit-sign.online"
}
```

### 4.1 Canonicalization Rules

To ensure identical hashes across implementations:

1. **Key ordering**: All JSON object keys are sorted lexicographically (Unicode code point order).
2. **No whitespace**: Serialised with no spaces or newlines (`JSON.stringify(obj)` with sorted keys, no indentation).
3. **UTF-8 normalisation**: All string values are NFC-normalised before serialisation.
4. **Null handling**: Null-valued fields are **included** as `"field": null` (not omitted).
5. **Timestamp format**: ISO 8601 with UTC timezone designator `Z`, milliseconds omitted.
6. **Hash encoding**: All hashes are lowercase hexadecimal.

### 4.2 Envelope Hash Calculation

```
envelopeHash = SHA-256( canonicalise(envelope) )
```

Where `canonicalise()` applies all rules from Section 4.1. Both services must independently compute the same `envelopeHash` for the same logical envelope.

### 4.3 Signatory Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `address` | string | Yes | BSV address of the signatory. |
| `name` | string | Yes | Display name of the signatory. |
| `role` | string | Yes | Role in the document (e.g. "Party A", "Witness", "Notary"). |
| `identityRoot` | string | No | $401 root inscription txid. Null if the signatory has no $401 identity. |

---

## 5. Cross-Platform Verification

Any service (or any third party with blockchain access) can verify an FSP signing by following this procedure:

### 5.1 Verifying an Individual Endorsement (`op: "sign"`)

1. Fetch the on-chain inscription by txid.
2. Parse the OP_RETURN data as JSON. Confirm `p === "401"` and `op === "sign"`.
3. Recover the signer's public key from the `signature` field using ECDSA recovery on `envelopeHash`.
4. Derive the BSV address from the recovered public key.
5. Confirm the derived address matches `signatoryAddress`.
6. If `signatoryIdentity` is present, resolve the $401 root inscription on-chain:
   - Verify the root inscription exists and is not revoked.
   - Resolve associated strands to determine identity strength level.
   - Confirm the root's `payTo` or `publicKey` is associated with `signatoryAddress`.

### 5.2 Verifying a Seal (`op: "seal"`)

1. Fetch the seal inscription by txid.
2. Confirm `signatories.length === signatures.length`.
3. For each index `i`, verify `signatures[i]` against `envelopeHash` recovers to `signatories[i]`.
4. If `signTxids` is present, verify each individual `op: "sign"` inscription exists on-chain and matches.
5. Confirm `signatoryIndex` values from individual sign inscriptions are sequential (0, 1, 2, ...) matching the envelope's signatory order.

### 5.3 Verifying Signing Order

bit-sign.online enforces **sequential signing** — signatory at index `n` cannot sign until all signatories at indices `0..n-1` have signed. FSP preserves this constraint:

- Each `op: "sign"` inscription includes `signatoryIndex`.
- The `ts` field of inscription at index `n` must be later than the `ts` of inscription at index `n-1`.
- Indexers can reconstruct the full signing timeline from individual inscriptions.

---

## 6. Identity Bridging

### 6.1 $401 as the Shared Identity Layer

Users authenticate across FSP services using their $401 identity chain. A user who has a $401 root inscription and strands on bit-sign.online does **not** need to re-register on Agreemint:

1. User presents their `$401 root txid` to Agreemint.
2. Agreemint fetches the root inscription on-chain and verifies it exists.
3. Agreemint resolves all strand inscriptions referencing that root.
4. Agreemint calculates the identity strength level using the standard scoring:

| Level | Label | Gating Strand Types |
|-------|-------|---------------------|
| Lv.1 | Basic | Any OAuth strand (`oauth/github`, `oauth/google`, etc.) |
| Lv.2 | Verified | `self_attestation`, `CAMERA`, `VIDEO`, `id_document/*` |
| Lv.3 | Strong | `paid_signing`, `peer_attestation/cosign` |
| Lv.4 | Sovereign | `kyc/veriff` |

Level determination is **type-gated, not score-gated** — 50 OAuth strands still equals Lv.1.

### 6.2 Service Strand

When a user first signs a document on a new FSP service, that service may create a new strand type linking the user's $401 identity to the service:

```json
{
  "p": "401",
  "op": "strand",
  "v": "1.0",
  "root": "<user's $401 root txid>",
  "type": "service_attestation",
  "provider": "agreemint",
  "handle": "<user's handle on agreemint>",
  "proofHash": "<SHA-256 of first signing action>",
  "label": "Agreemint account linked",
  "ts": "2026-03-01T09:00:00Z"
}
```

This strand type is `service_attestation` with the provider set to the service's `serviceId`. It carries 1 point and does not affect the user's trust level (it's informational — proving the user has signed on multiple platforms).

### 6.3 Identity Resolution Flow

```
User on Agreemint presents $401 root txid
        │
        ▼
Agreemint fetches root inscription on-chain
        │
        ▼
Agreemint fetches all strands referencing root
        │
        ▼
Calculate strength: level + score + strand list
        │
        ▼
User is authenticated with their existing identity
(no new account needed, no OAuth re-flow)
```

The chain IS the identity. No trust is placed in the originating service.

---

## 7. Envelope Exchange Protocol (REST API)

### 7.1 Endpoints

Every FSP-compatible service exposes the following minimal API surface:

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/fsp/envelope/:hash` | Retrieve envelope metadata and current signature status |
| `POST` | `/api/fsp/envelope` | Create or import an envelope from a peer service |
| `POST` | `/api/fsp/envelope/:hash/sign` | Submit an endorsement signature |
| `GET` | `/api/fsp/verify/:txid` | Verify an on-chain inscription and return parsed data |

### 7.2 Authentication

Inter-service requests are authenticated with **HMAC-SHA256**:

```
X-FSP-Service: bit-sign.online
X-FSP-Timestamp: 1709035200
X-FSP-Nonce: <random 32-byte hex>
X-FSP-Signature: HMAC-SHA256(secret, method + path + timestamp + nonce + bodyHash)
```

| Header | Description |
|--------|-------------|
| `X-FSP-Service` | The calling service's `serviceId`. |
| `X-FSP-Timestamp` | Unix timestamp (seconds). Request rejected if older than 300 seconds. |
| `X-FSP-Nonce` | Random 32-byte hex string. Deduplicated for 300 seconds to prevent replay. |
| `X-FSP-Signature` | HMAC-SHA256 of `METHOD + PATH + TIMESTAMP + NONCE + SHA256(BODY)` using the pre-shared secret. |

The HMAC secret is exchanged out-of-band when establishing a service pair. Secrets should be rotated at least every 90 days.

### 7.3 Request/Response Format

**GET /api/fsp/envelope/:hash**

```json
// Response 200
{
  "envelopeHash": "<hash>",
  "title": "Partnership Agreement",
  "documentHash": "<hash>",
  "signatories": [
    {
      "address": "<addr>",
      "name": "Alice",
      "role": "Party A",
      "identityRoot": "<txid>",
      "status": "signed",
      "signTxid": "<txid>",
      "signedAt": "2026-02-27T12:30:00Z"
    },
    {
      "address": "<addr>",
      "name": "Bob",
      "role": "Party B",
      "identityRoot": null,
      "status": "pending",
      "signTxid": null,
      "signedAt": null
    }
  ],
  "status": "partially_signed",
  "sealTxid": null,
  "createdAt": "2026-02-27T10:00:00Z",
  "createdByService": "bit-sign.online"
}
```

**POST /api/fsp/envelope**

```json
// Request body
{
  "envelope": { /* canonical envelope object (Section 4) */ },
  "envelopeHash": "<SHA-256 of canonical envelope>",
  "documentHash": "<SHA-256 of source document>"
}

// Response 201
{
  "accepted": true,
  "envelopeHash": "<hash>",
  "localId": "<service-internal envelope ID>"
}
```

**POST /api/fsp/envelope/:hash/sign**

```json
// Request body
{
  "signatoryIndex": 1,
  "signatoryAddress": "<BSV address>",
  "signature": "<ECDSA signature of envelopeHash>",
  "signTxid": "<txid of on-chain op:sign inscription, if already inscribed>"
}

// Response 200
{
  "accepted": true,
  "allSigned": false,
  "status": "partially_signed"
}
```

---

## 8. Webhook Protocol

### 8.1 Events

Services notify peers of signing lifecycle events via webhooks:

| Event | Trigger | Payload Includes |
|-------|---------|------------------|
| `envelope.created` | New envelope with signatories on a peer service | Canonical envelope, signatory list |
| `envelope.signed` | A signatory endorses | Envelope hash, signatory index, signature, sign txid |
| `envelope.sealed` | All endorsements collected | Envelope hash, seal txid, all signatures |
| `envelope.inscribed` | On-chain inscription confirmed (1+ block) | Inscription txid, block height |
| `identity.verified` | $401 identity resolved for a signatory | Root txid, strength level, strand count |

### 8.2 Delivery

```json
// POST to peer's webhookUrl
{
  "event": "envelope.signed",
  "service": "bit-sign.online",
  "timestamp": "2026-02-27T12:30:00Z",
  "data": {
    "envelopeHash": "<hash>",
    "signatoryIndex": 0,
    "signatoryAddress": "<address>",
    "signTxid": "<txid>"
  }
}
```

**Delivery guarantees:**
- **At-least-once semantics**: Receivers must be idempotent on `(event, envelopeHash, signatoryIndex)`.
- **HMAC-signed body**: Same `X-FSP-Signature` scheme as REST API (Section 7.2).
- **Retry with exponential backoff**: 1s, 5s, 30s, 5m, 30m, 2h, 12h — then dead-letter.
- **Timeout**: Webhook delivery attempts timeout after 10 seconds.
- **Response**: 2xx = acknowledged. 4xx = do not retry. 5xx = retry with backoff.

### 8.3 Event Filtering

Services may specify which events they want to receive during service pair establishment. By default, all events are delivered.

---

## 9. Security Considerations

### 9.1 Document Privacy

**Document content never leaves the originating service.** Only the following cross service boundaries:
- `documentHash` — SHA-256 of the source document
- `envelopeHash` — SHA-256 of the canonical envelope metadata
- Signatory names, addresses, and roles (as specified in the envelope)

The actual document (PDF, image, contract text) is stored and rendered only by the service where it was uploaded. Peer services work exclusively with hashes.

### 9.2 Inter-Service Authentication

- **HMAC-SHA256** with pre-shared secrets exchanged out-of-band.
- **Key rotation**: Secrets must be rotated at least every 90 days. Both old and new keys are accepted during a 24-hour transition window.
- **Nonce deduplication**: Each service maintains a nonce cache with 300-second TTL. Duplicate nonces are rejected.
- **Timestamp validation**: Requests older than 300 seconds (5 minutes) are rejected.

### 9.3 On-Chain Verification

$401 identity verification is trustless — it requires only blockchain access, not cooperation from the originating service:
- Root inscriptions are permanent and publicly auditable.
- Strand inscriptions reference their root by txid, forming a verifiable chain.
- Seal inscriptions contain all signatures, allowing full verification from a single txid.
- Revoked identities (`op: "revoke"`) are detected by checking the revocation chain.

### 9.4 Rate Limiting

- **100 requests per minute** per service pair (REST API).
- **50 webhook deliveries per minute** per service pair.
- Services exceeding limits receive HTTP 429 with a `Retry-After` header.

### 9.5 Threat Model

| Threat | Mitigation |
|--------|-----------|
| Forged endorsement | ECDSA signature verification against `signatoryAddress`; on-chain inscription is immutable |
| Replay attack | Nonce + timestamp validation on all inter-service requests |
| Man-in-the-middle | HTTPS required for all endpoints; HMAC prevents tampering |
| Rogue service | On-chain `op: "service"` registration creates public audit trail; services can be blocklisted |
| Identity spoofing | $401 root txid verification is on-chain — no service can forge another user's identity chain |
| Hash collision | SHA-256 pre-image resistance; envelopes include multiple independent hashes (document + envelope) |

---

## Appendix A: Example Flow

**Scenario:** Alice creates an envelope on bit-sign.online. Bob, who uses Agreemint, needs to co-sign.

```
1. Alice creates envelope on bit-sign.online
   → Envelope canonical hash computed
   → bit-sign sends webhook `envelope.created` to Agreemint

2. Agreemint receives webhook
   → Imports envelope via POST /api/fsp/envelope
   → Resolves Bob's $401 identity from root txid
   → Notifies Bob he has a document to sign

3. Alice signs on bit-sign.online (signatoryIndex: 0)
   → Individual `op: "sign"` inscribed on-chain
   → bit-sign sends webhook `envelope.signed` to Agreemint

4. Bob signs on Agreemint (signatoryIndex: 1)
   → Agreemint verifies Alice signed first (sequential order)
   → Individual `op: "sign"` inscribed on-chain
   → Agreemint sends webhook `envelope.signed` to bit-sign
   → Agreemint sends webhook `envelope.sealed` to bit-sign

5. Originating service (bit-sign) inscribes the seal
   → `op: "seal"` inscribed with all signatures and sign txids
   → bit-sign sends webhook `envelope.inscribed` to Agreemint

6. Both services display the completed envelope with on-chain proof
   → Any third party can verify via the seal txid alone
```

---

## Appendix B: Existing Format Compatibility

FSP inscriptions coexist with the legacy `b0ase-bitsign` format:

| Format | Protocol Field | Used For |
|--------|---------------|----------|
| Legacy | `"protocol": "b0ase-bitsign"` | Single-service signing (signature registration, document signing, envelope signing) |
| $401 Canonical | `"p": "401"` | Identity operations (root, strand, mint, update, rotate, revoke) |
| FSP | `"p": "401"` | Federated operations (service, sign, seal) |

FSP uses the `p: "401"` canonical format because federated signing is an extension of the $401 identity protocol. Indexers that already parse $401 inscriptions will automatically encounter FSP operations and can handle them by the `op` field.

The `parseInscription()` function in existing bit-sign code already handles both formats. FSP operations will be recognised by `p === "401"` and routed by `op`.

---

## Appendix C: Service Pair Establishment

Establishing a service pair is a manual, out-of-band process:

1. Service A fetches Service B's `/.well-known/bit-sign.json`.
2. Service A verifies Service B's `registrationTxid` exists on-chain.
3. Operators exchange HMAC secrets via a secure channel (not defined by this spec).
4. Both services configure their webhook URLs and API base paths.
5. Both services send a test `envelope.created` webhook to confirm connectivity.

Automated service discovery (e.g. via $401 gossip layer) is a future extension.

---

## References

- [$401 Standard](/docs/$401-STANDARD.md) — The $401 identity protocol
- [$401 Identity Spec](/app/401/spec.md) — Full $401 specification (v0.2.0)
- [bit-sign inscription format](https://github.com/b0ase/bit-sign) — Existing `b0ase-bitsign` inscription code
- [BRC-52: Identity Certificates](https://github.com/bitcoin-sv/BRCs/blob/master/wallet/0052.md) — Selective field revelation
- [BAP: Bitcoin Attestation Protocol](https://github.com/icellan/bap) — URN attribute naming

---

*The Federated Signing Protocol is part of the $401 identity ecosystem. This spec is maintained at [path401.com](https://path401.com).*
*$401 (Identity) | $402 (Payment) | $403 (Securities)*

*Last updated: February 2026*
