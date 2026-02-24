// Strand strength scoring per $401 spec section 12.3

export type StrengthLevel = 'none' | 'weak' | 'moderate' | 'strong' | 'verified';

export interface StrengthScore {
  count: number;
  level: StrengthLevel;
  categories: string[];
}

// Provider categories for cross-category bonus
const PROVIDER_CATEGORIES: Record<string, string> = {
  github: 'developer',
  twitter: 'social',
  linkedin: 'professional',
  google: 'email',
  discord: 'social',
  handcash: 'wallet',
};

export function calculateStrength(providers: string[]): StrengthScore {
  const count = providers.length;
  const categories = [...new Set(providers.map((p) => PROVIDER_CATEGORIES[p] || 'other'))];

  let level: StrengthLevel;
  if (count === 0) {
    level = 'none';
  } else if (count === 1) {
    level = 'weak';
  } else if (count === 2) {
    level = 'moderate';
  } else if (count === 3) {
    level = 'strong';
  } else {
    level = 'verified';
  }

  return { count, level, categories };
}
