// Strand type display configuration for the identity page
// Maps strand_type (and strand_type/subtype) to icons, labels, colors

export interface StrandTypeConfig {
  label: string;
  description: string;
  color: string;
  pointValue: number;
  icon: 'github' | 'twitter' | 'google' | 'linkedin' | 'discord' | 'handcash' |
        'shield' | 'fingerprint' | 'file' | 'pen' | 'users' | 'camera' | 'lock' | 'globe' | 'key';
}

export const STRAND_TYPE_CONFIG: Record<string, StrandTypeConfig> = {
  // OAuth providers
  'oauth/github': { label: 'GitHub', description: 'GitHub account linked', color: 'text-white', pointValue: 2, icon: 'github' },
  'oauth/twitter': { label: 'Twitter', description: 'Twitter/X account linked', color: 'text-sky-400', pointValue: 1, icon: 'twitter' },
  'oauth/google': { label: 'Google', description: 'Google account linked', color: 'text-red-400', pointValue: 2, icon: 'google' },
  'oauth/linkedin': { label: 'LinkedIn', description: 'LinkedIn profile linked', color: 'text-blue-400', pointValue: 2, icon: 'linkedin' },
  'oauth/discord': { label: 'Discord', description: 'Discord account linked', color: 'text-indigo-400', pointValue: 1, icon: 'discord' },
  'oauth/handcash': { label: 'HandCash', description: 'HandCash wallet linked', color: 'text-green-400', pointValue: 2, icon: 'handcash' },
  'oauth/microsoft': { label: 'Microsoft', description: 'Microsoft account linked', color: 'text-blue-500', pointValue: 1, icon: 'globe' },

  // Identity verification types
  'self_attestation': { label: 'Self-Attestation', description: 'Declared name and address', color: 'text-yellow-400', pointValue: 3, icon: 'pen' },
  'id_document/passport': { label: 'Passport', description: 'Passport document uploaded', color: 'text-emerald-400', pointValue: 5, icon: 'file' },
  'id_document/driving_licence': { label: 'Driving Licence', description: 'Driving licence uploaded', color: 'text-emerald-400', pointValue: 5, icon: 'file' },
  'id_document/proof_of_address': { label: 'Proof of Address', description: 'Utility bill or bank statement', color: 'text-emerald-400', pointValue: 5, icon: 'file' },
  'registered_signature': { label: 'Registered Signature', description: 'Hand-drawn signature registered', color: 'text-purple-400', pointValue: 3, icon: 'pen' },
  'profile_photo': { label: 'Profile Photo', description: 'Photo uploaded', color: 'text-zinc-400', pointValue: 1, icon: 'camera' },
  'paid_signing': { label: 'Paid Signing', description: 'Paid for document signing', color: 'text-amber-400', pointValue: 3, icon: 'key' },
  'peer_attestation/cosign': { label: 'Peer Attestation', description: 'Co-signed by another identity', color: 'text-orange-400', pointValue: 5, icon: 'users' },
  'ip_thread': { label: 'IP Thread', description: 'Sealed document registered as IP', color: 'text-cyan-400', pointValue: 2, icon: 'lock' },
  'kyc/veriff': { label: 'KYC Verified', description: 'Biometric verification via Veriff', color: 'text-green-300', pointValue: 10, icon: 'fingerprint' },

  // Vault item types
  'vault_item/TLDRAW': { label: 'Drawn Signature', description: 'Hand-drawn signature in vault', color: 'text-zinc-400', pointValue: 1, icon: 'pen' },
  'vault_item/CAMERA': { label: 'Camera Photo', description: 'Camera capture in vault', color: 'text-zinc-400', pointValue: 1, icon: 'camera' },
  'vault_item/VIDEO': { label: 'Video Recording', description: 'Video in vault', color: 'text-zinc-400', pointValue: 2, icon: 'camera' },
  'vault_item/DOCUMENT': { label: 'Document', description: 'Document in vault', color: 'text-zinc-400', pointValue: 1, icon: 'file' },
  'vault_item/SEALED_DOCUMENT': { label: 'Sealed Document', description: 'Sealed document in vault', color: 'text-zinc-400', pointValue: 2, icon: 'lock' },
};

export function getStrandConfig(strandType: string, strandSubtype?: string | null, provider?: string): StrandTypeConfig {
  // Try exact match with subtype
  if (strandSubtype) {
    const key = `${strandType}/${strandSubtype}`;
    if (STRAND_TYPE_CONFIG[key]) return STRAND_TYPE_CONFIG[key];
  }

  // Try strand type alone
  if (STRAND_TYPE_CONFIG[strandType]) return STRAND_TYPE_CONFIG[strandType];

  // For legacy oauth strands, try oauth/provider
  if (strandType === 'oauth' && provider) {
    const oauthKey = `oauth/${provider}`;
    if (STRAND_TYPE_CONFIG[oauthKey]) return STRAND_TYPE_CONFIG[oauthKey];
  }

  // Fallback
  return {
    label: strandSubtype || strandType || 'Unknown',
    description: 'Identity strand',
    color: 'text-zinc-400',
    pointValue: 1,
    icon: 'shield',
  };
}
