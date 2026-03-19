/**
 * KYC Veriff Button Component
 * Initiates Level 4 (Sovereign) identity verification via Veriff
 */

'use client';

import { useState } from 'react';
import { startKycSession } from '@/lib/kyc-veriff';

interface KycVeriffButtonProps {
  identityTokenId: string;
  kycStatus?: 'verified' | 'pending' | 'declined' | 'unverified';
  disabled?: boolean;
}

export default function KycVeriffButton({
  identityTokenId,
  kycStatus = 'unverified',
  disabled = false,
}: KycVeriffButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartKyc = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await startKycSession(identityTokenId);

      if (!result.success) {
        setError(result.error || 'Failed to start KYC session');
        setIsLoading(false);
      }
      // If successful, startKycSession redirects to Veriff
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(`Unexpected error: ${msg}`);
      setIsLoading(false);
    }
  };

  const isVerified = kycStatus === 'verified';
  const isPending = kycStatus === 'pending';
  const isDeclined = kycStatus === 'declined';
  const isDisabled = disabled || isLoading || isVerified;

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleStartKyc}
        disabled={isDisabled}
        className={`px-4 py-2 rounded font-medium transition-colors ${
          isVerified
            ? 'bg-green-500 text-white cursor-not-allowed opacity-60'
            : isPending
              ? 'bg-blue-500 text-white opacity-60 cursor-not-allowed'
              : isDeclined
                ? 'bg-red-500 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isLoading && 'Initiating KYC...'}
        {!isLoading && isVerified && '✓ KYC Verified (Level 4)'}
        {!isLoading && isPending && 'KYC Pending...'}
        {!isLoading && isDeclined && 'Retry KYC Verification'}
        {!isLoading && kycStatus === 'unverified' && 'Verify with Veriff (Level 4)'}
      </button>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      {isVerified && (
        <div className="text-green-600 text-sm bg-green-50 p-2 rounded">
          Your identity is now verified. You have Level 4 (Sovereign) status.
        </div>
      )}

      {isPending && (
        <div className="text-blue-600 text-sm bg-blue-50 p-2 rounded">
          KYC verification in progress. You'll be notified when complete.
        </div>
      )}

      {isDeclined && (
        <div className="text-amber-600 text-sm bg-amber-50 p-2 rounded">
          Your KYC verification was declined. Please try again or contact support.
        </div>
      )}
    </div>
  );
}
