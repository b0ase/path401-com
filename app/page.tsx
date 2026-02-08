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

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white">

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[80vh] flex flex-col justify-center overflow-hidden bg-black">
        {/* Background video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        >
          <source src="/401-8.mp4" type="video/mp4" />
        </video>

        {/* Background texture */}
        <div
          className="absolute inset-0 pointer-events-none bg-cover bg-center opacity-40"
          style={{ backgroundImage: 'url(/hero-bg.png)' }}
        />

        {/* CRT vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)',
          }}
        />

        {/* HUD corners */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-violet-500/10" />
          <div className="absolute top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-violet-500/10" />
          <div className="absolute bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-violet-500/10" />
          <div className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-violet-500/10" />
          <div className="absolute top-8 left-20 text-[7px] font-mono text-zinc-700 tracking-[0.25em]">
            IDENTITY PROTOCOL v1.0
          </div>
          <div className="absolute bottom-8 left-20 text-[7px] font-mono text-zinc-700 tracking-[0.25em]">
            HTTP 401: UNAUTHORIZED
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 px-6 md:px-16 max-w-[1920px] mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
            </span>
            <span className="text-zinc-600 text-[10px] tracking-[0.3em] uppercase font-mono font-bold">
              HTTP 401 : UNAUTHORIZED &mdash; PROVE WHO YOU ARE
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            className="font-display font-black tracking-tighter leading-[0.85] mb-2"
            style={{
              fontSize: 'clamp(4rem, 12vw, 12rem)',
              textShadow: '0 0 10px rgba(139, 92, 246, 0.4), 0 0 30px rgba(139, 92, 246, 0.2), 0 0 60px rgba(139, 92, 246, 0.1)',
            }}
          >
            <span className="text-white">$401</span>
          </motion.h1>

          {/* Reflection */}
          <div
            className="relative overflow-hidden h-12 md:h-20 select-none mb-8"
            aria-hidden="true"
            style={{
              transform: 'scaleY(-1)',
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(255,255,255,0.1), transparent 80%)',
              maskImage: 'linear-gradient(to bottom, rgba(255,255,255,0.1), transparent 80%)',
            }}
          >
            <div
              className="font-display font-black tracking-tighter leading-[0.85] text-violet-400/30"
              style={{ fontSize: 'clamp(4rem, 12vw, 12rem)' }}
            >
              $401
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-2"
          >
            <span className="text-xl md:text-2xl font-display font-black text-white uppercase tracking-tight">
              PATH 401 &mdash; FOLLOW YOUR OWN PATH
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-4"
          >
            <span className="text-zinc-500 text-xs tracking-[0.4em] uppercase font-mono">
              YOUR IDENTITY. YOUR NAME. YOUR TOKEN.
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-zinc-500 max-w-xl text-sm leading-relaxed mb-12 font-mono"
          >
            Before you can follow the money, you need to know who you are.
            The <code className="text-violet-400 bg-zinc-900 px-1.5 py-0.5 border border-zinc-800">$401</code> token
            is your cryptographic identity &mdash; encrypted, self-sovereign, and inscribed on-chain forever.
            Your peers decide what it&apos;s worth.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex flex-wrap gap-4"
          >
            <a
              href="https://path402.com/identity"
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-violet-600 text-white font-bold uppercase tracking-widest text-xs hover:bg-violet-700 transition-all overflow-hidden"
            >
              Mint Your Identity
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </a>
            <a
              href="https://bit-sign.online"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 border border-zinc-800 text-zinc-400 font-bold uppercase tracking-widest text-xs hover:border-zinc-600 hover:text-white transition-all"
            >
              bit-sign.online &rarr;
            </a>
            <Link
              href="/spec"
              className="inline-flex items-center gap-3 px-8 py-4 border border-zinc-800 text-zinc-400 font-bold uppercase tracking-widest text-xs hover:border-violet-500/50 hover:text-violet-400 transition-all"
            >
              Read the Spec &rarr;
            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
      </section>

      {/* ═══ PEER UNDERWRITING ═══ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="border-b border-zinc-200 dark:border-zinc-900"
      >
        <div className="max-w-[1920px] mx-auto px-6 md:px-16 py-16">
          <motion.div custom={0} variants={fadeIn} className="section-label">
            The Third Way
          </motion.div>
          <motion.div custom={0.05} variants={fadeIn} className="mb-6 border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <img
              src="/third-way.png"
              alt="Three approaches to identity: surveillance, corporate, and peer-underwritten"
              className="w-full h-auto opacity-80 dark:opacity-60"
            />
          </motion.div>
          <div className="grid md:grid-cols-3 gap-0 border border-zinc-200 dark:border-zinc-800">
            <motion.div custom={0.1} variants={fadeUp} className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800">
              <div className="text-[9px] text-red-500 font-mono uppercase tracking-[0.2em] mb-4">Old Way #1</div>
              <p className="text-lg font-black tracking-tight mb-2">Anonymity</p>
              <p className="text-zinc-500 text-sm">No accountability. Enables trolls, scammers, and sock puppets. The internet&apos;s original sin.</p>
            </motion.div>
            <motion.div custom={0.2} variants={fadeUp} className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800">
              <div className="text-[9px] text-amber-500 font-mono uppercase tracking-[0.2em] mb-4">Old Way #2</div>
              <p className="text-lg font-black tracking-tight mb-2">Centralised KYC</p>
              <p className="text-zinc-500 text-sm">Hand your documents to a corporation. They verify you. They own the relationship. They can revoke it.</p>
            </motion.div>
            <motion.div custom={0.3} variants={fadeUp} className="p-8 md:p-10">
              <div className="text-[9px] text-violet-500 font-mono uppercase tracking-[0.2em] mb-4">$401 Way</div>
              <p className="text-lg font-black tracking-tight mb-2">Peer Underwriting</p>
              <p className="text-zinc-500 text-sm">You issue your identity. Your peers stake on it. The market decides what your reputation is worth. No central authority.</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ═══ FIND YOURSELF ═══ */}
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
                <div className="text-[9px] text-violet-500 font-mono uppercase tracking-[0.2em] mb-4">$401 says</div>
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
                title: 'Encrypt your documents',
                desc: 'At bit-sign.online, encrypt your passport or ID into a sealed cryptographic bundle. Nobody can read it without your key.',
                accent: false,
              },
              {
                step: '02',
                title: 'Inscribe the root',
                desc: 'The encrypted bundle is written to the blockchain as your root inscription — a permanent, tamper-proof anchor for your identity.',
                accent: false,
              },
              {
                step: '03',
                title: 'Mint your $401 token',
                desc: 'Choose your symbol — $BOASE, $ALICE, $YOU — and mint your identity token. It traces back to your root inscription forever.',
                accent: false,
              },
              {
                step: '04',
                title: 'Peers stake on you',
                desc: 'Other $401 holders lock tokens against your identity. Their stake says "I vouch for this person." More stake = higher trust score.',
                accent: false,
              },
              {
                step: '05',
                title: 'Pair with $402',
                desc: 'Your $401 unlocks the full protocol. Earn dividends, operate nodes, write legally binding documents, commit code with attribution.',
                accent: true,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                custom={0.1 + i * 0.08}
                variants={slideRight}
                className={`flex items-start gap-6 p-6 ${
                  i < 4 ? 'border-b border-zinc-200 dark:border-zinc-800' : ''
                } hover:bg-zinc-50 dark:hover:bg-zinc-900/20 transition-colors`}
              >
                <span className={`w-10 h-10 flex items-center justify-center text-xs font-display font-bold shrink-0 ${
                  item.accent ? 'bg-violet-500 text-white' : 'bg-zinc-100 dark:bg-zinc-900'
                }`}>
                  {item.step}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold tracking-tight mb-1">{item.title}</p>
                  <p className="text-zinc-500 text-sm">{item.desc}</p>
                </div>
                {item.accent && (
                  <span className="relative flex h-2 w-2 self-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
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
                $401<span className="text-violet-300 dark:text-violet-800"> Identity</span>
              </h3>
              <div className="space-y-4">
                {[
                  ['Purpose', 'Prove who you are, cryptographically'],
                  ['Root', 'Encrypted passport inscription on-chain'],
                  ['Symbol', 'Your name — $BOASE, $ALICE, $YOU'],
                  ['Staking', 'Peers lock tokens to vouch for you'],
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
                  ['Economics', 'Proof of indexing rewards'],
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
                <span className="text-[8px] font-mono text-violet-500 uppercase tracking-widest">{item.tag}</span>
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
                  <th className="text-center p-4 text-[9px] font-bold uppercase tracking-widest text-violet-500">$401</th>
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
                    <td className={`p-4 text-center text-sm ${needs401 === '\u2713' ? 'text-violet-500 font-bold' : needs401 === 'Optional' ? 'text-amber-500' : 'text-zinc-400'}`}>
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

      {/* ═══ TRUST SCORE ═══ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="border-b border-zinc-200 dark:border-zinc-900"
      >
        <div className="max-w-[1920px] mx-auto px-6 md:px-16 py-16">
          <motion.div custom={0} variants={fadeIn} className="section-label">
            Trust Score
          </motion.div>
          <div className="border border-zinc-200 dark:border-zinc-800">
            <motion.div custom={0.05} variants={fadeIn} className="border-b border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <img
                src="/trust-score.png"
                alt="Four trust levels from self-declared to institutionally verified"
                className="w-full h-auto max-h-64 object-contain mx-auto opacity-80 dark:opacity-60 py-6"
              />
            </motion.div>
            <motion.div custom={0.1} variants={fadeUp} className="p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-black tracking-tighter mb-6 font-display">
                NOT A SOCIAL CREDIT SCORE<span className="text-violet-500">.</span>
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-2xl mb-8">
                Your trust score isn&apos;t controlled by any authority. It&apos;s the sum of what your peers are willing to risk on your reputation.
                Stakers lock real value against your identity. If you misbehave, they lose money. That&apos;s the incentive alignment.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-zinc-200 dark:border-zinc-800">
                {[
                  { level: '0', label: 'Self-Declared', desc: 'Token minted, no external validation', color: 'text-zinc-500' },
                  { level: '1', label: 'Peer-Vouched', desc: 'At least one staker backing you', color: 'text-amber-500' },
                  { level: '2', label: 'Community-Trusted', desc: 'Multiple stakers, sustained uptime', color: 'text-violet-500' },
                  { level: '3', label: 'Institutionally-Verified', desc: 'Professional attestation on-chain', color: 'text-green-500' },
                ].map((item, i) => (
                  <motion.div
                    key={item.level}
                    custom={0.2 + i * 0.08}
                    variants={scaleIn}
                    className={`p-6 ${i < 3 ? 'border-r border-zinc-200 dark:border-zinc-800' : ''}`}
                  >
                    <div className={`text-3xl font-display font-black mb-2 ${item.color}`}>{item.level}</div>
                    <p className="text-xs font-bold uppercase tracking-wider mb-1">{item.label}</p>
                    <p className="text-zinc-500 text-xs">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
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
            FOLLOW YOUR<br />
            <span className="text-violet-500">OWN PATH</span>
          </motion.h2>
          <motion.p
            custom={0.2}
            variants={fadeIn}
            className="text-zinc-500 mb-10 text-sm font-mono"
          >
            Mint your identity. Own your name. Build on the protocol.
          </motion.p>
          <motion.div custom={0.3} variants={fadeUp} className="flex flex-wrap justify-center gap-4">
            <a
              href="https://path402.com/identity"
              className="inline-flex items-center gap-3 px-10 py-5 bg-violet-600 text-white font-bold uppercase tracking-widest text-xs hover:bg-violet-700 transition-colors"
            >
              Mint $401 Identity
            </a>
            <Link
              href="/spec"
              className="inline-flex items-center gap-2 px-10 py-5 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold uppercase tracking-widest text-xs hover:border-violet-500/50 hover:text-violet-400 transition-colors"
            >
              Read the Spec &rarr;
            </Link>
            <a
              href="https://path402.com"
              className="inline-flex items-center gap-2 px-10 py-5 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold uppercase tracking-widest text-xs hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              $402 Protocol &rarr;
            </a>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
