import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedHolder } from '@/lib/auth-guard';
import { getStrandById, deleteStrand } from '@/lib/strand-store';

export async function DELETE(
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

  const success = await deleteStrand(id);
  if (!success) {
    return NextResponse.json({ error: 'Failed to delete strand' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
