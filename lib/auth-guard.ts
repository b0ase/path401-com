// Auth guard utility — extracts authenticated holder/identity from cookies

import { NextRequest } from 'next/server';
import { supabase } from './supabase';

export interface AuthHolder {
  id: string;
  address: string;
  handle: string;
  provider: string;
}

export interface AuthIdentity {
  id: string;
  holderId: string;
  symbol: string;
  tokenId: string;
  issuerAddress: string;
  broadcastTxid: string | null;
  broadcastStatus: string;
}

export async function getAuthenticatedHolder(
  request: NextRequest
): Promise<AuthHolder | null> {
  if (!supabase) return null;

  const handle = request.cookies.get('hc_handle')?.value;
  if (!handle) return null;

  const { data } = await supabase
    .from('path402_holders')
    .select('id, address, handle, provider')
    .eq('provider', 'handcash')
    .eq('handle', handle)
    .single();

  if (!data) return null;

  return {
    id: data.id,
    address: data.address || '',
    handle: data.handle,
    provider: data.provider,
  };
}

export async function getAuthenticatedIdentity(
  request: NextRequest
): Promise<{ holder: AuthHolder; identity: AuthIdentity } | null> {
  const holder = await getAuthenticatedHolder(request);
  if (!holder || !supabase) return null;

  const { data } = await supabase
    .from('path402_identity_tokens')
    .select('id, holder_id, symbol, token_id, issuer_address, broadcast_txid, broadcast_status')
    .eq('holder_id', holder.id)
    .single();

  if (!data) return null;

  return {
    holder,
    identity: {
      id: data.id,
      holderId: data.holder_id,
      symbol: data.symbol,
      tokenId: data.token_id,
      issuerAddress: data.issuer_address,
      broadcastTxid: data.broadcast_txid,
      broadcastStatus: data.broadcast_status,
    },
  };
}
