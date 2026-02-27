// Strand store with Supabase persistence
// Falls back to in-memory if database not configured

import { supabase, isDbConnected } from './supabase';
import { createHash } from 'crypto';

export interface Strand {
  id: string;
  identityTokenId: string;
  holderId: string;
  provider: string;
  providerUserId: string;
  providerHandle: string | null;
  providerDisplayName: string | null;
  providerAvatarUrl: string | null;
  providerMetadata: Record<string, unknown>;
  proofHash: string;
  inscriptionData: Record<string, unknown> | null;
  strandTxid: string | null;
  broadcastStatus: string;
  oauthVerifiedAt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Extended fields for all strand types
  strandType: string;
  strandSubtype: string | null;
  signatureId: string | null;
  label: string | null;
  source: string;
}

// In-memory fallback storage
const memoryStrands = new Map<string, Strand>();

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

function mapDbRow(row: Record<string, unknown>): Strand {
  return {
    id: row.id as string,
    identityTokenId: row.identity_token_id as string,
    holderId: row.holder_id as string,
    provider: row.provider as string,
    providerUserId: row.provider_user_id as string,
    providerHandle: row.provider_handle as string | null,
    providerDisplayName: row.provider_display_name as string | null,
    providerAvatarUrl: row.provider_avatar_url as string | null,
    providerMetadata: (row.provider_metadata as Record<string, unknown>) || {},
    proofHash: row.proof_hash as string,
    inscriptionData: row.inscription_data as Record<string, unknown> | null,
    strandTxid: row.strand_txid as string | null,
    broadcastStatus: row.broadcast_status as string,
    oauthVerifiedAt: row.oauth_verified_at as string,
    isActive: row.is_active as boolean,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    strandType: (row.strand_type as string) || 'oauth',
    strandSubtype: row.strand_subtype as string | null,
    signatureId: row.signature_id as string | null,
    label: row.label as string | null,
    source: (row.source as string) || 'path401',
  };
}

export async function createStrand(params: {
  identityTokenId: string;
  holderId: string;
  provider: string;
  providerUserId: string;
  providerHandle?: string;
  providerDisplayName?: string;
  providerAvatarUrl?: string;
  providerMetadata?: Record<string, unknown>;
  proofHash: string;
  inscriptionData?: Record<string, unknown>;
}): Promise<Strand> {
  if (isDbConnected() && supabase) {
    const { data, error } = await supabase
      .from('path401_identity_strands')
      .insert({
        identity_token_id: params.identityTokenId,
        holder_id: params.holderId,
        provider: params.provider,
        provider_user_id: params.providerUserId,
        provider_handle: params.providerHandle || null,
        provider_display_name: params.providerDisplayName || null,
        provider_avatar_url: params.providerAvatarUrl || null,
        provider_metadata: params.providerMetadata || {},
        proof_hash: params.proofHash,
        inscription_data: params.inscriptionData || null,
        broadcast_status: 'local',
      })
      .select()
      .single();

    if (error) throw error;
    return mapDbRow(data);
  }

  // In-memory fallback
  const strand: Strand = {
    id: generateId(),
    identityTokenId: params.identityTokenId,
    holderId: params.holderId,
    provider: params.provider,
    providerUserId: params.providerUserId,
    providerHandle: params.providerHandle || null,
    providerDisplayName: params.providerDisplayName || null,
    providerAvatarUrl: params.providerAvatarUrl || null,
    providerMetadata: params.providerMetadata || {},
    proofHash: params.proofHash,
    inscriptionData: params.inscriptionData || null,
    strandTxid: null,
    broadcastStatus: 'local',
    oauthVerifiedAt: new Date().toISOString(),
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    strandType: 'oauth',
    strandSubtype: null,
    signatureId: null,
    label: null,
    source: 'path401',
  };

  memoryStrands.set(strand.id, strand);
  return strand;
}

export async function getStrandsForIdentity(identityTokenId: string): Promise<Strand[]> {
  if (isDbConnected() && supabase) {
    const { data } = await supabase
      .from('path401_identity_strands')
      .select('*')
      .eq('identity_token_id', identityTokenId)
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    return (data || []).map(mapDbRow);
  }

  return Array.from(memoryStrands.values())
    .filter((s) => s.identityTokenId === identityTokenId && s.isActive);
}

export async function getStrandByProvider(
  identityTokenId: string,
  provider: string
): Promise<Strand | null> {
  if (isDbConnected() && supabase) {
    const { data } = await supabase
      .from('path401_identity_strands')
      .select('*')
      .eq('identity_token_id', identityTokenId)
      .eq('provider', provider)
      .eq('is_active', true)
      .single();

    return data ? mapDbRow(data) : null;
  }

  return Array.from(memoryStrands.values())
    .find((s) => s.identityTokenId === identityTokenId && s.provider === provider && s.isActive) || null;
}

export async function getStrandById(strandId: string): Promise<Strand | null> {
  if (isDbConnected() && supabase) {
    const { data } = await supabase
      .from('path401_identity_strands')
      .select('*')
      .eq('id', strandId)
      .single();

    return data ? mapDbRow(data) : null;
  }

  return memoryStrands.get(strandId) || null;
}

export async function updateStrandBroadcast(
  strandId: string,
  txid: string,
  status: 'pending' | 'confirmed' | 'failed'
): Promise<boolean> {
  if (isDbConnected() && supabase) {
    const { error } = await supabase
      .from('path401_identity_strands')
      .update({
        strand_txid: txid,
        broadcast_status: status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', strandId);

    return !error;
  }

  const strand = memoryStrands.get(strandId);
  if (!strand) return false;
  strand.strandTxid = txid;
  strand.broadcastStatus = status;
  strand.updatedAt = new Date().toISOString();
  return true;
}

export async function deleteStrand(strandId: string): Promise<boolean> {
  if (isDbConnected() && supabase) {
    const { error } = await supabase
      .from('path401_identity_strands')
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', strandId);

    return !error;
  }

  const strand = memoryStrands.get(strandId);
  if (!strand) return false;
  strand.isActive = false;
  strand.updatedAt = new Date().toISOString();
  return true;
}

export async function getStrandCount(identityTokenId: string): Promise<number> {
  if (isDbConnected() && supabase) {
    const { count } = await supabase
      .from('path401_identity_strands')
      .select('*', { count: 'exact', head: true })
      .eq('identity_token_id', identityTokenId)
      .eq('is_active', true);

    return count || 0;
  }

  return Array.from(memoryStrands.values())
    .filter((s) => s.identityTokenId === identityTokenId && s.isActive).length;
}

export function generateProofHash(oauthToken: string): string {
  return createHash('sha256').update(oauthToken).digest('hex');
}

export function buildStrandInscriptionData(params: {
  rootTxid: string;
  provider: string;
  handle: string;
  proofHash: string;
  metadata?: Record<string, unknown>;
}): Record<string, unknown> {
  return {
    p: '401',
    op: 'strand',
    v: '1.0',
    root: params.rootTxid,
    provider: params.provider,
    handle: params.handle,
    proofHash: params.proofHash,
    metadata: params.metadata || {},
    ts: new Date().toISOString(),
  };
}
