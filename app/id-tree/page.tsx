'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

// ─── Animation variants (match 401 page) ───
const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.8, delay, ease }
  })
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay: number) => ({
    opacity: 1,
    transition: { duration: 0.6, delay }
  })
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (delay: number) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.7, delay, ease }
  })
};

// ─── Node types ───
type NodeId = 'root' | 'github' | 'twitter' | 'google' | 'att-b0ase' | 'att-self-gh' | 'att-x' | 'att-self-x' | 'att-google' | 'att-self-g' | 'economic' | 'path402' | 'path403' | 'key-rotate' | 'key-revoke';

interface TreeNode {
  id: NodeId;
  label: string;
  sublabel?: string;
  color: string;
  borderColor: string;
  glowColor: string;
  shape: 'square' | 'pill';
  size: 'lg' | 'md' | 'sm';
}

const NODES: Record<NodeId, TreeNode> = {
  root: { id: 'root', label: 'ROOT KEY', sublabel: 'self-signed', color: 'bg-green-500/10', borderColor: 'border-green-500', glowColor: 'shadow-green-500/20', shape: 'square', size: 'lg' },
  github: { id: 'github', label: 'STRAND', sublabel: 'GitHub', color: 'bg-amber-500/10', borderColor: 'border-amber-500', glowColor: 'shadow-amber-500/20', shape: 'square', size: 'md' },
  twitter: { id: 'twitter', label: 'STRAND', sublabel: 'Twitter', color: 'bg-amber-500/10', borderColor: 'border-amber-500', glowColor: 'shadow-amber-500/20', shape: 'square', size: 'md' },
  google: { id: 'google', label: 'STRAND', sublabel: 'Google', color: 'bg-amber-500/10', borderColor: 'border-amber-500', glowColor: 'shadow-amber-500/20', shape: 'square', size: 'md' },
  'att-b0ase': { id: 'att-b0ase', label: 'b0ase.com', sublabel: 'service', color: 'bg-zinc-500/10', borderColor: 'border-zinc-600', glowColor: 'shadow-zinc-500/10', shape: 'pill', size: 'sm' },
  'att-self-gh': { id: 'att-self-gh', label: 'self', sublabel: 'attestor', color: 'bg-green-500/10', borderColor: 'border-green-500', glowColor: 'shadow-green-500/20', shape: 'pill', size: 'sm' },
  'att-x': { id: 'att-x', label: 'x.com', sublabel: 'service', color: 'bg-zinc-500/10', borderColor: 'border-zinc-600', glowColor: 'shadow-zinc-500/10', shape: 'pill', size: 'sm' },
  'att-self-x': { id: 'att-self-x', label: 'self', sublabel: 'attestor', color: 'bg-green-500/10', borderColor: 'border-green-500', glowColor: 'shadow-green-500/20', shape: 'pill', size: 'sm' },
  'att-google': { id: 'att-google', label: 'google', sublabel: 'service', color: 'bg-zinc-500/10', borderColor: 'border-zinc-600', glowColor: 'shadow-zinc-500/10', shape: 'pill', size: 'sm' },
  'att-self-g': { id: 'att-self-g', label: 'self', sublabel: 'attestor', color: 'bg-green-500/10', borderColor: 'border-green-500', glowColor: 'shadow-green-500/20', shape: 'pill', size: 'sm' },
  economic: { id: 'economic', label: 'ECONOMIC', sublabel: 'layer', color: 'bg-yellow-500/10', borderColor: 'border-yellow-500/60', glowColor: 'shadow-yellow-500/10', shape: 'square', size: 'md' },
  path402: { id: 'path402', label: '$402', sublabel: 'payment paths', color: 'bg-yellow-500/10', borderColor: 'border-yellow-500', glowColor: 'shadow-yellow-500/20', shape: 'square', size: 'sm' },
  path403: { id: 'path403', label: '$403', sublabel: 'conditions', color: 'bg-purple-500/10', borderColor: 'border-purple-500', glowColor: 'shadow-purple-500/20', shape: 'square', size: 'sm' },
  'key-rotate': { id: 'key-rotate', label: 'ROTATE', sublabel: 'key op', color: 'bg-green-500/5', borderColor: 'border-green-300/40', glowColor: 'shadow-green-300/10', shape: 'pill', size: 'sm' },
  'key-revoke': { id: 'key-revoke', label: 'REVOKE', sublabel: 'key op', color: 'bg-green-500/5', borderColor: 'border-green-300/40', glowColor: 'shadow-green-300/10', shape: 'pill', size: 'sm' },
};

