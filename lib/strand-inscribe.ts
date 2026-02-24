// Strand inscription wrapper
// Wraps bsv-inscribe.ts for $401 strand inscriptions

import { createAndBroadcastInscription } from './bsv-inscribe';
import { updateStrandBroadcast, getStrandById } from './strand-store';

const TREASURY_ADDRESS = (process.env.TREASURY_ADDRESS || '').trim();
const TREASURY_KEY = (process.env.TREASURY_PRIVATE_KEY || '').trim();

export async function inscribeStrand(
  strandId: string
): Promise<{ txId: string; inscriptionId: string }> {
  if (!TREASURY_ADDRESS || !TREASURY_KEY) {
    throw new Error('Treasury wallet not configured');
  }

  const strand = await getStrandById(strandId);
  if (!strand) {
    throw new Error('Strand not found');
  }

  if (!strand.inscriptionData) {
    throw new Error('Strand has no inscription data');
  }

  if (strand.broadcastStatus === 'confirmed') {
    throw new Error('Strand already inscribed on-chain');
  }

  // Update status to pending
  await updateStrandBroadcast(strandId, '', 'pending');

  try {
    const result = await createAndBroadcastInscription({
      data: strand.inscriptionData,
      contentType: 'application/json',
      toAddress: TREASURY_ADDRESS,
      privateKeyWIF: TREASURY_KEY,
    });

    // Update status to confirmed with txid
    await updateStrandBroadcast(strandId, result.txId, 'confirmed');

    return { txId: result.txId, inscriptionId: result.inscriptionId };
  } catch (error) {
    // Update status to failed
    await updateStrandBroadcast(strandId, '', 'failed');
    throw error;
  }
}
