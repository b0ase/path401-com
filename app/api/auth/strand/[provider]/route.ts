import { NextRequest, NextResponse } from 'next/server';
import { randomBytes, createHash } from 'crypto';
import { getProvider, getProviderCredentials } from '@/lib/strand-providers';

function generateCodeVerifier(): string {
  return randomBytes(32).toString('base64url');
}

function generateCodeChallenge(verifier: string): string {
  return createHash('sha256').update(verifier).digest('base64url');
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider: providerId } = await params;
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://path401.com').trim();

  try {
    // Must be logged in via HandCash first
    const handle = request.cookies.get('hc_handle')?.value;
    if (!handle) {
      return NextResponse.redirect(`${baseUrl}/identity?error=not_authenticated`);
    }

    const provider = getProvider(providerId);
    if (!provider) {
      return NextResponse.redirect(`${baseUrl}/identity?error=unknown_provider`);
    }

    const creds = getProviderCredentials(provider);
    if (!creds.clientId || !creds.clientSecret) {
      return NextResponse.redirect(`${baseUrl}/identity?error=provider_not_configured`);
    }

    // Generate CSRF state
    const state = randomBytes(32).toString('hex');

    // Build authorization URL
    const authUrl = new URL(provider.authUrl);
    authUrl.searchParams.set('client_id', creds.clientId);
    authUrl.searchParams.set('redirect_uri', `${baseUrl}/api/auth/strand/callback/${providerId}`);
    authUrl.searchParams.set('scope', provider.scope);
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('response_type', 'code');

    const response = NextResponse.redirect(authUrl.toString());

    // Store state cookie
    response.cookies.set(`strand_oauth_state_${providerId}`, state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10,
      path: '/',
    });

    // PKCE for Twitter
    if (provider.usePKCE) {
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = generateCodeChallenge(codeVerifier);

      authUrl.searchParams.set('code_challenge', codeChallenge);
      authUrl.searchParams.set('code_challenge_method', 'S256');

      response.cookies.set(`strand_pkce_${providerId}`, codeVerifier, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 10,
        path: '/',
      });

      // Re-create redirect with PKCE params
      return NextResponse.redirect(authUrl.toString(), {
        headers: response.headers,
      });
    }

    return response;
  } catch (error) {
    console.error(`Strand auth error (${providerId}):`, error);
    return NextResponse.redirect(`${baseUrl}/identity?error=auth_failed`);
  }
}
