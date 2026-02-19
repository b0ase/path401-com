import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = '$401 — Decentralised Identity Token on BSV';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#020617',
          position: 'relative',
          fontFamily: 'monospace',
          padding: '48px 56px',
        }}
      >
        {/* Grid pattern overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              linear-gradient(rgba(34, 197, 94, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 197, 94, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            display: 'flex',
          }}
        />

        {/* Glow */}
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: '500px',
            height: '400px',
            background: 'radial-gradient(ellipse at center, rgba(34, 197, 94, 0.08) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Corner brackets */}
        <div style={{ position: 'absolute', top: 20, left: 20, width: 40, height: 40, borderLeft: '2px solid rgba(34, 197, 94, 0.15)', borderTop: '2px solid rgba(34, 197, 94, 0.15)', display: 'flex' }} />
        <div style={{ position: 'absolute', top: 20, right: 20, width: 40, height: 40, borderRight: '2px solid rgba(34, 197, 94, 0.15)', borderTop: '2px solid rgba(34, 197, 94, 0.15)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: 20, left: 20, width: 40, height: 40, borderLeft: '2px solid rgba(34, 197, 94, 0.15)', borderBottom: '2px solid rgba(34, 197, 94, 0.15)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: 20, right: 20, width: 40, height: 40, borderRight: '2px solid rgba(34, 197, 94, 0.15)', borderBottom: '2px solid rgba(34, 197, 94, 0.15)', display: 'flex' }} />

        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8, zIndex: 10 }}>
          <div style={{ width: 12, height: 12, background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 10px rgba(34, 197, 94, 0.6)', display: 'flex' }} />
          <div style={{ fontSize: 14, color: '#71717a', letterSpacing: '0.2em', textTransform: 'uppercase' as const, display: 'flex' }}>
            Identity Protocol — BSV On-Chain
          </div>
        </div>

        {/* $401 title */}
        <div
          style={{
            fontSize: 120,
            fontWeight: 900,
            color: 'white',
            letterSpacing: '-0.03em',
            lineHeight: 1,
            marginBottom: 8,
            display: 'flex',
            textShadow: '0 0 60px rgba(34, 197, 94, 0.4)',
          }}
        >
          $401
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: 22, color: '#a1a1aa', letterSpacing: '0.15em', marginBottom: 40, display: 'flex' }}>
          SELF-SOVEREIGN IDENTITY
        </div>

        {/* Identity info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 24, zIndex: 10 }}>
          <div style={{ fontSize: 11, color: '#52525b', letterSpacing: '0.2em', textTransform: 'uppercase' as const, display: 'flex' }}>
            Identity Strength Levels
          </div>
          <div style={{ fontSize: 14, color: '#71717a', display: 'flex' }}>
            Level 1 (anon) &rarr; Level 4+ (peer-underwritten KYC)
          </div>
        </div>

        {/* OAuth providers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 32, zIndex: 10 }}>
          <div style={{ fontSize: 11, color: '#52525b', letterSpacing: '0.2em', textTransform: 'uppercase' as const, display: 'flex' }}>
            OAuth Providers
          </div>
          <div style={{ fontSize: 14, color: '#71717a', display: 'flex' }}>
            Google / GitHub / X / Discord / LinkedIn / Apple
          </div>
        </div>

        {/* Contract params row */}
        <div style={{ display: 'flex', gap: 48, zIndex: 10 }}>
          {[
            ['Protocol', 'BSV-20'],
            ['Structure', 'Root + Strands'],
            ['Storage', 'On-Chain'],
            ['Privacy', 'Encrypted'],
            ['Custody', 'Self-Sovereign'],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: 10, color: '#52525b', letterSpacing: '0.2em', textTransform: 'uppercase' as const, display: 'flex' }}>
                {label}
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'white', display: 'flex' }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: 56,
            right: 56,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 8px rgba(34, 197, 94, 0.6)', display: 'flex' }} />
            <div style={{ fontSize: 16, color: '#52525b', display: 'flex' }}>
              path401.com/token
            </div>
          </div>
          <div style={{ fontSize: 12, color: '#3f3f46', letterSpacing: '0.15em', display: 'flex' }}>
            BSV-20 // IDENTITY // ENCRYPTED
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