// ─── Detail content ───
const DETAILS: Record<NodeId, { title: string; body: string[] }> = {
  root: {
    title: 'Root Key — The Anchor',
    body: [
      'Your BSV private key. Created at bit-sign.online or any BSV wallet. This is the cryptographic anchor of your entire identity.',
      'The root key signs everything: strands, attestations, key rotations. Whoever holds this key IS the identity.',
      'Self-signed means you created it, you control it, no service was involved. This is the strongest form of digital identity.',
    ],
  },
  github: {
    title: 'GitHub Strand',
    body: [
      'Proves you controlled a GitHub account at a point in time. The strand inscribes: provider (github), handle, SHA-256 of the OAuth token, and a timestamp.',
      'Once inscribed on-chain, it\'s permanent. Even if you lose access to the GitHub account later, the strand proves you had it.',
      'Multiple attestors can sign the same strand to increase confidence.',
    ],
  },
  twitter: {
    title: 'Twitter Strand',
    body: [
      'Proves you controlled a Twitter/X account at a point in time. Same inscription pattern: provider, handle, OAuth hash, timestamp.',
      'Twitter strands are especially powerful for reputation — your follower graph becomes a verifiable part of your identity.',
      'The strand is permanent even if Twitter changes its API or bans your account.',
    ],
  },
  google: {
    title: 'Google Strand',
    body: [
      'Proves you controlled a Google account (email) at a point in time. Useful for professional identity — links to your workspace, calendar, drive.',
      'Google strands can reference specific permissions you had: admin access, org membership, workspace domain.',
      'Like all strands, it\'s a snapshot — the proof exists even if Google revokes the OAuth token later.',
    ],
  },
  'att-b0ase': {
    title: 'Service Attestor: b0ase.com',
    body: [
      'b0ase.com acts as an attestation service — it verifies you completed the OAuth flow and signs the strand with its own key.',
      'This is NOT self-sovereign. b0ase is a trusted third party here. The strand is real, but the signature comes from b0ase\'s key, not yours.',
      'Stronger: get multiple attestors. Even stronger: self-sign with your own root key (true self-sovereignty).',
    ],
  },
  'att-self-gh': {
    title: 'Self Attestor',
    body: [
      'You sign the strand yourself with your root key. No service involved. This is the strongest form of attestation.',
      'Self-attestation means: "I personally verified this OAuth flow and I sign it with the same key that anchors my identity."',
      'Combined with a service attestor, you get both: third-party verification AND personal commitment.',
    ],
  },
  'att-x': {
    title: 'Service Attestor: x.com',
    body: [
      'Twitter/X itself could attest your strand — confirming you completed their OAuth flow.',
      'Currently b0ase.com acts as the intermediary. In the future, any OAuth provider could sign strands directly.',
      'The more attestors on a strand, the higher the confidence level.',
    ],
  },
  'att-self-x': {
    title: 'Self Attestor',
    body: [
      'Self-signing your Twitter strand. You vouch for the verification with your root key.',
      'This is the gold standard — your identity, your verification, your signature.',
    ],
  },
  'att-google': {
    title: 'Service Attestor: Google',
    body: [
      'Google confirming your OAuth verification. Higher trust than a third-party service signing on Google\'s behalf.',
      'In the $401 model, any service can be an attestor. The protocol is open — attestation is not gated.',
    ],
  },
  'att-self-g': {
    title: 'Self Attestor',
    body: [
      'Self-signing your Google strand. Combined with Google\'s own attestation, this creates maximum confidence.',
    ],
  },
  economic: {
    title: 'Economic Layer',
    body: [
      'Your identity tree connects to the economic protocol. $402 handles payment flows, $403 handles programmable conditions.',
      'Identity enables economics: your root key has a payTo address, verified strands unlock staking and dividends, identity strength determines access levels.',
      'Without $401, you can still browse and pay. With $401, you can earn, stake, and own.',
    ],
  },
  path402: {
    title: '$402 — Payment Paths',
    body: [
      'Your root key\'s payTo address is where revenue flows. Verified identity required for staking and dividends.',
      'Identity strength determines access: more strands = more attestors = higher trust = more economic opportunity.',
      '$402 tokens (access, content, API) all check your $401 for authorization levels.',
    ],
  },
  path403: {
    title: '$403 — Conditions Machine',
    body: [
      'Programmable rules that reference your identity graph. "Pay only if 3+ strands verified." "Unlock if GitHub attested." "Premium tier if followers > 100."',
      '$403 is designed but not yet coded. It will be the conditional logic layer that ties identity to smart behaviour.',
      'Conditions can compose: $401 identity checks + $402 payment checks + arbitrary rules.',
    ],
  },
  'key-rotate': {
    title: 'Key Rotation',
    body: [
      'Delegate your identity to a new key. The old key signs the handover transaction, proving continuity.',
      'Key rotation is essential for security — if your key is compromised, rotate to a new one without losing your identity.',
      'The rotation is inscribed on-chain: old key signs "I delegate to new key". New key inherits all strands and attestations.',
    ],
  },
  'key-revoke': {
    title: 'Key Revocation',
    body: [
      'Nuclear option — invalidate the root key entirely. All strands and attestations become orphaned.',
      'Use only in emergencies: key definitely compromised, no recovery possible.',
      'Revocation is permanent and irreversible. You would need to create a completely new identity tree.',
    ],
  },
};

