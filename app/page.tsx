'use client';

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@/components/WalletProvider";
import { useEffect, useState } from "react";

// ── Animation variants ──────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
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
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, delay, ease }
  })
};

const slideRight = {
  hidden: { opacity: 0, x: -40 },
  visible: (delay: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, delay, ease }
  })
};

// ── Boot Sequence Hero ──────────────────────────────────────────

const DATA_STREAM = '0xF401 \u25C6 STRAND_GPG \u25C6 STRAND_SSH \u25C6 0x00FF \u25C6 OAUTH_ACK \u25C6 KEY_DERIVE \u25C6 TYPE42_OK \u25C6 0xBEEF \u25C6 HD_ROOT \u25C6 HASH_SHA256 \u25C6 IDENTITY_PROOF \u25C6 BSV21_ATTEST \u25C6 ';

const NODE_LABELS = [
  { label: 'GITHUB', x: '12%', y: '25%', delay: 0.2 },
  { label: 'GPG_KEY', x: '82%', y: '18%', delay: 0.6 },
  { label: 'SSH_KEY', x: '8%', y: '72%', delay: 0.4 },
  { label: 'DOMAIN', x: '88%', y: '68%', delay: 0.8 },
  { label: 'WALLET', x: '70%', y: '82%', delay: 1.0 },
  { label: 'YUBIKEY', x: '20%', y: '85%', delay: 0.3 },
];

const SYSTEM_READOUT = [
  { label: 'PROTOCOL', value: 'HTTP 401', color: 'text-zinc-600' },
  { label: 'NETWORK', value: 'BSV MAINNET', color: 'text-zinc-600' },
  { label: 'STRANDS', value: '4 VERIFIED', color: 'text-green-600' },
  { label: 'STATUS', value: 'OPERATIONAL', color: 'text-green-600' },
  { label: 'DERIVATION', value: 'TYPE-42 HD', color: 'text-zinc-600' },
  { label: 'ROOT', value: 'SINGLE KEY', color: 'text-emerald-500' },
];

