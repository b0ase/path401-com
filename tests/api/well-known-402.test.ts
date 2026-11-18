import { describe, expect, it, vi, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { NextRequest } from 'next/server';

const { state } = vi.hoisted(() => ({ state: { client: null as unknown, calls: [] as Array<{ table: string; cols: string; op: string }> } }));

vi.mock('@/lib/supabase', () => ({
  get supabase() { return state.client; },
}));

function fakeClient() {
  return {
    from: (table: string) => {
      const q: Record<string, unknown> = {};
      let cols = '';
      q.select = (c: string) => { cols = c; state.calls.push({ table, cols: c, op: 'select' }); return q; };
      q.eq = () => q;
      q.ilike = () => q;
      q.limit = async () => ({ data: [] });
      q.maybeSingle = async () => ({ data: { address: '$example.com', pricing_model: 'alice_bond', base_price_sats: 100, treasury_balance: 0, access_mode: 'token' } });
      for (const w of ['insert', 'update', 'upsert', 'delete']) q[w] = () => { state.calls.push({ table, cols, op: w }); throw new Error('write'); };
      return q;
    },
  };
}

const req = () => new NextRequest('https://example.com/.well-known/$402.json', { headers: { host: 'example.com' } });

describe('/.well-known/$402.json', () => {
  beforeEach(() => { state.calls = []; });

  it('serves the document via lib/supabase, read-only, public columns only', async () => {
    state.client = fakeClient();
    const { GET } = await import('@/app/.well-known/$402.json/route');
    const res = await GET(req());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.root.path).toBe('$example.com');
    expect(state.calls.every((c) => c.op === 'select' && c.table === 'tokens')).toBe(true);
    for (const c of state.calls) expect(c.cols).not.toContain('*');
  });

  it('answers 503 (not 500, no fallback) when lib/supabase has no client', async () => {
    state.client = null;
    const { GET } = await import('@/app/.well-known/$402.json/route');
    const res = await GET(req());
    expect(res.status).toBe(503);
  });

  it('reads no SERVICE_ROLE / NEXT_PUBLIC env and builds no client of its own', () => {
    const src = readFileSync('app/.well-known/$402.json/route.ts', 'utf8');
    expect(src).not.toMatch(/SUPABASE_SERVICE_ROLE_KEY|NEXT_PUBLIC_SUPABASE|createClient|process\.env/);
    expect(src).toMatch(/from '@\/lib\/supabase'/);
  });
});
