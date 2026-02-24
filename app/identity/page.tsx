'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useWallet } from '@/components/WalletProvider';
import { formatSupply } from '@/lib/token';
import { useSearchParams } from 'next/navigation';

interface IdentityToken {
  id: string;
  holder_id: string;
  symbol: string;
  token_id: string;
  issuer_address: string;
  total_supply: string;
  decimals: number;
  access_rate: number;
  inscription_data: Record<string, unknown> | null;
  broadcast_txid: string | null;
  broadcast_status: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

interface StrandData {
  id: string;
  identityTokenId: string;
  provider: string;
  providerHandle: string | null;
  providerDisplayName: string | null;
  providerAvatarUrl: string | null;
  providerMetadata: Record<string, unknown>;
  proofHash: string;
  inscriptionData: Record<string, unknown> | null;
  strandTxid: string | null;
  broadcastStatus: string;
  oauthVerifiedAt: string;
  createdAt: string;
}

const PROVIDER_DISPLAY: Record<string, { label: string; color: string }> = {
  github: { label: 'GitHub', color: 'text-white' },
  twitter: { label: 'Twitter', color: 'text-sky-400' },
  google: { label: 'Google', color: 'text-red-400' },
  linkedin: { label: 'LinkedIn', color: 'text-blue-400' },
  discord: { label: 'Discord', color: 'text-indigo-400' },
};

function ProviderIcon({ provider, className }: { provider: string; className?: string }) {
  const cls = className || 'w-5 h-5';
  switch (provider) {
    case 'github':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
        </svg>
      );
    case 'twitter':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      );
    case 'google':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      );
    default:
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2"/>
        </svg>
      );
  }
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    local: 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30',
    pending: 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30',
    confirmed: 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30',
    failed: 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30',
  };
  return (
    <span className={`text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 border ${colors[status] || 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500 border-zinc-300 dark:border-zinc-700'}`}>
      {status}
    </span>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors text-[10px] uppercase tracking-widest"
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function StrandsSection({ strands, onRefresh, configuredProviders }: {
  strands: StrandData[];
  onRefresh: () => void;
  configuredProviders: Set<string>;
}) {
  const [broadcasting, setBroadcasting] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const linkedProviders = new Set(strands.map((s) => s.provider));

  const strengthLevel = strands.length === 0 ? 'none'
    : strands.length === 1 ? 'weak'
    : strands.length === 2 ? 'moderate'
    : strands.length === 3 ? 'strong'
    : 'verified';

  const strengthColors: Record<string, string> = {
    none: 'text-zinc-500',
    weak: 'text-amber-500',
    moderate: 'text-yellow-500',
    strong: 'text-green-500',
    verified: 'text-emerald-400',
  };

  const handleBroadcast = async (strandId: string) => {
    setBroadcasting(strandId);
    try {
      const res = await fetch(`/api/client/strands/${strandId}/broadcast`, { method: 'POST' });
      if (res.ok) {
        onRefresh();
      }
    } finally {
      setBroadcasting(null);
    }
  };

  const handleDelete = async (strandId: string) => {
    setDeleting(strandId);
    try {
      const res = await fetch(`/api/client/strands/${strandId}`, { method: 'DELETE' });
      if (res.ok) {
        onRefresh();
      }
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="mt-6 space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[9px] text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-1">
            Identity Strands // OAuth Proof Chain
          </div>
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-mono font-bold text-zinc-900 dark:text-white uppercase tracking-tight">
              DNA Strands
            </h3>
            <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${strengthColors[strengthLevel]}`}>
              {strands.length} linked &middot; {strengthLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Linked Strands */}
      {strands.length > 0 && (
        <div className="space-y-2">
          {strands.map((strand) => {
            const config = PROVIDER_DISPLAY[strand.provider] || { label: strand.provider, color: 'text-zinc-400' };
            return (
              <div
                key={strand.id}
                className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-900 p-4 flex items-center gap-4"
              >
                <div className={`shrink-0 ${config.color}`}>
                  <ProviderIcon provider={strand.provider} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-bold text-zinc-900 dark:text-white">
                      {config.label}
                    </span>
                    <StatusBadge status={strand.broadcastStatus} />
                  </div>
                  <div className="text-[10px] font-mono text-zinc-500 mt-0.5">
                    @{strand.providerHandle}
                    {strand.providerDisplayName && strand.providerDisplayName !== strand.providerHandle && (
                      <span className="text-zinc-400 dark:text-zinc-600"> &middot; {strand.providerDisplayName}</span>
                    )}
                  </div>
                  <div className="text-[9px] font-mono text-zinc-400 dark:text-zinc-600 mt-0.5">
                    Verified {new Date(strand.oauthVerifiedAt).toLocaleDateString()}
                    {strand.strandTxid && (
                      <>
                        {' '}&middot;{' '}
                        <a
                          href={`https://whatsonchain.com/tx/${strand.strandTxid}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-500 hover:text-indigo-400"
                        >
                          View on-chain
                        </a>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {strand.broadcastStatus === 'local' && (
                    <button
                      onClick={() => handleBroadcast(strand.id)}
                      disabled={broadcasting === strand.id}
                      className="text-[9px] font-mono uppercase tracking-widest px-3 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
                    >
                      {broadcasting === strand.id ? 'Inscribing...' : 'Inscribe'}
                    </button>
                  )}
                  {strand.broadcastStatus === 'pending' && (
                    <span className="text-[9px] font-mono text-blue-500 animate-pulse uppercase tracking-widest">
                      Broadcasting...
                    </span>
                  )}
                  {strand.broadcastStatus === 'failed' && (
                    <button
                      onClick={() => handleBroadcast(strand.id)}
                      disabled={broadcasting === strand.id}
                      className="text-[9px] font-mono uppercase tracking-widest px-3 py-1.5 bg-red-500/20 text-red-500 border border-red-500/30 hover:bg-red-500/30 transition-colors disabled:opacity-50"
                    >
                      Retry
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(strand.id)}
                    disabled={deleting === strand.id}
                    className="text-[9px] font-mono text-zinc-400 hover:text-red-500 transition-colors uppercase tracking-widest disabled:opacity-50"
                  >
                    {deleting === strand.id ? '...' : 'Unlink'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Strand Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
        {Object.entries(PROVIDER_DISPLAY).map(([provider, display]) => {
          const isLinked = linkedProviders.has(provider);
          if (isLinked) return null;
          const isConfigured = configuredProviders.has(provider);

          return (
            <a
              key={provider}
              href={isConfigured ? `/api/auth/strand/${provider}` : undefined}
              className={`flex items-center gap-2 p-3 border font-mono text-xs uppercase tracking-widest transition-all ${
                isConfigured
                  ? 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black hover:border-zinc-400 dark:hover:border-zinc-600 text-zinc-900 dark:text-white cursor-pointer'
                  : 'border-zinc-100 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950 text-zinc-300 dark:text-zinc-700 cursor-not-allowed'
              }`}
            >
              <ProviderIcon provider={provider} className="w-4 h-4" />
              <span>{display.label}</span>
              {!isConfigured && (
                <span className="text-[8px] text-zinc-400 dark:text-zinc-600 ml-auto">Soon</span>
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
}

function PreMintView({ onMint, isMinting, mintError }: {
  onMint: (symbol: string) => void;
  isMinting: boolean;
  mintError: string | null;
}) {
  const [symbolInput, setSymbolInput] = useState('');

  const rawName = symbolInput.replace(/^\$/, '').toUpperCase();
  const preview = rawName ? `$${rawName}` : '';
  const isValid = rawName.length >= 1 && rawName.length <= 20 && /^[A-Z0-9_]+$/.test(rawName);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-8 flex flex-col justify-between min-h-[400px]">
        <div>
          <h3 className="text-xl font-mono font-bold text-zinc-900 dark:text-white uppercase tracking-tight mb-1">
            Mint Digital DNA
          </h3>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-6">
            Resolve 401 — deploy your identity token on BSV
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-[9px] text-zinc-400 dark:text-zinc-600 uppercase tracking-widest block mb-2">
                Symbol
              </label>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-mono font-bold text-zinc-400 dark:text-zinc-600">$</span>
                <input
                  type="text"
                  value={symbolInput}
                  onChange={(e) => setSymbolInput(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '').slice(0, 20))}
                  placeholder="YOURNAME"
                  className="flex-1 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 px-4 py-3 font-mono text-xl text-zinc-900 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-700 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
                  disabled={isMinting}
                />
              </div>
              {preview && (
                <div className="mt-2 text-sm font-mono text-indigo-600 dark:text-indigo-400">
                  {preview}
                </div>
              )}
              {symbolInput && !isValid && (
                <div className="mt-2 text-xs font-mono text-green-500">
                  A-Z, 0-9, _ only. 1-20 characters.
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-3">
                <div className="text-[9px] text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-1">Supply</div>
                <div className="text-sm text-zinc-900 dark:text-white font-mono font-bold">1,000,000,000</div>
              </div>
              <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-3">
                <div className="text-[9px] text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-1">Decimals</div>
                <div className="text-sm text-zinc-900 dark:text-white font-mono font-bold">8</div>
              </div>
              <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-3">
                <div className="text-[9px] text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-1">Rate</div>
                <div className="text-sm text-zinc-900 dark:text-white font-mono font-bold">1 tok/sec</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          {mintError && (
            <div className="mb-3 text-xs font-mono text-green-500 bg-green-500/10 border border-green-500/20 p-2">
              {mintError}
            </div>
          )}
          <button
            onClick={() => onMint(preview)}
            disabled={!isValid || isMinting}
            className={`w-full py-4 font-mono font-bold uppercase text-sm tracking-widest transition-all ${
              !isValid || isMinting
                ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed'
                : 'bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-700 dark:hover:bg-zinc-200'
            }`}
          >
            {isMinting ? 'Inscribing Genesis...' : 'Mint Digital DNA'}
          </button>
          <p className="text-center text-[9px] text-zinc-400 dark:text-zinc-600 mt-3 font-mono uppercase tracking-widest">
            BSV21 inscription stored in Supabase &middot; broadcast when wallet ready
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-900 p-6 flex items-start gap-4">
          <div className="w-5 h-5 mt-1 shrink-0 text-yellow-500">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          </div>
          <div>
            <h4 className="text-zinc-900 dark:text-white font-mono font-bold uppercase mb-2">Video P2P Fuel</h4>
            <p className="text-zinc-500 text-xs font-mono leading-relaxed">
              Tokens stream second-by-second during video calls.
              Both peers exchange tokens — 1 token/sec each direction.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-900 p-6 flex items-start gap-4">
          <div className="w-5 h-5 mt-1 shrink-0 text-zinc-500">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          </div>
          <div>
            <h4 className="text-zinc-900 dark:text-white font-mono font-bold uppercase mb-2">Access Control</h4>
            <p className="text-zinc-500 text-xs font-mono leading-relaxed">
              Set minimum token balance for peers to contact you.
              Raise your price to avoid spam.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-900 p-6 flex items-start gap-4">
          <div className="w-5 h-5 mt-1 shrink-0 text-zinc-500">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
          </div>
          <div>
            <h4 className="text-zinc-900 dark:text-white font-mono font-bold uppercase mb-2">Cloud Custody</h4>
            <p className="text-zinc-500 text-xs font-mono leading-relaxed">
              Identity token stored in Supabase.
              Broadcast to BSV when your wallet is ready.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PostMintView({ identity, strands, onRefreshStrands, configuredProviders }: {
  identity: IdentityToken;
  strands: StrandData[];
  onRefreshStrands: () => void;
  configuredProviders: Set<string>;
}) {
  return (
    <div className="mt-8 space-y-6">
      {/* Identity Header */}
      <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-mono font-bold text-zinc-900 dark:text-white">{identity.symbol}</h2>
              <StatusBadge status={identity.broadcast_status} />
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
              <span>Token ID: {identity.token_id.slice(0, 16)}...{identity.token_id.slice(-8)}</span>
              <CopyButton text={identity.token_id} />
            </div>
            {identity.issuer_address && (
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 dark:text-zinc-600 mt-1">
                <span>Issuer: {identity.issuer_address.slice(0, 20)}...</span>
                <CopyButton text={identity.issuer_address} />
              </div>
            )}
          </div>

          <div className="text-right">
            <div className="text-[9px] text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-1">Total Supply</div>
            <div className="text-2xl font-mono font-bold text-zinc-900 dark:text-white">
              {formatSupply(identity.total_supply, identity.decimals)}
            </div>
            <div className="text-[10px] font-mono text-zinc-500">
              {identity.decimals} decimals &middot; {identity.access_rate} tok/sec
            </div>
          </div>
        </div>
      </div>

      {/* Info Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-900 p-4">
          <div className="text-[9px] text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-1">Balance</div>
          <div className="text-xl font-mono font-bold text-zinc-900 dark:text-white">
            {formatSupply(identity.total_supply, identity.decimals)}
          </div>
        </div>
        <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-900 p-4">
          <div className="text-[9px] text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-1">Broadcast</div>
          <div className="text-sm font-mono text-zinc-900 dark:text-white mt-1">
            {identity.broadcast_txid ? (
              <span className="flex items-center gap-2">
                {identity.broadcast_txid.slice(0, 16)}...
                <CopyButton text={identity.broadcast_txid} />
              </span>
            ) : (
              <span className="text-zinc-400 dark:text-zinc-600">Not broadcast yet</span>
            )}
          </div>
        </div>
        <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-900 p-4">
          <div className="text-[9px] text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-1">Created</div>
          <div className="text-sm font-mono text-zinc-900 dark:text-white mt-1">
            {new Date(identity.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Strands Section */}
      <StrandsSection strands={strands} onRefresh={onRefreshStrands} configuredProviders={configuredProviders} />

      {/* Inscription Data */}
      {identity.inscription_data && (
        <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-900 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[9px] text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">BSV21 Inscription</div>
            <CopyButton text={JSON.stringify(identity.inscription_data, null, 2)} />
          </div>
          <pre className="text-xs font-mono text-zinc-500 overflow-x-auto whitespace-pre-wrap break-all max-h-40 overflow-y-auto">
            {JSON.stringify(identity.inscription_data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

function IdentityPageInner() {
  const { wallet, connectHandCash } = useWallet();
  const searchParams = useSearchParams();
  const [identity, setIdentity] = useState<IdentityToken | null>(null);
  const [strands, setStrands] = useState<StrandData[]>([]);
  const [configuredProviders, setConfiguredProviders] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [isMinting, setIsMinting] = useState(false);
  const [mintError, setMintError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchIdentity = useCallback(async () => {
    try {
      const res = await fetch('/api/client/identity');
      const data = await res.json();
      setIdentity(data.identity);
    } catch {
      // Identity not found
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStrands = useCallback(async () => {
    try {
      const res = await fetch('/api/client/strands');
      if (res.ok) {
        const data = await res.json();
        setStrands(data.strands || []);
      }
    } catch {
      // Strands not available
    }
  }, []);

  const fetchProviders = useCallback(async () => {
    try {
      const res = await fetch('/api/client/strands/providers');
      if (res.ok) {
        const data = await res.json();
        const configured = new Set<string>(
          (data.providers || [])
            .filter((p: { configured: boolean }) => p.configured)
            .map((p: { id: string }) => p.id)
        );
        setConfiguredProviders(configured);
      }
    } catch {
      // Providers not available
    }
  }, []);

  useEffect(() => {
    if (wallet.connected) {
      fetchIdentity();
      fetchStrands();
      fetchProviders();
    } else {
      setLoading(false);
    }
  }, [wallet.connected, fetchIdentity, fetchStrands, fetchProviders]);

  // Handle strand success/error query params
  useEffect(() => {
    const strandParam = searchParams.get('strand');
    const success = searchParams.get('success');
    const error = searchParams.get('error');

    if (strandParam && success === 'true') {
      setToast({ message: `${strandParam} strand linked successfully`, type: 'success' });
      fetchStrands();
      // Clean URL
      window.history.replaceState({}, '', '/identity');
    } else if (error === 'strand_exists') {
      const provider = searchParams.get('provider') || 'Provider';
      setToast({ message: `${provider} strand already linked`, type: 'error' });
      window.history.replaceState({}, '', '/identity');
    } else if (error) {
      setToast({ message: `Strand linking failed: ${error.replace(/_/g, ' ')}`, type: 'error' });
      window.history.replaceState({}, '', '/identity');
    }
  }, [searchParams, fetchStrands]);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleMint = async (symbol: string) => {
    setIsMinting(true);
    setMintError(null);
    try {
      const res = await fetch('/api/client/identity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMintError(data.error || 'Mint failed');
        return;
      }
      setIdentity(data.identity);
    } catch {
      setMintError('Network error');
    } finally {
      setIsMinting(false);
    }
  };

  if (!wallet.connected) {
    return (
      <div className="min-h-screen bg-white dark:bg-black pt-20 px-6 md:px-16">
        <div className="max-w-[1920px] mx-auto text-center">
          <h1 className="text-2xl font-mono font-bold text-zinc-900 dark:text-white uppercase tracking-tight mb-4">
            Digital DNA
          </h1>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-[10px] uppercase tracking-widest text-zinc-500 mb-6">
            HTTP_401: UNAUTHORIZED
          </div>
          <p className="text-zinc-500 text-sm mb-8">
            Connect your wallet to prove your identity.
          </p>
          <button
            onClick={connectHandCash}
            className="px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest text-xs hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black pt-20 px-6 md:px-16">
        <div className="max-w-[1920px] mx-auto">
          <div className="text-zinc-500 text-sm font-mono animate-pulse">Loading identity...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-20 px-6 md:px-16 pb-20">
      <div className="max-w-[1920px] mx-auto">
        {/* Toast */}
        {toast && (
          <div className={`fixed top-4 right-4 z-50 px-4 py-3 font-mono text-xs uppercase tracking-widest border ${
            toast.type === 'success'
              ? 'bg-green-500/10 text-green-500 border-green-500/30'
              : 'bg-red-500/10 text-red-500 border-red-500/30'
          }`}>
            {toast.message}
          </div>
        )}

        <div className="mb-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-[10px] uppercase tracking-widest text-zinc-500 mb-4">
            HTTP_401: IDENTITY_REQUIRED
          </div>
          <div className="text-[10px] text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-1">
            Identity Token // Self-Sovereign Issuance
          </div>
          <h1 className="text-3xl font-mono font-bold text-zinc-900 dark:text-white uppercase tracking-tight">
            DIGITAL DNA<span className="text-zinc-300 dark:text-zinc-700">.ID</span>
          </h1>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-2">
            1B SUPPLY // 8 DECIMALS // 1 TOK/SEC // BSV21
          </p>
        </div>

        {identity ? (
          <PostMintView identity={identity} strands={strands} onRefreshStrands={fetchStrands} configuredProviders={configuredProviders} />
        ) : (
          <PreMintView onMint={handleMint} isMinting={isMinting} mintError={mintError} />
        )}
      </div>
    </div>
  );
}

export default function IdentityPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-black pt-20 px-6 md:px-16">
        <div className="max-w-[1920px] mx-auto">
          <div className="text-zinc-500 text-sm font-mono animate-pulse">Loading identity...</div>
        </div>
      </div>
    }>
      <IdentityPageInner />
    </Suspense>
  );
}
