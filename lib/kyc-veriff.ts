/**
 * Veriff KYC utilities for path401-com
 * These functions were previously imported from @b0ase/bit-sign
 */

import { createHmac } from 'crypto';

/**
 * Build the payload for Veriff session creation
 */
export function buildVeriffSessionPayload(opts: {
  callbackUrl: string;
  vendorData?: Record<string, any>;
}) {
  return {
    verification: {
      callback_url: opts.callbackUrl,
      vendor_data: JSON.stringify(opts.vendorData || {}),
    },
  };
}

/**
 * Validate Veriff webhook HMAC signature
 * Server-only: uses node:crypto
 */
export function validateVeriffHmac(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  if (!secret) return false;

  const hash = createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  // Case-insensitive comparison
  return hash.toLowerCase() === signature.toLowerCase();
}

/**
 * Scrub sensitive PII from Veriff decision payload
 * Keeps only name, DOB, document type/country, last 4 of doc number
 */
export function scrubVeriffDecision(payload: any) {
  return {
    verification: {
      id: payload.verification?.id,
      status: payload.verification?.status,
      person: payload.verification?.person ? {
        firstName: payload.verification.person.firstName,
        lastName: payload.verification.person.lastName,
        dateOfBirth: payload.verification.person.dateOfBirth,
      } : undefined,
      document: payload.verification?.document ? {
        type: payload.verification.document.type,
        country: payload.verification.document.country,
        // Keep only last 4 chars of number for audit trail
        number: payload.verification.document.number
          ? '****' + payload.verification.document.number.slice(-4)
          : undefined,
      } : undefined,
    },
  };
}
