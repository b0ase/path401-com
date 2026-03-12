import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * PUBLIC $401 Identity Resolution Endpoint
 *
 * Resolves $401 identity by address, handle, or txid.
 * This is the core endpoint that x401 nodes serve to external apps.
 *
 * GET /api/identity/resolve?address=1ABC...
 * GET /api/identity/resolve?handle=alice
 * GET /api/identity/resolve?txid=abc123...
 *
 * No auth required — identity is public by design.
 * Reads from both identity_roots/strands (path401) and bit_sign tables.
 */

// CORS: allow any origin (identity is public)
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
}

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get('address')
  const handle = req.nextUrl.searchParams.get('handle')
  const txid = req.nextUrl.searchParams.get('txid')

  if (!address && !handle && !txid) {
    return NextResponse.json(
      { error: 'Provide address, handle, or txid' },
      { status: 400, headers: CORS_HEADERS },
    )
  }

  if (!supabase) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503, headers: CORS_HEADERS },
    )
  }

  try {
    let identity = null

    // Strategy 1: Look up by root txid
    if (txid) {
      identity = await resolveByTxid(txid)
    }

    // Strategy 2: Look up by address (pay_to_address in identity_roots)
    if (!identity && address) {
      identity = await resolveByAddress(address)
    }

    // Strategy 3: Look up by handle (HandCash handle or provider handle)
    if (!identity && handle) {
      identity = await resolveByHandle(handle)
    }

    if (!identity) {
      return NextResponse.json(
        { identity: null, message: 'No $401 identity found' },
        { headers: CORS_HEADERS },
      )
    }

    return NextResponse.json(
      {
        identity,
        node: 'path401.com',
        protocol: '$401',
        version: '1.0',
      },
      { headers: CORS_HEADERS },
    )
  } catch (e) {
    console.error('[identity/resolve] Error:', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Resolution failed' },
      { status: 500, headers: CORS_HEADERS },
    )
  }
}

// ── Resolution Strategies ───────────────────────────────────────────────────

interface ResolvedIdentity {
  rootTxid: string
  address: string
  handle?: string
  payTo: string
  strands: Array<{
    provider: string
    handle: string
    txid: string
    createdAt: string
    points?: number
  }>
  strength: number
  createdAt: string
}

async function resolveByTxid(txid: string): Promise<ResolvedIdentity | null> {
  const { data: root } = await supabase!
    .from('identity_roots')
    .select('*, identity_strands(*)')
    .eq('root_txid', txid)
    .eq('is_active', true)
    .single()

  if (!root) return null
  return formatIdentity(root)
}

async function resolveByAddress(address: string): Promise<ResolvedIdentity | null> {
  // Check identity_roots (path401 native)
  const { data: root } = await supabase!
    .from('identity_roots')
    .select('*, identity_strands(*)')
    .eq('pay_to_address', address)
    .eq('is_active', true)
    .single()

  if (root) return formatIdentity(root)

  // Check bit_sign_identities (bit-sign app)
  const { data: bsIdentity } = await supabase!
    .from('bit_sign_identities')
    .select('*')
    .eq('user_handle', address)
    .single()

  if (bsIdentity) return formatBitSignIdentity(bsIdentity)

  return null
}

async function resolveByHandle(handle: string): Promise<ResolvedIdentity | null> {
  const cleanHandle = handle.replace(/^@/, '').toLowerCase()

  // Check identity_strands for provider handles (e.g. GitHub, Twitter)
  const { data: strand } = await supabase!
    .from('identity_strands')
    .select('*, identity_roots!inner(*)')
    .ilike('provider_handle', cleanHandle)
    .eq('is_active', true)
    .limit(1)
    .single()

  if (strand?.identity_roots) {
    // Re-fetch the full root with all strands
    const { data: root } = await supabase!
      .from('identity_roots')
      .select('*, identity_strands(*)')
      .eq('id', strand.root_id)
      .eq('is_active', true)
      .single()

    if (root) return formatIdentity(root)
  }

  // Check bit_sign_identities by user_handle (HandCash handle)
  const { data: bsIdentity } = await supabase!
    .from('bit_sign_identities')
    .select('*')
    .ilike('user_handle', cleanHandle)
    .single()

  if (bsIdentity) return formatBitSignIdentity(bsIdentity)

  // Check by GitHub handle in bit_sign
  const { data: bsGithub } = await supabase!
    .from('bit_sign_identities')
    .select('*')
    .ilike('github_handle', cleanHandle)
    .single()

  if (bsGithub) return formatBitSignIdentity(bsGithub)

  return null
}

// ── Format helpers ──────────────────────────────────────────────────────────

function formatIdentity(root: any): ResolvedIdentity {
  const strands = (root.identity_strands || [])
    .filter((s: any) => s.is_active)
    .map((s: any) => ({
      provider: s.provider,
      handle: s.provider_handle || '',
      txid: s.strand_txid || '',
      createdAt: s.created_at,
    }))

  return {
    rootTxid: root.root_txid || '',
    address: root.pay_to_address || '',
    payTo: root.pay_to_address || '',
    strands,
    strength: Math.min(4, 1 + strands.length),
    createdAt: root.created_at,
  }
}

function formatBitSignIdentity(bs: any): ResolvedIdentity {
  const strands: ResolvedIdentity['strands'] = []

  // Build strands from bit_sign columns
  if (bs.github_handle) {
    strands.push({
      provider: 'github',
      handle: bs.github_handle,
      txid: '',
      createdAt: bs.created_at,
      points: 2,
    })
  }
  if (bs.google_email) {
    strands.push({
      provider: 'google',
      handle: bs.google_email,
      txid: '',
      createdAt: bs.created_at,
      points: 2,
    })
  }
  if (bs.twitter_handle) {
    strands.push({
      provider: 'twitter',
      handle: bs.twitter_handle,
      txid: '',
      createdAt: bs.created_at,
      points: 1,
    })
  }
  if (bs.linkedin_name) {
    strands.push({
      provider: 'linkedin',
      handle: bs.linkedin_name,
      txid: '',
      createdAt: bs.created_at,
      points: 2,
    })
  }
  if (bs.discord_handle) {
    strands.push({
      provider: 'discord',
      handle: bs.discord_handle,
      txid: '',
      createdAt: bs.created_at,
      points: 1,
    })
  }

  return {
    rootTxid: bs.token_id || '',
    address: bs.user_handle || '',
    handle: bs.user_handle,
    payTo: bs.user_handle || '',
    strands,
    strength: bs.identity_strength || Math.min(4, 1 + strands.length),
    createdAt: bs.created_at,
  }
}
