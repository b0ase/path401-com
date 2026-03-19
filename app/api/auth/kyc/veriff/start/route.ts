/**
 * POST /api/auth/kyc/veriff/start
 * Initiates a Veriff KYC session for creating kyc/veriff strands (Lv.4 identity)
 *
 * Required: identity_token_id (from path402_identity_tokens)
 * Returns: verification_url (redirect user to Veriff)
 */

import { NextRequest, NextResponse } from 'next/server';
import { buildVeriffSessionPayload } from '@/lib/kyc-veriff';
import { supabase } from '@/lib/supabase';

const VERIFF_API_KEY = process.env.VERIFF_API_KEY || '';
const VERIFF_API_URL = 'https://stationapi.veriff.com/v1/sessions';
const VERIFF_CALLBACK_URL = process.env.VERIFF_CALLBACK_URL ||
  `${process.env.NEXT_PUBLIC_APP_URL || 'https://path401.com'}/api/auth/kyc/veriff/webhook`;

interface StartKycRequest {
  identity_token_id: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: StartKycRequest = await request.json();
    const { identity_token_id } = body;

    if (!identity_token_id) {
      return NextResponse.json(
        { error: 'identity_token_id is required' },
        { status: 400 }
      );
    }

    if (!VERIFF_API_KEY) {
      console.error('[kyc-veriff-start] VERIFF_API_KEY not configured');
      return NextResponse.json(
        { error: 'KYC service not configured' },
        { status: 503 }
      );
    }

    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    // Validate identity token exists
    const { data: identityToken, error: tokenError } = await supabase
      .from('path402_identity_tokens')
      .select('id, holder_id, handle')
      .eq('id', identity_token_id)
      .maybeSingle();

    if (tokenError || !identityToken) {
      console.error('[kyc-veriff-start] Identity token not found:', identity_token_id);
      return NextResponse.json(
        { error: 'Identity token not found' },
        { status: 404 }
      );
    }

    // Check if KYC session already pending/approved for this identity
    const { data: existingSession } = await supabase
      .from('path401_kyc_sessions')
      .select('id, status')
      .eq('identity_token_id', identity_token_id)
      .in('status', ['pending', 'approved'])
      .maybeSingle();

    if (existingSession) {
      return NextResponse.json(
        { error: 'KYC verification already in progress or completed' },
        { status: 409 }
      );
    }

    // Initiate Veriff session using @b0ase/bit-sign payload builder
    const veriffPayload = buildVeriffSessionPayload({
      callbackUrl: VERIFF_CALLBACK_URL,
      vendorData: {
        identity_token_id,
        holder_id: identityToken.holder_id,
        handle: identityToken.handle,
        purpose: 'path401_kyc_strand',
        timestamp: new Date().toISOString(),
      },
    });

    console.log('[kyc-veriff-start] Calling Veriff API:', {
      url: VERIFF_API_URL,
      apiKeySet: !!VERIFF_API_KEY,
      identityTokenId: identity_token_id,
    });

    let veriffResponse;
    try {
      veriffResponse = await fetch(VERIFF_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-AUTH-CLIENT': VERIFF_API_KEY,
        },
        body: JSON.stringify(veriffPayload),
      });
    } catch (fetchErr) {
      const msg = fetchErr instanceof Error ? fetchErr.message : 'Unknown fetch error';
      console.error('[kyc-veriff-start] Fetch exception:', msg);
      return NextResponse.json(
        { error: 'Failed to connect to Veriff', details: msg },
        { status: 503 }
      );
    }

    if (!veriffResponse.ok) {
      const errData = await veriffResponse.text();
      console.error('[kyc-veriff-start] Veriff API error:', {
        status: veriffResponse.status,
        statusText: veriffResponse.statusText,
        body: errData,
      });
      return NextResponse.json(
        { error: 'Failed to initiate KYC session', details: errData },
        { status: 500 }
      );
    }

    const veriffData: any = await veriffResponse.json();
    const veriff_session_id = veriffData.verification?.id;
    const verification_url = veriffData.verification?.url;

    if (!veriff_session_id || !verification_url) {
      console.error('[kyc-veriff-start] Invalid Veriff response:', veriffData);
      return NextResponse.json(
        { error: 'Invalid KYC session response' },
        { status: 500 }
      );
    }

    // Store session in database
    const { error: insertError } = await supabase
      .from('path401_kyc_sessions')
      .insert({
        identity_token_id,
        holder_id: identityToken.holder_id,
        veriff_session_id,
        status: 'pending',
        veriff_response: veriffData,
      });

    if (insertError) {
      console.error('[kyc-veriff-start] Failed to store session:', insertError);
      return NextResponse.json(
        { error: 'Failed to store KYC session' },
        { status: 500 }
      );
    }

    console.log(
      `[kyc-veriff-start] KYC session initiated: ${veriff_session_id} for identity ${identity_token_id}`
    );

    return NextResponse.json({
      success: true,
      verification_url,
      session_id: veriff_session_id,
      message: 'Redirecting to Veriff for identity verification...',
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to start KYC session';
    console.error('[kyc-veriff-start] Error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