// ─── Sovereignty Spectrum ───
const SPECTRUM = [
  {
    level: 'Self-Sovereign',
    desc: 'User signs root with own key',
    example: 'bit-sign.online',
    strength: 'STRONGEST',
    strengthColor: 'text-green-400',
    barColor: 'bg-green-500',
    barWidth: 'w-full',
  },
  {
    level: 'Self-Attested',
    desc: 'User signs strand with own key',
    example: 'any BSV wallet',
    strength: 'STRONG',
    strengthColor: 'text-green-300',
    barColor: 'bg-green-400',
    barWidth: 'w-3/4',
  },
  {
    level: 'Service-Attested',
    desc: 'Service signs strand with service key',
    example: 'b0ase.com, x.com',
    strength: 'MODERATE',
    strengthColor: 'text-amber-400',
    barColor: 'bg-amber-500',
    barWidth: 'w-1/2',
  },
  {
    level: 'Custodial',
    desc: 'Service signs root with service key',
    example: 'hosted wallets',
    strength: 'WEAKEST',
    strengthColor: 'text-green-400',
    barColor: 'bg-green-500',
    barWidth: 'w-1/4',
  },
];

// ─── Node component ───
function Node({ node, onClick, isSelected }: { node: TreeNode; onClick: () => void; isSelected: boolean }) {
  const sizeClasses = {
    lg: 'w-28 h-16 md:w-40 md:h-24',
    md: 'w-24 h-14 md:w-32 md:h-20',
    sm: 'w-20 h-11 md:w-24 md:h-14',
  };
  const shape = node.shape === 'pill' ? 'rounded-full' : 'rounded-lg';
  const dashed = node.id === 'key-rotate' || node.id === 'key-revoke' ? 'border-dashed' : '';

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.97 }}
      className={`
        ${sizeClasses[node.size]} ${shape} ${node.color} ${dashed}
        border ${node.borderColor}
        flex flex-col items-center justify-center gap-0.5
        cursor-pointer transition-shadow duration-300 shrink-0
        ${isSelected ? `shadow-lg ${node.glowColor} ring-1 ring-white/20` : 'hover:shadow-md'}
      `}
    >
      <span className="text-[9px] md:text-[10px] font-display font-bold tracking-wider uppercase text-white/90">
        {node.label}
      </span>
      {node.sublabel && (
        <span className="text-[7px] md:text-[8px] font-mono text-zinc-500 uppercase tracking-widest">
          {node.sublabel}
        </span>
      )}
    </motion.button>
  );
}

