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
          style={{ filter: 'hue-rotate(85deg) saturate(1.6) brightness(1.4)' }}
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
                HTTP 401 : UNAUTHORIZED
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
              className="text-zinc-500 max-w-xl text-sm leading-relaxed mb-8 font-mono"
            >
              Link your socials. Mint your key chain.
              One penny per strand. Anchored to your root key on the blockchain forever.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex items-center gap-4"
            >
              <Link href="/id-tree" className="text-[9px] font-mono text-green-500/70 hover:text-green-400 uppercase tracking-widest transition-colors">
                How It Works &rarr;
              </Link>
            </motion.div>
          </div>

          {/* Right: Interactive Key Chain Card (desktop only) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease }}
            className="hidden lg:block w-[560px] xl:w-[640px] shrink-0"
          >
            <div className="border border-zinc-800 bg-zinc-950/80 backdrop-blur-sm overflow-hidden">
              {/* Title bar */}
              <div className="px-5 py-2.5 flex items-center justify-between border-b border-green-500/20 bg-green-500/5">
                <span className="text-[9px] font-mono font-bold text-green-400/70 uppercase tracking-[0.2em]">$401 Key Chain</span>
                <div className="flex items-center gap-3">
                  <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">1&cent; per strand</span>
                  <Link href="/id-tree" className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest hover:text-green-400 transition-colors">
                    Details &rarr;
                  </Link>
                </div>
              </div>

              {/* Tree layout */}
              <div className="p-6 md:p-8">
                {/* ROOT KEY */}
                <div className="flex justify-center mb-2">
                  <div className="px-6 py-3 border-2 border-green-500/60 bg-green-500/8 rounded-lg text-center">
                    <div className="font-display font-black text-sm tracking-wider text-white">ROOT KEY</div>
                    <div className="text-[9px] font-mono text-zinc-500 mt-0.5">your private key &mdash; self-signed</div>
                  </div>
                </div>

                {/* Connector: root → strands */}
                <div className="flex justify-center">
                  <div className="w-px h-6 bg-gradient-to-b from-green-500/40 to-green-500/20" />
                </div>

                {/* STRANDS label */}
                <div className="text-center mb-3">
                  <span className="text-[8px] font-mono font-bold text-amber-500/50 uppercase tracking-[0.2em]">Link a strand</span>
                </div>

                {/* OAuth provider strand buttons — 6 across */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-2">
                  {[
                    { name: 'Google', color: 'hover:border-[#4285F4]/50 hover:shadow-[0_0_12px_rgba(66,133,244,0.15)]', icon: (
                      <svg viewBox="0 0 24 24" className="w-6 h-6">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    )},
                    { name: 'Twitter', color: 'hover:border-white/30 hover:shadow-[0_0_12px_rgba(255,255,255,0.1)]', icon: (
                      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    )},
                    { name: 'GitHub', color: 'hover:border-white/30 hover:shadow-[0_0_12px_rgba(255,255,255,0.1)]', icon: (
                      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white">
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                      </svg>
                    )},
                    { name: 'Microsoft', color: 'hover:border-[#00A4EF]/50 hover:shadow-[0_0_12px_rgba(0,164,239,0.15)]', icon: (
                      <svg viewBox="0 0 24 24" className="w-6 h-6">
                        <path d="M3 3h8.5v8.5H3V3z" fill="#F25022"/>
                        <path d="M12.5 3H21v8.5h-8.5V3z" fill="#7FBA00"/>
                        <path d="M3 12.5h8.5V21H3v-8.5z" fill="#00A4EF"/>
                        <path d="M12.5 12.5H21V21h-8.5v-8.5z" fill="#FFB900"/>
                      </svg>
                    )},
                    { name: 'Apple', color: 'hover:border-white/30 hover:shadow-[0_0_12px_rgba(255,255,255,0.1)]', icon: (
                      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white">
                        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.32 2.32-1.55 4.31-3.74 4.25z"/>
                      </svg>
                    )},
                    { name: 'LinkedIn', color: 'hover:border-[#0A66C2]/50 hover:shadow-[0_0_12px_rgba(10,102,194,0.15)]', icon: (
                      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#0A66C2">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    )},
                  ].map((provider) => (
                    <Link
                      key={provider.name}
                      href="/identity"
                      className={`group flex flex-col items-center gap-2 py-4 px-3 border border-zinc-800/80 bg-zinc-900/40 transition-all duration-200 ${provider.color}`}
                    >
                      <span className="opacity-60 group-hover:opacity-100 transition-opacity">{provider.icon}</span>
                      <span className="text-[9px] font-mono text-zinc-500 group-hover:text-white uppercase tracking-widest transition-colors">{provider.name}</span>
                      <span className="text-[7px] font-mono text-amber-500/40 group-hover:text-amber-400/70 uppercase tracking-widest transition-colors">strand</span>
                    </Link>
                  ))}
                </div>

                {/* Connector: strands → economic */}
                <div className="flex justify-center">
                  <div className="w-px h-5 bg-gradient-to-b from-amber-500/20 to-yellow-500/10" />
                </div>

                {/* Economic layer + $402/$403 */}
                <div className="flex justify-center gap-3">
                  <Link href="https://path402.com" className="px-4 py-2 border border-yellow-500/30 bg-yellow-500/5 text-center hover:border-yellow-500/50 transition-colors">
                    <div className="font-display font-bold text-xs text-yellow-500/80">$402</div>
                    <div className="text-[7px] font-mono text-zinc-600">payment</div>
                  </Link>
                  <Link href="/id-tree" className="px-4 py-2 border border-purple-500/30 bg-purple-500/5 text-center hover:border-purple-500/50 transition-colors">
                    <div className="font-display font-bold text-xs text-purple-500/80">$403</div>
                    <div className="text-[7px] font-mono text-zinc-600">conditions</div>
                  </Link>
                </div>
              </div>
            </div>
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
