import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedHolder } from '@/lib/auth-guard';
import { getStrandById } from '@/lib/strand-store';
import { inscribeStrand } from '@/lib/strand-inscribe';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const holder = await getAuthenticatedHolder(request);
  if (!holder) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { id } = await params;

  const strand = await getStrandById(id);
  if (!strand) {
    return NextResponse.json({ error: 'Strand not found' }, { status: 404 });
  }

  // Ownership check
  if (strand.holderId !== holder.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (strand.broadcastStatus === 'confirmed') {
    return NextResponse.json({ error: 'Already inscribed on-chain' }, { status: 409 });
  }

  try {
    const result = await inscribeStrand(id);

    return NextResponse.json({
      txId: result.txId,
      inscriptionId: result.inscriptionId,
      explorerUrl: `https://whatsonchain.com/tx/${result.txId}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Inscription failed';
    console.error('Strand broadcast error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