// ─── Vertical connector (CSS line) ───
function VLine({ color = 'bg-green-500/20', height = 'h-8' }: { color?: string; height?: string }) {
  return <div className={`w-px ${height} ${color} mx-auto relative overflow-hidden`}>
    <div className="absolute inset-0 w-full animate-pulse opacity-60" style={{ background: 'linear-gradient(to bottom, transparent, currentColor, transparent)', animationDuration: '3s' }} />
  </div>;
}

// ─── Branch connector (splits 1 → N) ───
function Branch({ color = 'border-green-500/20', count = 3 }: { color?: string; count?: number }) {
  return (
    <div className="flex items-start justify-center">
      <div className={`flex border-b ${color}`} style={{ width: count > 2 ? '60%' : '30%' }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={`flex-1 border-l ${i === count - 1 ? `border-r ${color}` : ''} ${color} h-4`} />
        ))}
      </div>
    </div>
  );
}

// ─── Merge connector (N → 1) ───
function Merge({ color = 'border-yellow-500/20', count = 3 }: { color?: string; count?: number }) {
  return (
    <div className="flex items-end justify-center">
      <div className={`flex border-t ${color}`} style={{ width: count > 2 ? '60%' : '30%' }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={`flex-1 border-l ${i === count - 1 ? `border-r ${color}` : ''} ${color} h-4`} />
        ))}
      </div>
    </div>
  );
}