function BootSequenceHero() {
  const [phase, setPhase] = useState(0);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [particles, setParticles] = useState<Array<{
    id: number; x: number; y: number; size: number; opacity: number; duration: number; delay: number;
  }>>([]);

  const BOOT_MESSAGES = [
    'INITIALIZING IDENTITY STACK...',
    'LOADING OAUTH STRAND VERIFIER...',
    'SCANNING DEVELOPER KEYS: GPG, SSH, NPM...',
    'HD KEY DERIVATION ENGINE: READY',
    'TYPE-42 CONTEXT MAPPER: ONLINE',
    'CROSS-CHAIN SECP256K1: ACTIVATED',
    'SYSTEM OPERATIONAL \u2014 AWAITING IDENTITY',
  ];

  useEffect(() => {
    setParticles(Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.4 + 0.05,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 10,
    })));
  }, []);

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let interval: ReturnType<typeof setInterval> | null = null;

    timers.push(setTimeout(() => {
      if (cancelled) return;
      setPhase(1);

      let i = 0;
      interval = setInterval(() => {
        if (cancelled) { interval && clearInterval(interval); return; }
        if (i < BOOT_MESSAGES.length) {
          setBootLines(prev => [...prev, BOOT_MESSAGES[i]]);
          i++;
        } else {
          interval && clearInterval(interval);
          timers.push(setTimeout(() => {
            if (cancelled) return;
            setPhase(2);
            timers.push(setTimeout(() => {
              if (cancelled) return;
              setPhase(3);
            }, 800));
          }, 300));
        }
      }, 150);
    }, 400));

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      if (interval) clearInterval(interval);
    };
  }, []);

  return (
    <section className="relative min-h-[100vh] flex flex-col justify-center overflow-hidden bg-black">

      {/* ═══════════ BACKGROUND VIDEO ═══════════ */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-40 z-0"
        style={{ filter: 'brightness(1.3)' }}
      >
        <source src="/401-dna-hero.mp4" type="video/mp4" />
      </video>

      {/* ═══════════ BACKGROUND LAYERS ═══════════ */}

      {/* Layer 1: Radial glow — green/emerald for identity */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[800px]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 35%, transparent 70%)',
          }}
        />
      </div>

      {/* Layer 2: Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Layer 3: Particles */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              animation: `float-drift ${p.duration}s ${p.delay}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* Layer 4: Pulsing rings */}
      <div className="absolute inset-0 pointer-events-none z-[2] overflow-hidden">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className="absolute rounded-full border border-white/[0.03]"
            style={{
              left: '33%',
              top: '50%',
              width: `${300 + i * 220}px`,
              height: `${300 + i * 220}px`,
              marginLeft: `-${(300 + i * 220) / 2}px`,
              marginTop: `-${(300 + i * 220) / 2}px`,
              animation: `ring-pulse ${4 + i * 0.7}s ${i * 1}s ease-out infinite`,
            }}
          />
        ))}
      </div>

      {/* Layer 5: Fine grid */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </div>

      {/* Layer 6: Scanline */}
      <div className="absolute inset-0 pointer-events-none z-[3] overflow-hidden opacity-[0.03]">
        <div className="w-full h-[2px] bg-white animate-scanline" />
      </div>

      {/* Layer 7: CRT vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-[4]"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      {/* ═══════════ HUD FRAME ═══════════ */}
      <div className="absolute inset-0 pointer-events-none z-[5]">
        <div className="absolute top-6 left-6 w-16 h-16 border-l-2 border-t-2 border-white/[0.08]" />
        <div className="absolute top-6 right-6 w-16 h-16 border-r-2 border-t-2 border-white/[0.08]" />
        <div className="absolute bottom-6 left-6 w-16 h-16 border-l-2 border-b-2 border-white/[0.08]" />
        <div className="absolute bottom-6 right-6 w-16 h-16 border-r-2 border-b-2 border-white/[0.08]" />

        <div className="absolute top-6 left-6 w-4 h-4 border-l border-t border-white/20" />
        <div className="absolute top-6 right-6 w-4 h-4 border-r border-t border-white/20" />
        <div className="absolute bottom-6 left-6 w-4 h-4 border-l border-b border-white/20" />
        <div className="absolute bottom-6 right-6 w-4 h-4 border-r border-b border-white/20" />

        <div className="absolute top-8 left-24 text-[7px] font-mono text-zinc-700 tracking-[0.25em]">
          PATH401 IDENTITY v1.0
        </div>
        <div className="absolute top-8 right-24 text-[7px] font-mono text-zinc-700 tracking-[0.25em] text-right hidden md:block">
          15.FEB.2026 // MAINNET
        </div>
        <div className="absolute bottom-8 left-24 text-[7px] font-mono text-zinc-700 tracking-[0.25em]">
          BSV-21 // TYPE-42 // HD-KEYS
        </div>
        <div className="absolute bottom-8 right-24 text-[7px] font-mono text-zinc-700 tracking-[0.25em] text-right hidden md:block">
          STRANDS: 8 CATEGORIES \u25C6 VERIFIED
        </div>

        <div className="absolute top-6 left-24 right-24 h-[1px] bg-gradient-to-r from-white/[0.04] via-transparent to-white/[0.04]" />
        <div className="absolute bottom-6 left-24 right-24 h-[1px] bg-gradient-to-r from-white/[0.04] via-transparent to-white/[0.04]" />
      </div>

      {/* ═══════════ BOOT SEQUENCE TEXT ═══════════ */}
      <AnimatePresence>
        {phase >= 1 && phase < 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="absolute top-16 left-8 md:left-28 z-20 font-mono"
          >
            {bootLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
                className={`text-[10px] tracking-wider mb-1 ${
                  i === bootLines.length - 1 ? 'text-emerald-500' : 'text-zinc-700'
                }`}
              >
                <span className="text-zinc-800 mr-2">[{String(i).padStart(2, '0')}]</span>
                {line}
              </motion.div>
            ))}
            {phase === 1 && (
              <span className="inline-block w-2 h-3 bg-emerald-500 animate-blink ml-1 mt-1" />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ SYSTEM READOUT ═══════════ */}
      <AnimatePresence>
        {phase >= 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="absolute top-16 right-8 md:right-28 z-20 font-mono text-right hidden md:block"
          >
            {SYSTEM_READOUT.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
                className="mb-2 flex items-center justify-end gap-3"
              >
                <span className="text-[7px] tracking-[0.25em] text-zinc-700">{item.label}</span>
                <span className={`text-[9px] tracking-wider font-bold ${item.color}`}>{item.value}</span>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-4 flex items-center gap-2 justify-end"
            >
              <span className="text-[7px] tracking-[0.25em] text-zinc-700">SYNC</span>
              <div className="w-20 h-[3px] bg-zinc-900 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, delay: 1.2, ease: 'easeOut' }}
                  className="h-full bg-emerald-500/60"
                />
              </div>
              <span className="text-[7px] text-emerald-600 font-bold">100%</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ FLOATING NODE LABELS ═══════════ */}
      <AnimatePresence>
        {phase >= 3 && (
          <>
            {NODE_LABELS.map((node) => (
              <motion.div
                key={node.label}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: node.delay }}
                className="absolute z-[6] pointer-events-none flex items-center gap-1.5"
                style={{ left: node.x, top: node.y }}
              >
                <span className="relative flex h-1 w-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500/40 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1 w-1 bg-emerald-500/60" />
                </span>
                <span className="text-[7px] font-mono text-zinc-700 tracking-[0.2em]">{node.label}</span>
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* ═══════════ MAIN CONTENT ═══════════ */}
      <div className="relative z-20 px-6 md:px-16 max-w-[1920px] mx-auto w-full">
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col lg:flex-row lg:items-stretch lg:gap-12"
            >
              {/* ═══ LEFT: Title + CTA ═══ */}
              <div className="flex-1 min-w-0">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1, ease }}
                  className="flex items-center gap-3 mb-6"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-zinc-600 text-[10px] tracking-[0.3em] uppercase font-mono font-bold">
                    HTTP 401 : IDENTITY REQUIRED
                  </span>
                </motion.div>

                {/* ═══ THE MASSIVE $401 TITLE ═══ */}
                <div className="relative mb-0">
                  <motion.h1
                    className="font-display font-black tracking-tighter leading-[0.85] hero-title-glow"
                    style={{ fontSize: 'clamp(5rem, 12vw, 12rem)' }}
                  >
                    <motion.span
                      initial={{ opacity: 0, y: 60 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2, ease }}
                      className="inline-block text-white"
                    >
                      $
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0, y: 60 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.35, ease }}
                      className="inline-block text-white"
                    >
                      4
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0, y: 60 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.45, ease }}
                      className="inline-block text-white"
                    >
                      0
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0, y: 60 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.55, ease }}
                      className="inline-block text-white"
                    >
                      1
                    </motion.span>
                  </motion.h1>

                  {/* Title reflection */}
                  <div
                    className="relative overflow-hidden h-6 md:h-10 select-none"
                    aria-hidden="true"
                    style={{
                      transform: 'scaleY(-1)',
                      WebkitMaskImage: 'linear-gradient(to bottom, rgba(255,255,255,0.12), transparent 80%)',
                      maskImage: 'linear-gradient(to bottom, rgba(255,255,255,0.12), transparent 80%)',
                    }}
                  >
                    <div
                      className="font-display font-black tracking-tighter leading-[0.85] text-white/40"
                      style={{ fontSize: 'clamp(5rem, 12vw, 12rem)' }}
                    >
                      $401
                    </div>
                  </div>

                  <motion.div
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: [0, 1, 1, 0], originX: [0, 0, 1, 1] }}
                    transition={{ duration: 1.2, delay: 0.6, ease: "easeInOut" }}
                    className="absolute top-[60%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  />

                  <motion.div
                    initial={{ scaleX: 0, originX: 1 }}
                    animate={{ scaleX: [0, 1, 1, 0], originX: [1, 1, 0, 0] }}
                    transition={{ duration: 1, delay: 0.8, ease: "easeInOut" }}
                    className="absolute top-[65%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"
                  />
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="mb-2"
                >
                  <span className="text-zinc-400 text-xl md:text-2xl tracking-[0.3em] uppercase font-display font-black">
                    EVERY KEY YOU OWN
                  </span>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  className="text-zinc-500 max-w-xl text-sm leading-relaxed mb-8 font-mono"
                >
                  Your identity is scattered across GPG keys, SSH configs, OAuth tokens, npm credentials,
                  and wallet seeds. <code className="text-white bg-zinc-900 px-1.5 py-0.5 border border-zinc-800">$401</code> is
                  the keychain that unifies them all &mdash; one root, infinite strands, on Bitcoin forever.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.1 }}
                  className="flex flex-wrap gap-4"
                >
                  <Link
                    href="/identity"
                    className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-zinc-200 transition-all overflow-hidden"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    Mint Identity
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  </Link>
                  <Link
                    href="/whitepaper"
                    className="inline-flex items-center gap-3 px-8 py-4 border border-zinc-800 text-zinc-400 font-bold uppercase tracking-widest text-xs hover:border-zinc-600 hover:text-white transition-all"
                  >
                    Read Whitepaper
                  </Link>
                  <Link
                    href="/docs"
                    className="inline-flex items-center gap-3 px-8 py-4 border border-zinc-800 text-zinc-400 font-bold uppercase tracking-widest text-xs hover:border-zinc-600 hover:text-white transition-all"
                  >
                    Documentation
                  </Link>
                </motion.div>
              </div>

              {/* ═══ RIGHT: DNA panel ═══ */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8, ease }}
                className="hidden lg:flex flex-col w-[400px] xl:w-[480px] flex-shrink-0 mt-6"
              >
                <div className="relative border border-zinc-800 overflow-hidden flex-1 aspect-video">
                  <img
                    src="/401-dna-hero.jpg"
                    alt="$401 Identity DNA"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                  />

                  <div className="relative z-10 p-8 md:p-10 flex flex-col justify-center h-full bg-gradient-to-t from-black/80 via-black/40 to-black/60">
                    <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-zinc-600" />
                    <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-zinc-600" />
                    <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-zinc-600" />
                    <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-zinc-600" />

                    <div className="text-[8px] text-zinc-600 font-mono tracking-[0.3em] uppercase mb-6">
                      SYS::IDENTITY_MODEL
                    </div>

                    <h2 className="text-2xl xl:text-3xl font-black tracking-tighter mb-5 font-display leading-tight">
                      ONE ROOT<span className="text-zinc-700">.</span><br />
                      INFINITE KEYS<span className="text-zinc-700">.</span><br />
                      EVERY PROOF<span className="text-zinc-700">.</span>
                    </h2>
                    <p className="text-zinc-500 text-sm leading-relaxed">
                      Every strand is an on-chain proof linking one of your identities to your cryptographic root. Together they form an unbreakable keychain.
                    </p>

                    <div className="mt-auto pt-6 flex items-center gap-4 text-[8px] font-mono text-zinc-700 tracking-wider">
                      <span>PROTO::HTTP/401</span>
                      <span className="w-1 h-1 bg-zinc-800" />
                      <span>KEY::TYPE-42</span>
                      <span className="w-1 h-1 bg-zinc-800" />
                      <span>CHAIN::BSV-21</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══════════ DATA STREAMS ═══════════ */}
      <AnimatePresence>
        {phase >= 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute bottom-20 left-0 right-0 z-10 overflow-hidden space-y-0.5"
          >
            <div className="overflow-hidden whitespace-nowrap">
              <div className="inline-block animate-data-scroll-left text-[7px] font-mono text-zinc-800/40 tracking-[0.15em]">
                {DATA_STREAM.repeat(4)}
              </div>
            </div>
            <div className="overflow-hidden whitespace-nowrap">
              <div className="inline-block animate-data-scroll-right text-[7px] font-mono text-zinc-800/40 tracking-[0.15em]">
                {DATA_STREAM.repeat(4)}
              </div>
            </div>
            <div className="overflow-hidden whitespace-nowrap">
              <div className="inline-block animate-data-scroll-left text-[7px] font-mono text-zinc-800/40 tracking-[0.15em]" style={{ animationDuration: '35s' }}>
                {DATA_STREAM.repeat(4)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ SCROLL INDICATOR ═══════════ */}
      <AnimatePresence>
        {phase >= 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
          >
            <span className="text-zinc-700 text-[9px] uppercase tracking-[0.3em] font-mono">Scroll</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-[1px] h-6 bg-gradient-to-b from-zinc-700 to-transparent"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
    </section>
  );
}

// ── Status Grid ─────────────────────────────────────────────────

function StatusGrid() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="border-b border-zinc-200 dark:border-zinc-900"
    >
      <div className="max-w-[1920px] mx-auto px-6 md:px-16 py-16">
        <motion.div custom={0} variants={fadeIn} className="section-label">
          System Overview
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
          {[
            { label: 'Protocol', value: 'HTTP 401', sub: 'Identity Required', accent: false },
            { label: 'Strand Types', value: '8', sub: 'OAuth, GPG, SSH, Domain...', accent: false },
            { label: 'Derivation', value: 'TYPE-42', sub: 'HD keys per context', accent: false },
            { label: 'Status', value: 'LIVE', sub: '4 strands verified', accent: true },
          ].map((metric, i) => (
            <motion.div
              key={metric.label}
              custom={0.1 + i * 0.08}
              variants={scaleIn}
              className={`p-6 md:p-8 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-all ${
                i < 3 ? 'border-r border-zinc-200 dark:border-zinc-800' : ''
              }`}
            >
              <div className="text-[9px] text-zinc-500 font-mono uppercase tracking-[0.2em] mb-3">{metric.label}</div>
              <div className={`text-2xl md:text-3xl font-black tracking-tighter font-display mb-1 ${
                metric.accent ? 'text-emerald-500' : 'text-zinc-900 dark:text-white'
              }`}>
                {metric.value}
              </div>
              <div className="text-[9px] text-zinc-500 font-mono font-bold uppercase tracking-widest">{metric.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

// ── Core Idea ───────────────────────────────────────────────────

function CoreIdea() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="border-b border-zinc-200 dark:border-zinc-900"
    >
      <div className="max-w-[1920px] mx-auto px-6 md:px-16 py-16">
        <motion.div custom={0} variants={fadeIn} className="section-label">
          The Core Idea
        </motion.div>
        <div className="grid md:grid-cols-2 gap-0 border border-zinc-200 dark:border-zinc-800">
          <motion.div custom={0.1} variants={fadeUp} className="relative border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 overflow-hidden min-h-[300px] md:min-h-[400px]">
            <img
              src="/401-dna-hero.jpg"
              alt="DNA Identity Strands"
              className="absolute inset-0 w-full h-full object-cover opacity-40 dark:opacity-30"
            />
            <div className="relative z-10 p-8 md:p-12 flex flex-col justify-center h-full">
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-6 font-display">
                EVERY KEY<span className="text-zinc-300 dark:text-zinc-800">.</span><br />
                ONE KEYCHAIN<span className="text-zinc-300 dark:text-zinc-800">.</span><br />
                ON BITCOIN<span className="text-zinc-300 dark:text-zinc-800">.</span>
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-md">
                Your GitHub, GPG, SSH, npm tokens, domain ownership, wallet signatures &mdash; each becomes
                an on-chain strand linking to your cryptographic root. Together they form an unbreakable identity.
              </p>
            </div>
          </motion.div>
          <div className="flex flex-col">
            <motion.div custom={0.2} variants={fadeUp} className="p-8 md:p-12 border-b border-zinc-200 dark:border-zinc-800 flex-1">
              <div className="text-[9px] text-zinc-500 font-mono uppercase tracking-[0.2em] mb-4">Add strands</div>
              <p className="text-xl font-black tracking-tight mb-2">Prove who you are</p>
              <p className="text-zinc-500 text-sm">Authenticate with any provider &mdash; OAuth, GPG, SSH, DNS, wallet signature, hardware key. Each proof is inscribed as an on-chain strand.</p>
            </motion.div>
            <motion.div custom={0.3} variants={fadeUp} className="p-8 md:p-12 flex-1">
              <div className="text-[9px] text-zinc-500 font-mono uppercase tracking-[0.2em] mb-4">Derive keys</div>
              <p className="text-xl font-black tracking-tight mb-2">One root, infinite contexts</p>
              <p className="text-zinc-500 text-sm">Type-42 HD derivation gives you a unique signing key per repo, per package, per domain &mdash; all from one root. Selective disclosure built in.</p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

// ── Strand Categories ────────────────────────────────────────────

function StrandCategories() {
  const strands = [
    { step: '01', category: 'Social OAuth', examples: 'GitHub, Twitter, Google, LinkedIn', status: 'LIVE', statusColor: 'text-emerald-500 border-emerald-500/30' },
    { step: '02', category: 'Developer Keys', examples: 'GPG signing, SSH public key, npm tokens', status: 'NEXT', statusColor: 'text-amber-500 border-amber-500/30' },
    { step: '03', category: 'Domain Ownership', examples: 'DNS TXT record verification', status: 'NEXT', statusColor: 'text-amber-500 border-amber-500/30' },
    { step: '04', category: 'Wallet Signatures', examples: 'MetaMask, Phantom, HandCash', status: 'NEXT', statusColor: 'text-amber-500 border-amber-500/30' },
    { step: '05', category: 'Hardware Keys', examples: 'YubiKey, Passkeys, FIDO2/WebAuthn', status: 'LATER', statusColor: 'text-zinc-500 border-zinc-500/30' },
    { step: '06', category: 'Email Verification', examples: 'Challenge-response proof', status: 'LATER', statusColor: 'text-zinc-500 border-zinc-500/30' },
    { step: '07', category: 'Certificates', examples: 'SSL certs, code signing certs', status: 'FUTURE', statusColor: 'text-zinc-600 border-zinc-700' },
    { step: '08', category: 'Professional APIs', examples: 'AWS IAM, Stripe, Vercel', status: 'FUTURE', statusColor: 'text-zinc-600 border-zinc-700' },
  ];

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="border-b border-zinc-200 dark:border-zinc-900"
    >
      <div className="max-w-[1920px] mx-auto px-6 md:px-16 py-16">
        <motion.div custom={0} variants={fadeIn} className="section-label">
          Strand Categories
        </motion.div>
        <div className="border border-zinc-200 dark:border-zinc-800">
          {strands.map((item, i) => (
            <motion.div
              key={i}
              custom={0.1 + i * 0.06}
              variants={slideRight}
              className={`flex items-start gap-6 p-6 ${
                i < strands.length - 1 ? 'border-b border-zinc-200 dark:border-zinc-800' : ''
              } hover:bg-zinc-50 dark:hover:bg-zinc-900/20 transition-colors`}
            >
              <span className="w-10 h-10 flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 text-xs font-display font-bold shrink-0">
                {item.step}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <p className="text-sm font-black tracking-tight">{item.category}</p>
                  <span className={`text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 border ${item.statusColor}`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-zinc-500 text-xs font-mono">{item.examples}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

// ── Strand Strength Model ────────────────────────────────────────

function StrengthModel() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="border-b border-zinc-200 dark:border-zinc-900"
    >
      <div className="max-w-[1920px] mx-auto px-6 md:px-16 py-16">
        <motion.div custom={0} variants={fadeIn} className="section-label">
          Strand Strength
        </motion.div>
        <div className="grid md:grid-cols-2 gap-0 border border-zinc-200 dark:border-zinc-800">
          <motion.div custom={0.1} variants={fadeUp} className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800">
            <h3 className="text-lg font-display font-black tracking-tight mb-6 uppercase">
              More Strands<span className="text-zinc-300 dark:text-zinc-700"> = Stronger Identity</span>
            </h3>
            <div className="space-y-4">
              {[
                ['1 strand', 'Weak', 'Single point of failure'],
                ['2-3 strands', 'Suggestive', 'Harder to fake, still vulnerable'],
                ['4-5 strands', 'Verified', 'Multi-platform, credible identity'],
                ['6-7 strands', 'Strong', 'Cross-category (social + dev + domain)'],
                ['8+ strands', 'Robust', 'Near-impossible to impersonate'],
              ].map(([count, level, desc]) => (
                <div key={count} className="flex gap-4">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-500 w-24 shrink-0 pt-0.5">{count}</span>
                  <div>
                    <span className="text-sm font-bold">{level}</span>
                    <span className="text-zinc-500 text-xs ml-2">&mdash; {desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div custom={0.2} variants={fadeUp} className="p-8 md:p-10">
            <h3 className="text-lg font-display font-black tracking-tight mb-6 uppercase">
              Cross-Category<span className="text-zinc-300 dark:text-zinc-700"> Beats Same-Category</span>
            </h3>
            <div className="space-y-6">
              <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4">
                <div className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest mb-2">Weaker</div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">4 social OAuth logins (GitHub + Twitter + Google + LinkedIn)</p>
                <p className="text-[10px] text-zinc-500 mt-1 font-mono">Same attack surface &times; 4</p>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-950 border border-emerald-500/20 p-4">
                <div className="text-[9px] text-emerald-600 font-mono uppercase tracking-widest mb-2">Stronger</div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">1 OAuth + 1 GPG key + 1 domain + 1 hardware key</p>
                <p className="text-[10px] text-emerald-600 mt-1 font-mono">4 different attack surfaces</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

// ── HD Derivation ────────────────────────────────────────────────

function HDDerivation() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="border-b border-zinc-200 dark:border-zinc-900"
    >
      <div className="max-w-[1920px] mx-auto px-6 md:px-16 py-16">
        <motion.div custom={0} variants={fadeIn} className="section-label">
          HD Key Derivation
        </motion.div>
        <div className="border border-zinc-200 dark:border-zinc-800">
          <motion.div custom={0.1} variants={fadeUp} className="p-8 md:p-10 border-b border-zinc-200 dark:border-zinc-800">
            <h3 className="text-xl font-display font-black tracking-tight mb-4 uppercase">
              One Root. Infinite Keys. Perfect Privacy.
            </h3>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-2xl mb-6">
              Type-42 key derivation creates a unique signing key for every context in your digital life.
              Each derived key is deterministic and unlinkable &mdash; prove you signed an npm package
              without revealing which repos you commit to.
            </p>
            <pre className="bg-zinc-50 dark:bg-zinc-950 p-6 font-mono text-sm text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 overflow-x-auto">
{`$401 root (master key, on-chain attestation)
\u251C\u2500\u2500 Type-42("bitgit", "my-repo")     \u2192 signing key for commits
\u251C\u2500\u2500 Type-42("npm", "@me/package")    \u2192 signing key for npm publish
\u251C\u2500\u2500 Type-42("deploy", "staging")     \u2192 attestation key for deploys
\u251C\u2500\u2500 Type-42("domain", "example.com") \u2192 ownership key for domain
\u251C\u2500\u2500 Type-42("wallet", "ethereum")    \u2192 cross-chain address
\u2514\u2500\u2500 Type-42("contract", "abc123")    \u2192 signing key for contracts`}
            </pre>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-0">
            {[
              { label: 'Deterministic', desc: 'Same input always produces the same derived key' },
              { label: 'Unlinkable', desc: 'Knowing one derived key reveals nothing about others' },
              { label: 'Selective Disclosure', desc: 'Reveal only the proof you choose — nothing more' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                custom={0.2 + i * 0.1}
                variants={scaleIn}
                className={`p-6 ${i < 2 ? 'border-r border-zinc-200 dark:border-zinc-800' : ''}`}
              >
                <h4 className="text-sm font-black uppercase tracking-wider mb-2">{item.label}</h4>
                <p className="text-zinc-500 text-xs">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

// ── Developer Workflow ───────────────────────────────────────────

function DeveloperWorkflow() {
  const steps = [
    { time: 'MORNING', action: 'Commit code', before: 'GPG key expired? Email mismatch? 1991 UX.', after: 'Signed with Type-42("bitgit", "your-repo"). No config.' },
    { time: 'MIDDAY', action: 'Deploy to staging', before: 'Which SSH key? 47-line ~/.ssh/config. Half broken.', after: 'Attested by Type-42("deploy", "staging"). Server trusts your root.' },
    { time: 'AFTERNOON', action: 'Publish npm package', before: 'Token from 6 months ago. Scoped? Read-only? Who knows.', after: 'Signed with Type-42("npm", "@scope/pkg"). No rotation.' },
    { time: 'EVENING', action: 'Review the day', before: '3 identity systems. None linked. None on-chain.', after: 'Every action provably yours. One keychain. On Bitcoin.' },
  ];

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="border-b border-zinc-200 dark:border-zinc-900"
    >
      <div className="max-w-[1920px] mx-auto px-6 md:px-16 py-16">
        <motion.div custom={0} variants={fadeIn} className="section-label">
          A Developer&apos;s Day
        </motion.div>
        <div className="border border-zinc-200 dark:border-zinc-800">
          {steps.map((item, i) => (
            <motion.div
              key={i}
              custom={0.1 + i * 0.08}
              variants={slideRight}
              className={`p-6 ${
                i < steps.length - 1 ? 'border-b border-zinc-200 dark:border-zinc-800' : ''
              } hover:bg-zinc-50 dark:hover:bg-zinc-900/20 transition-colors`}
            >
              <div className="flex items-start gap-6">
                <span className="w-10 h-10 flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 text-[8px] font-mono font-bold shrink-0 tracking-wider">
                  {item.time.slice(0, 3)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black tracking-tight mb-3">{item.action}</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-[8px] font-mono text-red-500/60 uppercase tracking-widest mb-1">Without $401</div>
                      <p className="text-zinc-500 text-xs">{item.before}</p>
                    </div>
                    <div>
                      <div className="text-[8px] font-mono text-emerald-500/80 uppercase tracking-widest mb-1">With $401</div>
                      <p className="text-zinc-400 dark:text-zinc-300 text-xs">{item.after}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

// ── Roadmap ─────────────────────────────────────────────────────

function Roadmap() {
  const phases = [
    { phase: '1', title: 'Social OAuth Strands', status: 'complete', desc: 'GitHub, Twitter, Google, LinkedIn — 4 strands verified on mainnet' },
    { phase: '2', title: 'HD Key Derivation', status: 'complete', desc: 'Type-42 per-context keys, wallet manifest export, key rotation' },
    { phase: '3', title: 'Wallet & Domain Strands', status: 'active', desc: 'HandCash, MetaMask, Phantom signatures + DNS TXT verification' },
    { phase: '4', title: 'Developer Key Strands', status: 'upcoming', desc: 'GPG attestation, SSH key proof, npm/PyPI signing integration' },
    { phase: '5', title: 'Hardware & Cross-Chain', status: 'upcoming', desc: 'FIDO2/WebAuthn strands, BSV↔ETH shared secp256k1 identity' },
  ];

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="border-b border-zinc-200 dark:border-zinc-900"
    >
      <div className="max-w-[1920px] mx-auto px-6 md:px-16 py-16">
        <motion.div custom={0} variants={fadeIn} className="section-label">
          Roadmap
        </motion.div>
        <div className="border border-zinc-200 dark:border-zinc-800">
          {phases.map((item, i) => (
            <motion.div
              key={i}
              custom={0.1 + i * 0.08}
              variants={slideRight}
              className={`flex items-start gap-6 p-6 ${
                i < phases.length - 1 ? 'border-b border-zinc-200 dark:border-zinc-800' : ''
              } ${item.status === 'active' ? 'bg-zinc-50 dark:bg-zinc-900/20' : ''} hover:bg-zinc-50 dark:hover:bg-zinc-900/20 transition-colors`}
            >
              <span className={`w-10 h-10 flex items-center justify-center text-xs font-display font-bold shrink-0 ${
                item.status === 'complete'
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-black'
                  : item.status === 'active'
                  ? 'bg-emerald-500 text-black'
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
              }`}>
                {item.phase}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <p className="text-sm font-black tracking-tight">{item.title}</p>
                  <span className={`text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 border ${
                    item.status === 'complete' ? 'text-zinc-500 border-zinc-300 dark:border-zinc-700' :
                    item.status === 'active' ? 'text-emerald-500 border-emerald-500/30' :
                    'text-zinc-400 dark:text-zinc-600 border-zinc-200 dark:border-zinc-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-zinc-500 text-sm mt-1">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

// ── Ecosystem ───────────────────────────────────────────────────

function Ecosystem() {
  const links = [
    { href: '/identity', title: 'Mint Identity', desc: 'Create your $401 identity token and add strands', tag: 'start', external: false },
    { href: '/docs', title: 'Documentation', desc: 'Strand types, API reference, integration guides', tag: 'docs', external: false },
    { href: '/whitepaper', title: 'Whitepaper', desc: 'Protocol specification and cryptographic foundations', tag: 'spec', external: false },
    { href: 'https://b0ase.com/blog/401-idna', title: 'IDNA — Your Identity DNA', desc: 'The expanded $401 vision — from OAuth to universal keychain', tag: 'blog', external: true },
    { href: 'https://b0ase.com/blog/401-inscribe-your-identity', title: 'Inscribe Your Identity', desc: 'The original $401 post — identity vs commodity', tag: 'blog', external: true },
    { href: 'https://path402.com', title: '$402 Payment', desc: 'The payment layer — HTTP 402 Protocol', tag: '$402', external: true },
    { href: 'https://b0ase.com', title: 'b0ase.com', desc: 'The venture studio behind $401, $402, $403', tag: 'studio', external: true },
  ];

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="border-b border-zinc-200 dark:border-zinc-900"
    >
      <div className="max-w-[1920px] mx-auto px-6 md:px-16 py-16">
        <motion.div custom={0} variants={fadeIn} className="section-label">
          Ecosystem
        </motion.div>
        <div className="border border-zinc-200 dark:border-zinc-800">
          {links.map((item, i) => {
            const inner = (
              <div className="flex items-center justify-between p-6 hover:bg-zinc-50 dark:hover:bg-zinc-900/20 transition-colors">
                <div>
                  <h3 className="text-sm font-bold tracking-tight mb-1">{item.title}</h3>
                  <p className="text-zinc-500 text-sm">{item.desc}</p>
                </div>
                <span className="text-zinc-400 dark:text-zinc-600 font-mono text-[9px] uppercase tracking-widest shrink-0 ml-4">
                  {item.tag}
                </span>
              </div>
            );

            return (
              <motion.div
                key={i}
                custom={0.05 + i * 0.05}
                variants={slideRight}
                className={i < links.length - 1 ? 'border-b border-zinc-200 dark:border-zinc-800' : ''}
              >
                {item.external ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer">{inner}</a>
                ) : (
                  <Link href={item.href}>{inner}</Link>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}

// ── Final CTA ───────────────────────────────────────────────────

function FinalCTA() {
  return (
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
          <span className="text-zinc-300 dark:text-zinc-700">YOUR KEYCHAIN</span>
        </motion.h2>
        <motion.p
          custom={0.2}
          variants={fadeIn}
          className="text-zinc-500 mb-10 text-sm font-mono"
        >
          One root key. Infinite strands. On Bitcoin forever.
        </motion.p>
        <motion.div custom={0.3} variants={fadeUp} className="flex flex-wrap justify-center gap-4">
          <Link
            href="/identity"
            className="inline-flex items-center gap-3 px-10 py-5 bg-zinc-900 dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest text-xs hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            Mint Identity
          </Link>
          <Link
            href="/whitepaper"
            className="inline-flex items-center gap-2 px-10 py-5 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold uppercase tracking-widest text-xs hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Read Whitepaper &rarr;
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}

// ── Dashboard Panel (Connected State) ───────────────────────────

function DashboardPanel() {
  const { wallet } = useWallet();
  const [identitySymbol, setIdentitySymbol] = useState<string | null>(null);
  const [strandCount, setStrandCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/client/identity').then(r => r.json()).catch(() => ({})),
      fetch('/api/client/strands').then(r => r.ok ? r.json() : null).catch(() => null),
    ]).then(([identityData, strandsData]: [{ identity?: { symbol: string } }, { count?: number } | null]) => {
      if (identityData?.identity) {
        setIdentitySymbol(identityData.identity.symbol);
      }
      if (strandsData?.count !== undefined) {
        setStrandCount(strandsData.count);
      }
    }).finally(() => setLoading(false));
  }, []);

  const displayName = wallet.handle ? `@${wallet.handle}` : wallet.address ? `${wallet.address.slice(0, 8)}...` : 'Connected';

  return (
    <main className="w-full px-6 md:px-16 py-8 max-w-[1920px] mx-auto">
      <header className="mb-8 border-b border-zinc-200 dark:border-zinc-900 pb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
          className="flex items-center gap-3 mb-4 text-zinc-500 text-xs tracking-widest uppercase"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </span>
          Identity Online
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease }}
          className="text-4xl md:text-6xl font-black tracking-tighter mb-2 font-display"
        >
          $401_KEYCHAIN
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-zinc-500"
        >
          Welcome, <span className="text-zinc-900 dark:text-white font-bold">{displayName}</span>
        </motion.div>
      </header>

      <section className="mb-8">
        <div className="flex flex-wrap gap-3">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 border text-[10px] font-mono uppercase tracking-widest ${
            identitySymbol
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              : 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400'
          }`}>
            <span className={`w-1.5 h-1.5 ${identitySymbol ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            Identity: {loading ? '...' : identitySymbol || 'NOT MINTED'}
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono uppercase tracking-widest">
            <span className="w-1.5 h-1.5 bg-emerald-500" />
            Strands: {strandCount}
          </div>
        </div>
      </section>

      <section>
        <div className="section-label">Quick Actions</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-zinc-200 dark:border-zinc-800">
          {[
            { href: '/identity', label: '401 // Identity', value: identitySymbol || 'Mint DNA' },
            { href: '/id-tree', label: '401 // Strands', value: 'View Tree' },
            { href: '/wallet', label: '401 // Wallet', value: 'Keys' },
            { href: '/settings', label: '401 // Settings', value: 'Configure' },
            { href: '/docs', label: 'Documentation', value: 'Docs' },
            { href: '/whitepaper', label: 'Whitepaper', value: 'Protocol' },
            { href: '/registry', label: 'Registry', value: 'Browse' },
            { href: '/market', label: 'Marketplace', value: 'Market' },
          ].map((card, i) => (
            <Link
              key={card.href}
              href={card.href}
              className={`block p-5 hover:bg-zinc-50 dark:hover:bg-zinc-900/20 transition-colors ${
                i % 4 !== 3 ? 'border-r border-zinc-200 dark:border-zinc-800' : ''
              } ${i < 4 ? 'border-b border-zinc-200 dark:border-zinc-800' : ''}`}
            >
              <div className="text-[9px] text-zinc-500 uppercase tracking-widest mb-2">{card.label}</div>
              <div className="text-sm font-bold tracking-tight capitalize">{card.value} &rarr;</div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

// ── Main Export ──────────────────────────────────────────────────

export default function Home() {
  const { wallet } = useWallet();

  if (wallet.connected) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white pt-14">
        <DashboardPanel />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white">
      <BootSequenceHero />
      <div className="pt-0">
        <StatusGrid />
        <CoreIdea />
        <StrandCategories />
        <StrengthModel />
        <HDDerivation />
        <DeveloperWorkflow />
        <Roadmap />
        <Ecosystem />
        <FinalCTA />
      </div>
    </div>
  );
}
