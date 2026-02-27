import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedIdentity } from '@/lib/auth-guard';
import { getStrandsForIdentity, getStrandCount } from '@/lib/strand-store';

export async function GET(request: NextRequest) {
  const auth = await getAuthenticatedIdentity(request);
  if (!auth) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const strands = await getStrandsForIdentity(auth.identity.id);
  const count = await getStrandCount(auth.identity.id);

  return NextResponse.json({
    strands: strands.map(s => ({
      ...s,
      // Ensure strand_type and source are always present in response
      strandType: s.strandType || 'oauth',
      strandSubtype: s.strandSubtype || null,
      label: s.label || null,
      source: s.source || 'path401',
    })),
    count,
    identity: {
      id: auth.identity.id,
      symbol: auth.identity.symbol,
    },
  });
}
