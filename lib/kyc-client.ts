/**
 * Veriff KYC integration for creating Level 4 (kyc/veriff) strands
 * Manages the flow from initiation through Veriff redirect and webhook callback
 */

interface StartKycSessionResponse {
  success: boolean;
  verification_url?: string;
  session_id?: string;
  message?: string;
  error?: string;
}

export async function startKycSession(
  identityTokenId: string
): Promise<StartKycSessionResponse> {
  try {
    const response = await fetch('/api/auth/kyc/veriff/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identity_token_id: identityTokenId }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('[kyc] Start session failed:', error);
      return {
        success: false,
        error: error.error || 'Failed to start KYC session',
      };
    }

    const data: StartKycSessionResponse = await response.json();

    if (data.verification_url) {
      // Redirect to Veriff
      window.location.href = data.verification_url;
    }

    return data;
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('[kyc] Unexpected error:', msg);
    return {
      success: false,
      error: `Unexpected error: ${msg}`,
    };
  }
}

/**
 * Check KYC session status by session ID
 * Used to poll for webhook callback completion
 */
export async function checkKycSessionStatus(
  identityTokenId: string
): Promise<{ status?: string; approved?: boolean; error?: string }> {
  try {
    const response = await fetch(`/api/auth/kyc/veriff/status/${identityTokenId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      return { error: 'Failed to fetch KYC status' };
    }

    const data = await response.json();
    return {
      status: data.status,
      approved: data.status === 'approved',
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return { error: msg };
  }
}
