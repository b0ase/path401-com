import { NextResponse } from 'next/server'

/**
 * x401 Discovery Endpoint
 *
 * Allows apps to discover this node's $401 capabilities.
 * Part of the X Protocol standard: x401.example.com → /.well-known/x401.json
 */

export async function GET() {
  return NextResponse.json(
    {
      protocol: '$401',
      version: '1.0',
      node: 'path401.com',
      name: 'path401 Identity Node',
      description: 'Primary $401 identity resolution node. Supports identity roots, strands, and content attestation.',
      endpoints: {
        resolve: '/api/identity/resolve',
        verify: '/api/identity/verify',
        attest: '/api/identity/attest',
        strands: '/api/client/strands',
        identity: '/api/client/identity',
      },
      capabilities: [
        'identity-resolution',
        'strand-verification',
        'content-attestation',
        'oauth-strands',
        'domain-verification',
      ],
      providers: [
        'github',
        'twitter',
        'google',
        'linkedin',
        'discord',
        'handcash',
      ],
      chain: 'bsv',
      xProtocol: {
        description: 'CNAME x401.yourdomain.com → path401.com to activate identity for your domain',
        dnsRecord: 'x401.example.com CNAME path401.com',
        txtRecord: '_x-protocol.example.com TXT "v=xp1; x401=1"',
      },
      links: {
        spec: 'https://path401.com/401/spec',
        whitepaper: 'https://path401.com/docs/x-protocol',
        github: 'https://github.com/b0ase/path401-com',
      },
    },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600',
      },
    },
  )
}
