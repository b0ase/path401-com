import { NextResponse } from 'next/server';
import { PROVIDERS, isProviderConfigured } from '@/lib/strand-providers';

export async function GET() {
  const providers = Object.entries(PROVIDERS).map(([id, config]) => ({
    id,
    label: config.label,
    configured: isProviderConfigured(id),
  }));

  return NextResponse.json({ providers });
}
