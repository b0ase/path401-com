'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

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

const slideRight = {
  hidden: { opacity: 0, x: -40 },
  visible: (delay: number) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.6, delay, ease }
  })
};

export default function Page401() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white">

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[80vh] flex flex-col justify-center overflow-hidden bg-black">
        {/* Background video — inside HUD frame */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-6 left-6 right-6 bottom-6 w-[calc(100%-48px)] h-[calc(100%-48px)] object-cover opacity-25"
          style={{ filter: 'hue-rotate(95deg) saturate(1.4) brightness(1.1)' }}
        >
          <source src="/401-hero.mp4" type="video/mp4" />
        </video>

        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(34, 197, 94, 0.8) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Radial glow — green for identity */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px]"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(34, 197, 94, 0.12) 0%, rgba(34, 197, 94, 0.04) 35%, transparent 70%)',
            }}
          />
        </div>

        {/* CRT vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
          }}
        />

        {/* HUD corners */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-green-500/10" />
          <div className="absolute top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-green-500/10" />
          <div className="absolute bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-green-500/10" />
          <div className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-green-500/10" />
          <div className="absolute top-8 left-20 text-[7px] font-mono text-zinc-700 tracking-[0.25em]">
            $401 KEY CHAIN
          </div>
          <div className="absolute bottom-8 left-20 text-[7px] font-mono text-zinc-700 tracking-[0.25em]">
            HTTP 401: UNAUTHORIZED
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 px-6 md:px-16 max-w-[1920px] mx-auto w-full flex items-center">
          {/* Left: Text */}
          <div className="flex-1 min-w-0">
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
                HTTP 401 : UNAUTHORIZED &mdash; PROVE WHO YOU ARE
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease }}
              className="font-display font-black tracking-tighter leading-[0.85] mb-0"
              style={{
                fontSize: 'clamp(4rem, 12vw, 12rem)',
                textShadow: '0 0 10px rgba(34, 197, 94, 0.4), 0 0 30px rgba(34, 197, 94, 0.2), 0 0 60px rgba(34, 197, 94, 0.1)',
              }}
            >
              <span className="text-white">$401</span>
            </motion.h1>

            {/* Reflection */}
            <div
              className="relative overflow-hidden h-6 md:h-10 select-none mb-0"
              aria-hidden="true"
              style={{
                transform: 'scaleY(-1)',
                WebkitMaskImage: 'linear-gradient(to bottom, rgba(255,255,255,0.1), transparent 80%)',
                maskImage: 'linear-gradient(to bottom, rgba(255,255,255,0.1), transparent 80%)',
              }}
            >
              <div
                className="font-display font-black tracking-tighter leading-[0.85] text-green-400/30"
                style={{ fontSize: 'clamp(4rem, 12vw, 12rem)' }}
              >
                $401
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mb-2"
            >
              <span className="text-zinc-400 text-xl md:text-2xl tracking-[0.3em] uppercase font-display font-black">
                SIGN IN TO THE BLOCKCHAIN
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-zinc-500 max-w-xl text-sm leading-relaxed mb-12 font-mono"
            >
              Link your socials. Mint your identity. One penny per strand. Your{' '}
              <code className="text-green-400 bg-zinc-900 px-1.5 py-0.5 border border-zinc-800">$401</code> is
              a cryptographic chain of every account you control &mdash; Google, Twitter, GitHub, Microsoft, Apple &mdash;
              all anchored to a single root key on the blockchain. Nobody can fake it. Nobody can take it away.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/identity"
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-green-600 text-white font-bold uppercase tracking-widest text-xs hover:bg-green-700 transition-all overflow-hidden"
              >
                Link Your Socials
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
              <Link
                href="/id-tree"
                className="inline-flex items-center gap-3 px-8 py-4 border border-zinc-800 text-zinc-400 font-bold uppercase tracking-widest text-xs hover:border-green-500/50 hover:text-green-400 transition-all"
              >
                How It Works &rarr;
              </Link>
            </motion.div>
          </div>

          {/* Right: Identity Tree Graphic (desktop only) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.6, ease }}
            className="hidden lg:block w-[540px] xl:w-[600px] shrink-0 -ml-8"
          >
            <Link href="/id-tree" className="block group border border-zinc-800 bg-zinc-950/60 backdrop-blur-sm aspect-square flex flex-col overflow-hidden hover:border-green-500/30 transition-colors">
              <div className="px-5 py-2.5 flex items-center justify-between border-b border-green-500/20 bg-green-500/5">
                <span className="text-[9px] font-mono font-bold text-green-400/70 uppercase tracking-[0.2em]">$401 Identity Tree</span>
                <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest group-hover:text-green-400 transition-colors">Explore &rarr;</span>
              </div>
              <div className="p-5 pb-4 flex-1 flex flex-col">
              <svg viewBox="10 10 340 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full flex-1">
                {/* Animated dash style */}
                <style>{`
                  @keyframes dash-flow { to { stroke-dashoffset: -20; } }
                  .tree-line { stroke-dasharray: 6 4; animation: dash-flow 3s linear infinite; }
                  .tree-line-slow { stroke-dasharray: 4 6; animation: dash-flow 4s linear infinite; }
                `}</style>

                {/* Glow behind root */}
                <circle cx="180" cy="52" r="60" fill="rgba(34,197,94,0.04)" />

                {/* ── Lines: Root → Strands ── */}
                <line x1="180" y1="72" x2="72" y2="150" className="tree-line" stroke="rgba(34,197,94,0.25)" strokeWidth="1.5" />
                <line x1="180" y1="72" x2="180" y2="150" className="tree-line" stroke="rgba(34,197,94,0.25)" strokeWidth="1.5" />
                <line x1="180" y1="72" x2="288" y2="150" className="tree-line" stroke="rgba(34,197,94,0.25)" strokeWidth="1.5" />

                {/* ── Lines: Strands → Attestors ── */}
                <line x1="72" y1="190" x2="48" y2="250" className="tree-line-slow" stroke="rgba(245,158,11,0.2)" strokeWidth="1" />
                <line x1="72" y1="190" x2="96" y2="250" className="tree-line-slow" stroke="rgba(34,197,94,0.25)" strokeWidth="1" />
                <line x1="180" y1="190" x2="156" y2="250" className="tree-line-slow" stroke="rgba(245,158,11,0.2)" strokeWidth="1" />
                <line x1="180" y1="190" x2="204" y2="250" className="tree-line-slow" stroke="rgba(34,197,94,0.25)" strokeWidth="1" />
                <line x1="288" y1="190" x2="264" y2="250" className="tree-line-slow" stroke="rgba(245,158,11,0.2)" strokeWidth="1" />
                <line x1="288" y1="190" x2="312" y2="250" className="tree-line-slow" stroke="rgba(34,197,94,0.25)" strokeWidth="1" />

                {/* ── Lines: Attestors → Economic ── */}
                <line x1="72" y1="278" x2="180" y2="330" className="tree-line-slow" stroke="rgba(234,179,8,0.15)" strokeWidth="1" />
                <line x1="180" y1="278" x2="180" y2="330" className="tree-line-slow" stroke="rgba(234,179,8,0.15)" strokeWidth="1" />
                <line x1="288" y1="278" x2="180" y2="330" className="tree-line-slow" stroke="rgba(234,179,8,0.15)" strokeWidth="1" />

                {/* ── Lines: Economic → $402/$403 ── */}
                <line x1="180" y1="360" x2="140" y2="395" className="tree-line-slow" stroke="rgba(234,179,8,0.2)" strokeWidth="1" />
                <line x1="180" y1="360" x2="220" y2="395" className="tree-line-slow" stroke="rgba(168,85,247,0.2)" strokeWidth="1" />

                {/* ── Root Key node ── */}
                <rect x="128" y="24" width="104" height="54" rx="8" fill="rgba(34,197,94,0.08)" stroke="rgba(34,197,94,0.6)" strokeWidth="1.5" />
                <text x="180" y="47" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="11" fontFamily="var(--font-orbitron), monospace" fontWeight="700" letterSpacing="0.1em">ROOT KEY</text>
                <text x="180" y="64" textAnchor="middle" fill="rgba(161,161,170,0.7)" fontSize="8" fontFamily="monospace" letterSpacing="0.05em">self-signed</text>

                {/* ── Key ops (dashed pills) ── */}
                <rect x="268" y="36" width="56" height="24" rx="12" fill="none" stroke="rgba(134,239,172,0.25)" strokeWidth="1" strokeDasharray="3 2" />
                <text x="296" y="52" textAnchor="middle" fill="rgba(134,239,172,0.5)" fontSize="7" fontFamily="monospace">ROTATE</text>
                <line x1="232" y1="51" x2="268" y2="49" stroke="rgba(134,239,172,0.15)" strokeWidth="1" strokeDasharray="3 3" />

                {/* ── Strand: GitHub ── */}
                <rect x="28" y="148" width="88" height="46" rx="6" fill="rgba(245,158,11,0.06)" stroke="rgba(245,158,11,0.5)" strokeWidth="1" />
                <text x="72" y="168" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="10" fontFamily="var(--font-orbitron), monospace" fontWeight="700" letterSpacing="0.08em">STRAND</text>
                <text x="72" y="183" textAnchor="middle" fill="rgba(245,158,11,0.7)" fontSize="8" fontFamily="monospace">GitHub</text>

                {/* ── Strand: Twitter ── */}
                <rect x="136" y="148" width="88" height="46" rx="6" fill="rgba(245,158,11,0.06)" stroke="rgba(245,158,11,0.5)" strokeWidth="1" />
                <text x="180" y="168" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="10" fontFamily="var(--font-orbitron), monospace" fontWeight="700" letterSpacing="0.08em">STRAND</text>
                <text x="180" y="183" textAnchor="middle" fill="rgba(245,158,11,0.7)" fontSize="8" fontFamily="monospace">Twitter</text>

                {/* ── Strand: Google ── */}
                <rect x="244" y="148" width="88" height="46" rx="6" fill="rgba(245,158,11,0.06)" stroke="rgba(245,158,11,0.5)" strokeWidth="1" />
                <text x="288" y="168" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="10" fontFamily="var(--font-orbitron), monospace" fontWeight="700" letterSpacing="0.08em">STRAND</text>
                <text x="288" y="183" textAnchor="middle" fill="rgba(245,158,11,0.7)" fontSize="8" fontFamily="monospace">Google</text>

                {/* ── Attestors (small pills) ── */}
                {/* GitHub attestors */}
                <rect x="18" y="250" width="56" height="24" rx="12" fill="rgba(113,113,122,0.06)" stroke="rgba(113,113,122,0.35)" strokeWidth="1" />
                <text x="46" y="265" textAnchor="middle" fill="rgba(161,161,170,0.7)" fontSize="8" fontFamily="monospace">b0ase</text>
                <rect x="78" y="250" width="44" height="24" rx="12" fill="rgba(34,197,94,0.06)" stroke="rgba(34,197,94,0.4)" strokeWidth="1" />
                <text x="100" y="265" textAnchor="middle" fill="rgba(34,197,94,0.7)" fontSize="8" fontFamily="monospace">self</text>

                {/* Twitter attestors */}
                <rect x="132" y="250" width="48" height="24" rx="12" fill="rgba(113,113,122,0.06)" stroke="rgba(113,113,122,0.35)" strokeWidth="1" />
                <text x="156" y="265" textAnchor="middle" fill="rgba(161,161,170,0.7)" fontSize="8" fontFamily="monospace">x.com</text>
                <rect x="184" y="250" width="44" height="24" rx="12" fill="rgba(34,197,94,0.06)" stroke="rgba(34,197,94,0.4)" strokeWidth="1" />
                <text x="206" y="265" textAnchor="middle" fill="rgba(34,197,94,0.7)" fontSize="8" fontFamily="monospace">self</text>

                {/* Google attestors */}
                <rect x="240" y="250" width="56" height="24" rx="12" fill="rgba(113,113,122,0.06)" stroke="rgba(113,113,122,0.35)" strokeWidth="1" />
                <text x="268" y="265" textAnchor="middle" fill="rgba(161,161,170,0.7)" fontSize="8" fontFamily="monospace">google</text>
                <rect x="300" y="250" width="44" height="24" rx="12" fill="rgba(34,197,94,0.06)" stroke="rgba(34,197,94,0.4)" strokeWidth="1" />
                <text x="322" y="265" textAnchor="middle" fill="rgba(34,197,94,0.7)" fontSize="8" fontFamily="monospace">self</text>

                {/* ── Economic layer ── */}
                <rect x="125" y="322" width="110" height="42" rx="6" fill="rgba(234,179,8,0.05)" stroke="rgba(234,179,8,0.3)" strokeWidth="1" />
                <text x="180" y="341" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="10" fontFamily="var(--font-orbitron), monospace" fontWeight="700" letterSpacing="0.08em">ECONOMIC</text>
                <text x="180" y="356" textAnchor="middle" fill="rgba(234,179,8,0.6)" fontSize="8" fontFamily="monospace">layer</text>

                {/* ── $402 ── */}
                <rect x="104" y="386" width="66" height="30" rx="5" fill="rgba(234,179,8,0.05)" stroke="rgba(234,179,8,0.4)" strokeWidth="1" />
                <text x="137" y="405" textAnchor="middle" fill="rgba(234,179,8,0.8)" fontSize="10" fontFamily="var(--font-orbitron), monospace" fontWeight="700">$402</text>

                {/* ── $403 ── */}
                <rect x="190" y="386" width="66" height="30" rx="5" fill="rgba(168,85,247,0.05)" stroke="rgba(168,85,247,0.4)" strokeWidth="1" />
                <text x="223" y="405" textAnchor="middle" fill="rgba(168,85,247,0.8)" fontSize="10" fontFamily="var(--font-orbitron), monospace" fontWeight="700">$403</text>

                {/* ── Label row labels ── */}
                <text x="12" y="55" fill="rgba(34,197,94,0.4)" fontSize="7" fontFamily="monospace" fontWeight="700" letterSpacing="0.15em">ROOT</text>
                <text x="12" y="172" fill="rgba(245,158,11,0.4)" fontSize="7" fontFamily="monospace" fontWeight="700" letterSpacing="0.15em">STRANDS</text>
                <text x="12" y="265" fill="rgba(113,113,122,0.4)" fontSize="7" fontFamily="monospace" fontWeight="700" letterSpacing="0.12em">ATTESTORS</text>
                <text x="12" y="346" fill="rgba(234,179,8,0.4)" fontSize="7" fontFamily="monospace" fontWeight="700" letterSpacing="0.15em">ECON</text>
              </svg>
              </div>
            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />
      </section>

      {/* ═══ THE IDEA ═══ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="border-b border-zinc-200 dark:border-zinc-900"
      >
        <div className="max-w-[1920px] mx-auto px-6 md:px-16 py-16">
          <motion.div custom={0} variants={fadeIn} className="section-label">
            Find Yourself
          </motion.div>
          <div className="grid md:grid-cols-2 gap-0 border border-zinc-200 dark:border-zinc-800">
            <motion.div custom={0.1} variants={fadeUp} className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800">
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-6 font-display">
                EXPRESS<span className="text-zinc-300 dark:text-zinc-800">.</span><br />
                YOURSELF<span className="text-zinc-300 dark:text-zinc-800">.</span><br />
                ON-CHAIN<span className="text-zinc-300 dark:text-zinc-800">.</span>
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-md">
                Your identity isn&apos;t a username on someone else&apos;s server. It&apos;s a cryptographic proof
                that you exist, that you created, that you own. No platform can take it away.
                No corporation controls it. It&apos;s yours.
              </p>
            </motion.div>
            <div className="flex flex-col">
              <motion.div custom={0.2} variants={fadeUp} className="p-8 md:p-12 border-b border-zinc-200 dark:border-zinc-800 flex-1">
                <div className="text-[9px] text-zinc-500 font-mono uppercase tracking-[0.2em] mb-4">$402 says</div>
                <p className="text-xl font-black tracking-tight mb-2 text-zinc-400">&ldquo;Follow the money&rdquo;</p>
                <p className="text-zinc-500 text-sm">Payment flows, content access, economic coordination. The money side of the protocol.</p>
              </motion.div>
              <motion.div custom={0.3} variants={fadeUp} className="p-8 md:p-12 flex-1">
                <div className="text-[9px] text-green-500 font-mono uppercase tracking-[0.2em] mb-4">$401 says</div>
                <p className="text-xl font-black tracking-tight mb-2">&ldquo;Follow your own path&rdquo;</p>
                <p className="text-zinc-500 text-sm">Identity, authorship, reputation, self-sovereignty. The human side of the protocol.</p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══ HOW IT WORKS ═══ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="border-b border-zinc-200 dark:border-zinc-900"
      >
        <div className="max-w-[1920px] mx-auto px-6 md:px-16 py-16">
          <motion.div custom={0} variants={fadeIn} className="section-label">
            How Identity Works
          </motion.div>
          <div className="border border-zinc-200 dark:border-zinc-800">
            {[
              {
                step: '01',
                title: 'Link a social account',
                desc: 'Sign in with Google, Twitter, GitHub, Microsoft, Apple — any OAuth provider. Each connection proves you control that account right now.',
                accent: false,
              },
              {
                step: '02',
                title: 'Mint a strand',
                desc: 'Each linked account becomes a strand on your key chain — inscribed on the blockchain with a SHA-256 proof. One penny per strand.',
                accent: false,
              },
              {
                step: '03',
                title: 'Build your key chain',
                desc: 'Link more accounts, bind strands together. The more keys on your chain, the stronger your identity. Self-attested or service-attested.',
                accent: false,
              },
              {
                step: '04',
                title: 'Unlock the protocol',
                desc: 'Your $401 key chain pairs with $402 (payment) and $403 (conditions). Earn dividends, operate nodes, write contracts, commit code.',
                accent: true,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                custom={0.1 + i * 0.08}
                variants={slideRight}
                className={`flex items-start gap-6 p-6 ${
                  i < 3 ? 'border-b border-zinc-200 dark:border-zinc-800' : ''
                } hover:bg-zinc-50 dark:hover:bg-zinc-900/20 transition-colors`}
              >
                <span className={`w-10 h-10 flex items-center justify-center text-xs font-display font-bold shrink-0 ${
                  item.accent ? 'bg-green-500 text-white' : 'bg-zinc-100 dark:bg-zinc-900'
                }`}>
                  {item.step}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold tracking-tight mb-1">{item.title}</p>
                  <p className="text-zinc-500 text-sm">{item.desc}</p>
                </div>
                {item.accent && (
                  <span className="relative flex h-2 w-2 self-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ═══ THE PAIR ═══ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="border-b border-zinc-200 dark:border-zinc-900"
      >
        <div className="max-w-[1920px] mx-auto px-6 md:px-16 py-16">
          <motion.div custom={0} variants={fadeIn} className="section-label">
            The $401 / $402 Pair
          </motion.div>
          <div className="grid md:grid-cols-2 gap-0 border border-zinc-200 dark:border-zinc-800">
            <motion.div custom={0.1} variants={fadeUp} className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800">
              <h3 className="text-lg font-display font-black tracking-tight mb-6 uppercase">
                $401<span className="text-green-300 dark:text-green-800"> Identity</span>
              </h3>
              <div className="space-y-4">
                {[
                  ['Purpose', 'Prove who you are, cryptographically'],
                  ['Root', 'Encrypted passport inscription on-chain'],
                  ['Symbol', 'Your name — $BOASE, $ALICE, $YOU'],
                  ['Unlocks', 'Dividends, node ops, legal docs, code attribution'],
                ].map(([label, desc]) => (
                  <div key={label} className="flex gap-4">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-500 w-24 shrink-0 pt-0.5">{label}</span>
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">{desc}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div custom={0.2} variants={fadeUp} className="p-8 md:p-10">
              <h3 className="text-lg font-display font-black tracking-tight mb-6 uppercase">
                $402<span className="text-zinc-300 dark:text-zinc-700"> Payment</span>
              </h3>
              <div className="space-y-4">
                {[
                  ['Purpose', 'Pay for content, earn from serving'],
                  ['Standard', 'BSV-21 via POW20 mining'],
                  ['Utility', 'Content access, staking, protocol fees'],
                  ['Unlocks', 'Browsing, speculation, content distribution'],
                ].map(([label, desc]) => (
                  <div key={label} className="flex gap-4">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-500 w-24 shrink-0 pt-0.5">{label}</span>
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">{desc}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
          <motion.p custom={0.3} variants={fadeIn} className="text-zinc-500 text-xs mt-4 font-mono">
            Anonymous by default. Identity when you choose it. The $401 is never required for basic browsing &mdash; only for building, earning, and owning.
          </motion.p>
        </div>
      </motion.section>

      {/* ═══ WHAT $401 UNLOCKS ═══ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="border-b border-zinc-200 dark:border-zinc-900"
      >
        <div className="max-w-[1920px] mx-auto px-6 md:px-16 py-16">
          <motion.div custom={0} variants={fadeIn} className="section-label">
            What Identity Unlocks
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-zinc-200 dark:border-zinc-800">
            {[
              {
                icon: '\u270D',
                title: 'Bitcoin Writer',
                desc: 'Write documents to the blockchain with verified authorship. Wills, contracts, blog posts — all legally anchored to your identity.',
                tag: '$bWriter',
              },
              {
                icon: '\u2318',
                title: 'Bitcoin Code',
                desc: 'Commit code on-chain with attribution. Every line you write is tracked, credited, and potentially compensated.',
                tag: '$bCode',
              },
              {
                icon: '\u26A1',
                title: 'Node Operations',
                desc: 'Run a path402d node with a verified identity. Other nodes trust you. The network rewards you. Indexing becomes income.',
                tag: 'path402d',
              },
              {
                icon: '\u2194',
                title: 'Dividends & Staking',
                desc: 'Stake $402 tokens and receive dividends. KYC is required for financial returns — your $401 satisfies it automatically.',
                tag: 'economics',
              },
              {
                icon: '\uD83C\uDFAD',
                title: 'Reputation',
                desc: 'Your identity accumulates history. Every document written, every commit made, every node uptime — all provably yours.',
                tag: 'trust',
              },
              {
                icon: '\uD83D\uDD12',
                title: 'Self-Sovereignty',
                desc: 'No platform owns your identity. No company can delete it. Your encrypted passport bundle is yours, forever, on-chain.',
                tag: 'ownership',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                custom={0.1 + i * 0.08}
                variants={scaleIn}
                className={`p-8 hover:bg-zinc-50 dark:hover:bg-zinc-900/20 transition-colors ${
                  i % 3 !== 2 ? 'md:border-r border-zinc-200 dark:border-zinc-800' : ''
                } ${i < 3 ? 'border-b border-zinc-200 dark:border-zinc-800' : ''}`}
              >
                <div className="text-2xl mb-3 opacity-60">{item.icon}</div>
                <h3 className="text-sm font-black uppercase tracking-wider mb-2">{item.title}</h3>
                <p className="text-zinc-500 text-sm mb-3">{item.desc}</p>
                <span className="text-[8px] font-mono text-green-500 uppercase tracking-widest">{item.tag}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ═══ ACCESS SPECTRUM ═══ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="border-b border-zinc-200 dark:border-zinc-900"
      >
        <div className="max-w-[1920px] mx-auto px-6 md:px-16 py-16">
          <motion.div custom={0} variants={fadeIn} className="section-label">
            Access Spectrum
          </motion.div>
          <div className="border border-zinc-200 dark:border-zinc-800 overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
                  <th className="text-left p-4 text-[9px] font-bold uppercase tracking-widest text-zinc-500">Activity</th>
                  <th className="text-center p-4 text-[9px] font-bold uppercase tracking-widest text-green-500">$401</th>
                  <th className="text-center p-4 text-[9px] font-bold uppercase tracking-widest text-zinc-500">$402</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Browse paywalled content', '\u2013', '\u2713'],
                  ['Speculate on content tokens', '\u2013', '\u2713'],
                  ['Sell tokens to peers', '\u2013', '\u2713'],
                  ['Earn serving rewards', 'Optional', '\u2713'],
                  ['Stake for dividends', '\u2713', '\u2713'],
                  ['Write to chain (Bitcoin Writer)', '\u2713', '\u2713'],
                  ['Commit code (Bitcoin Code)', '\u2713', '\u2713'],
                  ['Mint new content tokens', '\u2713', '\u2713'],
                  ['Operate a path402d node', '\u2713', '\u2713'],
                ].map(([activity, needs401, needs402], i) => (
                  <tr
                    key={activity}
                    className={`${i < 8 ? 'border-b border-zinc-200 dark:border-zinc-800' : ''} hover:bg-zinc-50 dark:hover:bg-zinc-900/20 transition-colors`}
                  >
                    <td className="p-4 text-sm">{activity}</td>
                    <td className={`p-4 text-center text-sm ${needs401 === '\u2713' ? 'text-green-500 font-bold' : needs401 === 'Optional' ? 'text-amber-500' : 'text-zinc-400'}`}>
                      {needs401}
                    </td>
                    <td className={`p-4 text-center text-sm ${needs402 === '\u2713' ? 'text-green-500 font-bold' : 'text-zinc-400'}`}>
                      {needs402}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <motion.p custom={0.3} variants={fadeIn} className="text-zinc-500 text-xs mt-4 font-mono">
            Anonymous by default. The protocol doesn&apos;t require identity until you want to build, earn, or own.
          </motion.p>
        </div>
      </motion.section>

      {/* ═══ TRUST MODEL ═══ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="border-b border-zinc-200 dark:border-zinc-900"
      >
        <div className="max-w-[1920px] mx-auto px-6 md:px-16 py-16">
          <motion.div custom={0} variants={fadeIn} className="section-label">
            Trust Model
          </motion.div>
          <motion.p custom={0.05} variants={fadeUp} className="text-zinc-500 text-sm font-mono mb-8 max-w-2xl">
            We believe transparency is the foundation of trust. Here is exactly what is centralised,
            what is decentralised, and what we&apos;re working on. No hand-waving.
          </motion.p>
          <div className="grid md:grid-cols-2 gap-0 border border-zinc-200 dark:border-zinc-800">
            {/* What's centralised */}
            <motion.div custom={0.1} variants={fadeUp} className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <h3 className="text-sm font-display font-black uppercase tracking-wider">What&apos;s Centralised</h3>
              </div>
              <div className="space-y-4">
                {[
                  ['User accounts', 'Your account lives in our database on a server we control. We can read it. We could delete it.'],
                  ['Attestation service', 'Right now, b0ase.com signs your strands. We are the attestor. That means you\'re trusting us.'],
                  ['Payment', 'HandCash processes payments. They are a custodial wallet. Your keys, their server.'],
                  ['OAuth providers', 'Google, Twitter, GitHub verify your accounts. If they revoke access, the strand still exists on-chain but can\'t be re-verified.'],
                ].map(([label, desc]) => (
                  <div key={label}>
                    <p className="text-sm font-bold mb-1">{label}</p>
                    <p className="text-zinc-500 text-xs leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* What's decentralised */}
            <motion.div custom={0.2} variants={fadeUp} className="p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
                <h3 className="text-sm font-display font-black uppercase tracking-wider">What&apos;s On-Chain</h3>
              </div>
              <div className="space-y-4">
                {[
                  ['Your inscriptions', 'Every strand is written to the BSV blockchain. We can\'t edit it, delete it, or pretend it doesn\'t exist. Anyone can verify it.'],
                  ['Your root key', 'If you sign with your own key (via Yours wallet or bit-sign.online), you hold the root. We don\'t.'],
                  ['The code', 'This site\'s source code is on GitHub. Every commit is inscribed on-chain via BitGit. You can audit everything.'],
                  ['The proofs', 'SHA-256 hashes of your OAuth tokens are inscribed. The math is public. The verification is permissionless.'],
                ].map(([label, desc]) => (
                  <div key={label}>
                    <p className="text-sm font-bold mb-1">{label}</p>
                    <p className="text-zinc-500 text-xs leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* The roadmap to sovereignty */}
          <motion.div custom={0.3} variants={fadeUp} className="border border-zinc-200 dark:border-zinc-800 border-t-0 p-8 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-3 h-3 rounded-full bg-green-500/80 animate-pulse" />
              <h3 className="text-sm font-display font-black uppercase tracking-wider">The Path To Self-Sovereignty</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  phase: 'Now',
                  status: 'live',
                  desc: 'b0ase.com signs your strands. You trust us. Your inscriptions are on-chain and permanent, but we are the attestor.',
                },
                {
                  phase: 'Next',
                  status: 'building',
                  desc: 'Self-signing via your own BSV key. You sign your own strands. b0ase becomes optional, not required. Peer attestation begins.',
                },
                {
                  phase: 'Goal',
                  status: 'planned',
                  desc: 'Fully self-sovereign. No b0ase dependency. Any wallet, any attestor, any verifier. The protocol runs without us.',
                },
              ].map((item) => (
                <div key={item.phase}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-green-500">{item.phase}</span>
                    <span className={`text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded ${
                      item.status === 'live' ? 'bg-green-500/10 text-green-400' :
                      item.status === 'building' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-zinc-500/10 text-zinc-500'
                    }`}>{item.status}</span>
                  </div>
                  <p className="text-zinc-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.p custom={0.4} variants={fadeIn} className="text-zinc-500 text-xs mt-4 font-mono">
            We are not decentralised yet. We are building towards it, in public, with every commit inscribed on-chain.
            If we disappear tomorrow, your inscriptions survive. That&apos;s the minimum guarantee.
          </motion.p>
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
            SIGN IN TO<br />
            <span className="text-green-500">THE BLOCKCHAIN</span>
          </motion.h2>
          <motion.p
            custom={0.2}
            variants={fadeIn}
            className="text-zinc-500 mb-10 text-sm font-mono"
          >
            Link your socials. Mint your key chain. One penny per strand.
          </motion.p>
          <motion.div custom={0.3} variants={fadeUp} className="flex flex-wrap justify-center gap-4">
            <Link
              href="/identity"
              className="inline-flex items-center gap-3 px-10 py-5 bg-green-600 text-white font-bold uppercase tracking-widest text-xs hover:bg-green-700 transition-colors"
            >
              Link Your Socials
            </Link>
            <Link
              href="/id-tree"
              className="inline-flex items-center gap-2 px-10 py-5 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold uppercase tracking-widest text-xs hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              How It Works &rarr;
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
