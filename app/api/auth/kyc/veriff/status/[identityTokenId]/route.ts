/**
 * GET /api/auth/kyc/veriff/status/[identityTokenId]
 * Check the status of a KYC verification session
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ identityTokenId: string }> }
) {
  try {
    const { identityTokenId } = await params;

    if (!identityTokenId) {
      return NextResponse.json(
        { error: 'identityTokenId is required' },
        { status: 400 }
      );
    }

    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    // Get the most recent KYC session for this identity
    const { data: session, error } = await supabase
      .from('path401_kyc_sessions')
      .select('id, status, strand_id, decision_payload, created_at, updated_at')
      .eq('identity_token_id', identityTokenId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('[kyc-status] Query error:', error);
      return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 });
    }

    if (!session) {
      return NextResponse.json({
        status: 'not_found',
        message: 'No KYC session found for this identity',
      });
    }

    // If approved, check if strand was created
    let strandVerified = false;
    if (session.status === 'approved' && session.strand_id) {
      const { data: strand } = await supabase
        .from('path401_identity_strands')
        .select('id, broadcast_status')
        .eq('id', session.strand_id)
        .maybeSingle();

      strandVerified = !!strand;
    }

    return NextResponse.json({
      status: session.status,
      session_id: session.id,
      strand_id: session.strand_id,
      strand_verified: strandVerified,
      decision_payload: session.decision_payload,
      created_at: session.created_at,
      updated_at: session.updated_at,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('[kyc-status] Error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
