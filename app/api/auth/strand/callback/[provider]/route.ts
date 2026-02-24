import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedIdentity } from '@/lib/auth-guard';
import { getProvider, getProviderCredentials } from '@/lib/strand-providers';
import {
  createStrand,
  getStrandByProvider,
  generateProofHash,
  buildStrandInscriptionData,
} from '@/lib/strand-store';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider: providerId } = await params;
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://path401.com').trim();

  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const storedState = request.cookies.get(`strand_oauth_state_${providerId}`)?.value;

    // Validate CSRF state
    if (!state || !storedState || state !== storedState) {
      return NextResponse.redirect(`${baseUrl}/identity?error=invalid_state`);
    }

    if (!code) {
      return NextResponse.redirect(`${baseUrl}/identity?error=no_code`);
    }

    const provider = getProvider(providerId);
    if (!provider) {
      return NextResponse.redirect(`${baseUrl}/identity?error=unknown_provider`);
    }

    const creds = getProviderCredentials(provider);
    if (!creds.clientId || !creds.clientSecret) {
      return NextResponse.redirect(`${baseUrl}/identity?error=provider_not_configured`);
    }

    // Get authenticated holder + identity
    const auth = await getAuthenticatedIdentity(request);
    if (!auth) {
      return NextResponse.redirect(`${baseUrl}/identity?error=not_authenticated`);
    }

    // Build token exchange body
    const tokenBody: Record<string, string> = {
      client_id: creds.clientId,
      client_secret: creds.clientSecret,
      code,
      redirect_uri: `${baseUrl}/api/auth/strand/callback/${providerId}`,
      grant_type: 'authorization_code',
    };

    // PKCE code_verifier for Twitter
    if (provider.usePKCE) {
      const codeVerifier = request.cookies.get(`strand_pkce_${providerId}`)?.value;
      if (codeVerifier) {
        tokenBody.code_verifier = codeVerifier;
      }
    }

    // Exchange code for access token
    const tokenHeaders: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    };

    // Twitter uses Basic auth for token exchange
    if (providerId === 'twitter') {
      tokenHeaders.Authorization = `Basic ${Buffer.from(`${creds.clientId}:${creds.clientSecret}`).toString('base64')}`;
      delete tokenBody.client_secret;
    }

    // GitHub prefers JSON body
    const tokenFetchOptions: RequestInit = {
      method: 'POST',
      headers: tokenHeaders,
    };

    if (providerId === 'github') {
      tokenFetchOptions.headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };
      tokenFetchOptions.body = JSON.stringify(tokenBody);
    } else {
      tokenFetchOptions.body = new URLSearchParams(tokenBody).toString();
    }

    const tokenRes = await fetch(provider.tokenEndpoint, tokenFetchOptions);
    const tokenData = await tokenRes.json();

    if (tokenData.error || (!tokenData.access_token)) {
      console.error(`Token exchange failed (${providerId}):`, tokenData.error || tokenData);
      return NextResponse.redirect(`${baseUrl}/identity?error=token_exchange_failed`);
    }

    const accessToken = tokenData.access_token;

    // Fetch user profile
    const profileRes = await fetch(provider.userEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    if (!profileRes.ok) {
      console.error(`Profile fetch failed (${providerId}):`, profileRes.status);
      return NextResponse.redirect(`${baseUrl}/identity?error=profile_fetch_failed`);
    }

    const profileData = await profileRes.json();
    const profile = provider.extractProfile(profileData);

    // Generate proof hash — token is NEVER stored
    const proofHash = generateProofHash(accessToken);

    // Check for existing strand
    const existing = await getStrandByProvider(auth.identity.id, providerId);
    if (existing) {
      const response = NextResponse.redirect(`${baseUrl}/identity?error=strand_exists&provider=${providerId}`);
      response.cookies.delete(`strand_oauth_state_${providerId}`);
      if (provider.usePKCE) response.cookies.delete(`strand_pkce_${providerId}`);
      return response;
    }

    // Build spec-compliant inscription data
    const inscriptionData = buildStrandInscriptionData({
      rootTxid: auth.identity.broadcastTxid || auth.identity.id,
      provider: providerId,
      handle: profile.handle,
      proofHash,
      metadata: profile.metadata,
    });

    // Create strand in database
    await createStrand({
      identityTokenId: auth.identity.id,
      holderId: auth.holder.id,
      provider: providerId,
      providerUserId: profile.userId,
      providerHandle: profile.handle,
      providerDisplayName: profile.displayName,
      providerAvatarUrl: profile.avatarUrl || undefined,
      providerMetadata: profile.metadata,
      proofHash,
      inscriptionData,
    });

    // Clear cookies and redirect with success
    const response = NextResponse.redirect(`${baseUrl}/identity?strand=${providerId}&success=true`);
    response.cookies.delete(`strand_oauth_state_${providerId}`);
    if (provider.usePKCE) response.cookies.delete(`strand_pkce_${providerId}`);
    return response;
  } catch (error) {
    console.error(`Strand callback error (${providerId}):`, error);
    const response = NextResponse.redirect(`${baseUrl}/identity?error=callback_failed`);
    response.cookies.delete(`strand_oauth_state_${providerId}`);
    return response;
  }
}
