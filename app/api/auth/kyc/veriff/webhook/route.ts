/**
 * POST /api/auth/kyc/veriff/webhook
 * Receives Veriff decision webhook
 * Creates kyc/veriff strand on approval (gates Level 4 identity)
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateVeriffHmac, scrubVeriffDecision } from '@/lib/kyc-veriff';
import { randomBytes } from 'crypto';
import { supabase } from '@/lib/supabase';

const VERIFF_WEBHOOK_SECRET = process.env.VERIFF_WEBHOOK_SECRET || '';
const TREASURY_ADDRESS = process.env.TREASURY_ADDRESS || '';
const TREASURY_PRIVATE_KEY = process.env.TREASURY_PRIVATE_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();

    // Verify HMAC signature
    if (VERIFF_WEBHOOK_SECRET) {
      const signature = request.headers.get('x-hmac-signature') || '';
      if (!validateVeriffHmac(rawBody, signature, VERIFF_WEBHOOK_SECRET)) {
        console.error('[kyc-veriff-webhook] HMAC mismatch');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    const verification = payload.verification;

    if (!verification?.id || !verification?.status) {
      console.warn('[kyc-veriff-webhook] Missing verification data');
      return NextResponse.json({ ok: true });
    }

    const sessionId = verification.id;
    const status = verification.status;

    console.log(`[kyc-veriff-webhook] Decision: session=${sessionId} status=${status}`);

    if (!supabase) {
      console.error('[kyc-veriff-webhook] Database not configured');
      return NextResponse.json({ ok: true });
    }

    // Look up our session record
    const { data: session, error: sessionError } = await supabase
      .from('path401_kyc_sessions')
      .select('id, identity_token_id, holder_id, status')
      .eq('veriff_session_id', sessionId)
      .maybeSingle();

    if (sessionError || !session) {
      console.warn(`[kyc-veriff-webhook] Unknown session: ${sessionId}`);
      return NextResponse.json({ ok: true });
    }

    // Already processed
    if (session.status === 'approved') {
      return NextResponse.json({ ok: true });
    }

    // Scrub sensitive data using @b0ase/bit-sign utility
    const safePayload = scrubVeriffDecision(payload);

    // Update session with decision
    await supabase
      .from('path401_kyc_sessions')
      .update({
        status,
        decision_payload: safePayload,
        updated_at: new Date().toISOString(),
      })
      .eq('id', session.id);

    if (status === 'approved') {
      // Create kyc/veriff strand for this identity
      const strandData = {
        identity_token_id: session.identity_token_id,
        provider: 'kyc',
        handle: 'veriff',
        proof_hash: randomBytes(32).toString('hex'), // Placeholder for KYC provider
        is_active: true,
        broadcast_status: 'pending_inscription' as const,
        metadata: {
          provider_id: sessionId,
          first_name: safePayload.person?.firstName,
          last_name: safePayload.person?.lastName,
          document_type: safePayload.document?.type,
          document_country: safePayload.document?.country,
        },
      };

      const { data: strand, error: strandError } = await supabase
        .from('path401_identity_strands')
        .insert(strandData)
        .select('id')
        .maybeSingle();

      if (strandError || !strand) {
        console.error('[kyc-veriff-webhook] Failed to create strand:', strandError);
      } else {
        console.log(
          `[kyc-veriff-webhook] Created kyc/veriff strand ${strand.id} for identity ${session.identity_token_id}`
        );

        // Update session with strand reference
        await supabase
          .from('path401_kyc_sessions')
          .update({ strand_id: strand.id })
          .eq('id', session.id);

        // Attempt to inscribe strand on-chain
        try {
          await inscribeStrand(strand.id, session.identity_token_id, strandData);
        } catch (inscribeError) {
          const msg = inscribeError instanceof Error ? inscribeError.message : 'Unknown error';
          console.error('[kyc-veriff-webhook] Inscription failed (will retry):', msg);
          // Strand is stored locally; inscription can be retried later
        }
      }
    } else if (status === 'declined') {
      console.log(`[kyc-veriff-webhook] KYC declined for identity ${session.identity_token_id}`);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Webhook processing failed';
    console.error('[kyc-veriff-webhook] Error:', msg);
    // Always return 200 to prevent Veriff retries on our errors
    return NextResponse.json({ ok: true });
  }
}

/**
 * Inscribe kyc/veriff strand on BSV
 * Creates a transaction with the strand metadata as inscription
 */
async function inscribeStrand(strandId: string, identityTokenId: string, strandData: any) {
  if (!TREASURY_ADDRESS || !TREASURY_PRIVATE_KEY) {
    throw new Error('Treasury credentials not configured');
  }

  // Build inscription content
  const inscriptionContent = {
    p: '401',
    op: 'strand',
    v: '1.0',
    identity_token_id: identityTokenId,
    provider: strandData.provider,
    handle: strandData.handle,
    verified_at: new Date().toISOString(),
  };

  const contentJson = JSON.stringify(inscriptionContent);

  console.log(`[kyc-veriff-webhook] Inscribing strand ${strandId}:`, contentJson.slice(0, 100));

  // Note: Full BSV inscription would require:
  // 1. Create P2PKH UTXO from TREASURY_ADDRESS
  // 2. Embed inscription content in OP_FALSE OP_IF block
  // 3. Sign and broadcast
  // For now, log the intent; full implementation uses bsv.Transaction
  // This would integrate with the existing strand-inscribe.ts utilities

  return { success: true, inscribed: false, pending: true };
}