export default function IdTreePage() {
  const [selected, setSelected] = useState<NodeId | null>(null);

  const toggle = (id: NodeId) => setSelected(prev => prev === id ? null : id);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white">

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[50vh] flex flex-col justify-center overflow-hidden bg-black">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(34, 197, 94, 0.8) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px]"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(34, 197, 94, 0.08) 0%, rgba(34, 197, 94, 0.02) 35%, transparent 70%)',
            }}
          />
        </div>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
          }}
        />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-green-500/10" />
          <div className="absolute top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-green-500/10" />
          <div className="absolute bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-green-500/10" />
          <div className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-green-500/10" />
          <div className="absolute top-8 left-20 text-[7px] font-mono text-zinc-700 tracking-[0.25em]">
            $401 IDENTITY TREE
          </div>
          <div className="absolute bottom-8 left-20 text-[7px] font-mono text-zinc-700 tracking-[0.25em]">
            SELF-SOVEREIGN IDENTITY SCHEMA
          </div>
        </div>

        <div className="relative z-10 px-6 md:px-16 max-w-[1920px] mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-zinc-600 text-[10px] tracking-[0.3em] uppercase font-mono font-bold">
              $401 : IDENTITY PROTOCOL &mdash; VISUAL EXPLORER
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            className="font-display font-black tracking-tighter leading-[0.85] mb-2"
            style={{
              fontSize: 'clamp(3rem, 10vw, 10rem)',
              textShadow: '0 0 10px rgba(34, 197, 94, 0.4), 0 0 30px rgba(34, 197, 94, 0.2), 0 0 60px rgba(34, 197, 94, 0.1)',
            }}
          >
            <span className="text-white">ID TREE</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-zinc-500 max-w-xl text-sm leading-relaxed mb-8 font-mono"
          >
            Your identity is a tree. The root is yours. Everything else branches from it.
          </motion.p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />
      </section>

      {/* ═══ INTERACTIVE TREE ═══ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="border-b border-zinc-200 dark:border-zinc-900"
      >
        <div className="max-w-[1920px] mx-auto px-6 md:px-16 py-16">
          <motion.div custom={0} variants={fadeIn} className="section-label">
            Identity Schema
          </motion.div>

          <motion.div
            custom={0.1}
            variants={scaleIn}
            className="relative border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 overflow-hidden"
          >
            {/* Background grid */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.015] dark:opacity-[0.04]"
              style={{
                backgroundImage: 'linear-gradient(rgba(128,128,128,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(128,128,128,0.3) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />

            <div className="relative py-10 md:py-14 px-4 md:px-8">

              {/* Row 0: Root Key + Key Operations */}
              <div className="flex items-center justify-center gap-6 md:gap-10">
                <Node node={NODES.root} onClick={() => toggle('root')} isSelected={selected === 'root'} />
                <div className="hidden md:flex items-center gap-2 opacity-60">
                  <div className="w-8 h-px bg-green-300/20 border-t border-dashed border-green-300/30" />
                  <Node node={NODES['key-rotate']} onClick={() => toggle('key-rotate')} isSelected={selected === 'key-rotate'} />
                  <Node node={NODES['key-revoke']} onClick={() => toggle('key-revoke')} isSelected={selected === 'key-revoke'} />
                </div>
              </div>

              {/* Connector: Root → 3 Strands */}
              <VLine color="bg-green-500/20" height="h-6" />
              <Branch color="border-green-500/20" count={3} />

              {/* Row 1: Strands */}
              <div className="flex justify-center gap-6 md:gap-24 lg:gap-32 mt-1">
                <Node node={NODES.github} onClick={() => toggle('github')} isSelected={selected === 'github'} />
                <Node node={NODES.twitter} onClick={() => toggle('twitter')} isSelected={selected === 'twitter'} />
                <Node node={NODES.google} onClick={() => toggle('google')} isSelected={selected === 'google'} />
              </div>

              {/* Connectors: Strands → Attestors */}
              <div className="flex justify-center gap-6 md:gap-24 lg:gap-32 mt-1">
                <div className="w-24 md:w-32"><VLine color="bg-amber-500/20" height="h-5" /></div>
                <div className="w-24 md:w-32"><VLine color="bg-amber-500/20" height="h-5" /></div>
                <div className="w-24 md:w-32"><VLine color="bg-amber-500/20" height="h-5" /></div>
              </div>

              {/* Row 2: Attestors */}
              <div className="flex justify-center gap-4 md:gap-16 lg:gap-24">
                <div className="flex gap-1.5 md:gap-2">
                  <Node node={NODES['att-b0ase']} onClick={() => toggle('att-b0ase')} isSelected={selected === 'att-b0ase'} />
                  <Node node={NODES['att-self-gh']} onClick={() => toggle('att-self-gh')} isSelected={selected === 'att-self-gh'} />
                </div>
                <div className="flex gap-1.5 md:gap-2">
                  <Node node={NODES['att-x']} onClick={() => toggle('att-x')} isSelected={selected === 'att-x'} />
                  <Node node={NODES['att-self-x']} onClick={() => toggle('att-self-x')} isSelected={selected === 'att-self-x'} />
                </div>
                <div className="flex gap-1.5 md:gap-2">
                  <Node node={NODES['att-google']} onClick={() => toggle('att-google')} isSelected={selected === 'att-google'} />
                  <Node node={NODES['att-self-g']} onClick={() => toggle('att-self-g')} isSelected={selected === 'att-self-g'} />
                </div>
              </div>

              {/* Connector: Attestors → Economic */}
              <Merge color="border-yellow-500/20" count={3} />
              <VLine color="bg-yellow-500/20" height="h-6" />

              {/* Row 3: Economic Layer */}
              <div className="flex justify-center">
                <Node node={NODES.economic} onClick={() => toggle('economic')} isSelected={selected === 'economic'} />
              </div>

              {/* Connector: Economic → $402 + $403 */}
              <VLine color="bg-yellow-500/15" height="h-5" />
              <Branch color="border-yellow-500/15" count={2} />

              {/* Row 4: $402 and $403 */}
              <div className="flex justify-center gap-6 md:gap-10 mt-1">
                <Node node={NODES.path402} onClick={() => toggle('path402')} isSelected={selected === 'path402'} />
                <Node node={NODES.path403} onClick={() => toggle('path403')} isSelected={selected === 'path403'} />
              </div>

              {/* Mobile key ops (shown below tree on small screens) */}
              <div className="md:hidden mt-6 flex justify-center gap-2">
                <Node node={NODES['key-rotate']} onClick={() => toggle('key-rotate')} isSelected={selected === 'key-rotate'} />
                <Node node={NODES['key-revoke']} onClick={() => toggle('key-revoke')} isSelected={selected === 'key-revoke'} />
              </div>

              {/* Hint */}
              {!selected && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2, duration: 0.8 }}
                  className="text-center mt-8 text-[9px] font-mono text-zinc-600 uppercase tracking-widest"
                >
                  Click any node to explore
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* ── Detail Panel ── */}
          <AnimatePresence mode="wait">
            {selected && DETAILS[selected] && (
              <motion.div
                key={selected}
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.4, ease }}
                className="overflow-hidden"
              >
                <div className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-6 md:p-10">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-display font-black tracking-tight uppercase">
                      {DETAILS[selected].title}
                    </h3>
                    <button
                      onClick={() => setSelected(null)}
                      className="text-zinc-500 hover:text-white text-xs font-mono uppercase tracking-widest transition-colors"
                    >
                      Close
                    </button>
                  </div>
                  <div className="space-y-3">
                    {DETAILS[selected].body.map((para, i) => (
                      <p key={i} className="text-zinc-500 text-sm leading-relaxed font-mono">
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* ═══ SOVEREIGNTY SPECTRUM ═══ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="border-b border-zinc-200 dark:border-zinc-900"
      >
        <div className="max-w-[1920px] mx-auto px-6 md:px-16 py-16">
          <motion.div custom={0} variants={fadeIn} className="section-label">
            Who Signs What &mdash; The Sovereignty Spectrum
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border border-zinc-200 dark:border-zinc-800">
            {SPECTRUM.map((item, i) => (
              <motion.div
                key={item.level}
                custom={0.1 + i * 0.1}
                variants={fadeUp}
                className={`p-6 md:p-8 ${
                  i < 3 ? 'border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800' : ''
                }`}
              >
                <div className={`text-[9px] font-mono font-bold uppercase tracking-widest mb-3 ${item.strengthColor}`}>
                  {item.strength}
                </div>
                <h3 className="text-sm font-black uppercase tracking-wider mb-2">{item.level}</h3>
                <p className="text-zinc-500 text-xs leading-relaxed mb-3">{item.desc}</p>
                <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-900 rounded-full overflow-hidden mb-2">
                  <div className={`h-full ${item.barColor} ${item.barWidth} rounded-full`} />
                </div>
                <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">
                  {item.example}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.div custom={0.6} variants={fadeIn} className="mt-4 border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="text-amber-400 text-xs font-mono leading-relaxed">
              <span className="font-bold uppercase tracking-widest">Honest note:</span> b0ase.com currently operates at the &ldquo;Service-Attested&rdquo; level.
              We sign strands with our key after verifying your OAuth flow. True self-sovereignty requires you to sign with your own root key via bit-sign.online.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* ═══ $401 → $402 / $403 ═══ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="border-b border-zinc-200 dark:border-zinc-900"
      >
        <div className="max-w-[1920px] mx-auto px-6 md:px-16 py-16">
          <motion.div custom={0} variants={fadeIn} className="section-label">
            Identity Enables Economics
          </motion.div>

          <div className="grid md:grid-cols-2 gap-0 border border-zinc-200 dark:border-zinc-800">
            <motion.div custom={0.1} variants={fadeUp} className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800">
              <h3 className="text-lg font-display font-black tracking-tight mb-1 uppercase">
                $401 <span className="text-yellow-500">&rarr;</span> $402
              </h3>
              <div className="text-[9px] text-yellow-500 font-mono uppercase tracking-[0.2em] mb-6">
                Identity enables Payment
              </div>
              <div className="space-y-4">
                {[
                  ['payTo', 'Root key has a payout address — revenue flows here automatically'],
                  ['Staking', 'Verified identity required for staking $402 tokens and receiving dividends'],
                  ['Access', 'Identity strength (strand count + attestor count) determines access levels'],
                  ['Trust', 'More strands = higher trust = more economic opportunity'],
                ].map(([label, desc]) => (
                  <div key={label} className="flex gap-4">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-yellow-500 w-16 shrink-0 pt-0.5">{label}</span>
                    <span className="text-sm text-zinc-500">{desc}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 mt-6 text-xs font-mono font-bold text-yellow-500 uppercase tracking-widest hover:text-yellow-400 transition-colors"
              >
                path402.com &rarr;
              </Link>
            </motion.div>

            <motion.div custom={0.2} variants={fadeUp} className="p-8 md:p-10">
              <h3 className="text-lg font-display font-black tracking-tight mb-1 uppercase">
                $401 <span className="text-purple-500">&rarr;</span> $403
              </h3>
              <div className="text-[9px] text-purple-500 font-mono uppercase tracking-[0.2em] mb-6">
                Identity enables Conditions
              </div>
              <div className="space-y-4">
                {[
                  ['Rules', 'Conditions reference identity strands: "pay only if 3+ strands verified"'],
                  ['Gates', '"Unlock if GitHub attested" — programmable access based on identity graph'],
                  ['Tiers', '"Premium tier if followers > 100" — social proof as access control'],
                  ['Compose', '$401 identity + $402 payment + arbitrary rules = smart behaviour'],
                ].map(([label, desc]) => (
                  <div key={label} className="flex gap-4">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-purple-500 w-16 shrink-0 pt-0.5">{label}</span>
                    <span className="text-sm text-zinc-500">{desc}</span>
                  </div>
                ))}
              </div>
              <span className="inline-flex items-center gap-2 mt-6 text-xs font-mono font-bold text-zinc-600 uppercase tracking-widest">
                path403.com &mdash; designed, not yet built
              </span>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ═══ CTA ═══ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="py-24"
      >
        <div className="max-w-[1920px] mx-auto px-6 md:px-16 text-center">
          <motion.h2
            custom={0.1}
            variants={fadeUp}
            className="text-3xl md:text-5xl font-display font-black tracking-tighter mb-6"
          >
            YOUR IDENTITY<br />
            <span className="text-green-500">YOUR TREE</span>
          </motion.h2>
          <motion.p
            custom={0.2}
            variants={fadeIn}
            className="text-zinc-500 mb-10 text-sm font-mono"
          >
            Create your root. Inscribe your strands. Own your name.
          </motion.p>
          <motion.div custom={0.3} variants={fadeUp} className="flex flex-wrap justify-center gap-4">
            <a
              href="https://bit-sign.online"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-5 bg-green-600 text-white font-bold uppercase tracking-widest text-xs hover:bg-green-700 transition-colors"
            >
              Create Your Root
            </a>
            <Link
              href="/identity"
              className="inline-flex items-center gap-3 px-10 py-5 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold uppercase tracking-widest text-xs hover:border-green-500/50 hover:text-green-400 transition-colors"
            >
              Inscribe a Strand
            </Link>
            <Link
              href="/401"
              className="inline-flex items-center gap-2 px-10 py-5 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold uppercase tracking-widest text-xs hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              Read the Spec &rarr;
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
