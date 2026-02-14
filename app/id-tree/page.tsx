'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// ─── Tree Node Data ───
interface IdNode {
  id: string;
  label: string;
  sublabel: string;
  color: string;       // hex
  icon: string;        // emoji
  pos: [number, number, number];
  parentId?: string;
  detail: { title: string; body: string[] };
}

const NODES: IdNode[] = [
  // Root
  {
    id: 'root', label: 'ROOT KEY', sublabel: 'Self-Signed', color: '#22c55e', icon: '🔑',
    pos: [0, 0, 0],
    detail: {
      title: 'Root Key — The Anchor',
      body: [
        'Your BSV private key. This is the cryptographic anchor of your entire identity tree.',
        'Self-signed means you created it, you control it, no service was involved. The strongest form of digital identity.',
        'Everything branches from this root. Whoever holds this key IS the identity.',
      ],
    },
  },
  // Key operations
  {
    id: 'rotate', label: 'ROTATE', sublabel: 'Key Op', color: '#4ade80', icon: '🔄',
    pos: [-4, 1, -3], parentId: 'root',
    detail: {
      title: 'Key Rotation',
      body: [
        'Delegate your identity to a new key. The old key signs the handover, proving continuity.',
        'Essential for security — if compromised, rotate without losing identity.',
      ],
    },
  },
  {
    id: 'revoke', label: 'REVOKE', sublabel: 'Key Op', color: '#ef4444', icon: '🚫',
    pos: [4, 1, -3], parentId: 'root',
    detail: {
      title: 'Key Revocation',
      body: [
        'Nuclear option — invalidate the root key entirely. All strands become orphaned.',
        'Use only in emergencies. Permanent and irreversible.',
      ],
    },
  },
  // OAuth Provider Strands (the leaves)
  {
    id: 'github', label: 'GitHub', sublabel: 'OAuth Strand', color: '#f0f0f0', icon: '🐙',
    pos: [-8, 8, 4], parentId: 'root',
    detail: {
      title: 'GitHub Identity Strand',
      body: [
        'Proves you controlled a GitHub account at a point in time.',
        'Inscribes: provider, handle, SHA-256 of OAuth token, timestamp.',
        'Permanent on-chain proof — even if you lose access later.',
      ],
    },
  },
  {
    id: 'twitter', label: 'Twitter / X', sublabel: 'OAuth Strand', color: '#1d9bf0', icon: '🐦',
    pos: [0, 10, 6], parentId: 'root',
    detail: {
      title: 'Twitter Identity Strand',
      body: [
        'Proves you controlled a Twitter/X account.',
        'Your follower graph becomes verifiable identity.',
        'Permanent even if Twitter bans your account.',
      ],
    },
  },
  {
    id: 'google', label: 'Google', sublabel: 'OAuth Strand', color: '#ea4335', icon: '📧',
    pos: [8, 8, 4], parentId: 'root',
    detail: {
      title: 'Google Identity Strand',
      body: [
        'Proves you controlled a Google account (email).',
        'Links to workspace, calendar, drive permissions.',
        'Snapshot proof — exists even if OAuth token revoked.',
      ],
    },
  },
  {
    id: 'apple', label: 'Apple', sublabel: 'OAuth Strand', color: '#a3a3a3', icon: '🍎',
    pos: [-6, 9, -5], parentId: 'root',
    detail: {
      title: 'Apple Identity Strand',
      body: [
        'Proves you controlled an Apple ID.',
        'Links to App Store, iCloud, developer program.',
        'Privacy-preserving: Apple hides email by default.',
      ],
    },
  },
  {
    id: 'microsoft', label: 'Microsoft', sublabel: 'OAuth Strand', color: '#00a4ef', icon: '🪟',
    pos: [6, 9, -5], parentId: 'root',
    detail: {
      title: 'Microsoft Identity Strand',
      body: [
        'Proves you controlled a Microsoft account.',
        'Links to Azure, Office 365, enterprise identity.',
        'Bridges corporate and personal identity.',
      ],
    },
  },
  {
    id: 'discord', label: 'Discord', sublabel: 'OAuth Strand', color: '#5865f2', icon: '💬',
    pos: [-10, 6, 0], parentId: 'root',
    detail: {
      title: 'Discord Identity Strand',
      body: [
        'Proves you controlled a Discord account.',
        'Server memberships, roles, and community presence.',
        'Bridges gaming and community identity.',
      ],
    },
  },
  {
    id: 'linkedin', label: 'LinkedIn', sublabel: 'OAuth Strand', color: '#0a66c2', icon: '💼',
    pos: [10, 6, 0], parentId: 'root',
    detail: {
      title: 'LinkedIn Identity Strand',
      body: [
        'Proves you controlled a LinkedIn account.',
        'Professional network, employment history, credentials.',
        'The strongest professional identity strand.',
      ],
    },
  },
  {
    id: 'facebook', label: 'Facebook', sublabel: 'OAuth Strand', color: '#1877f2', icon: '👤',
    pos: [-4, 7, 8], parentId: 'root',
    detail: {
      title: 'Facebook Identity Strand',
      body: [
        'Proves you controlled a Facebook account.',
        'Social graph, pages, groups, marketplace activity.',
        'Bridges social and commercial identity.',
      ],
    },
  },
  {
    id: 'spotify', label: 'Spotify', sublabel: 'OAuth Strand', color: '#1db954', icon: '🎵',
    pos: [4, 7, 8], parentId: 'root',
    detail: {
      title: 'Spotify Identity Strand',
      body: [
        'Proves you controlled a Spotify account.',
        'Playlists, listening history, artist connections.',
        'Cultural identity through music taste.',
      ],
    },
  },
  {
    id: 'twitch', label: 'Twitch', sublabel: 'OAuth Strand', color: '#9146ff', icon: '🎮',
    pos: [0, 5, -7], parentId: 'root',
    detail: {
      title: 'Twitch Identity Strand',
      body: [
        'Proves you controlled a Twitch account.',
        'Streaming history, subscriber count, community.',
        'Bridges creator and entertainment identity.',
      ],
    },
  },
  // Economic layer
  {
    id: 'economic', label: '$402', sublabel: 'Payment Layer', color: '#eab308', icon: '💰',
    pos: [-3, -5, 2], parentId: 'root',
    detail: {
      title: '$402 — Payment Paths',
      body: [
        'Your root key has a payTo address — revenue flows here.',
        'Verified identity required for staking and dividends.',
        'More strands = higher trust = more economic opportunity.',
      ],
    },
  },
  {
    id: 'conditions', label: '$403', sublabel: 'Conditions', color: '#a855f7', icon: '⚙️',
    pos: [3, -5, 2], parentId: 'root',
    detail: {
      title: '$403 — Conditions Machine',
      body: [
        'Programmable rules that reference your identity graph.',
        '"Pay only if 3+ strands verified." "Premium if followers > 100."',
        'Designed but not yet coded.',
      ],
    },
  },
];

// ─── Layout Modes ───
type LayoutMode = 'tree' | 'sphere' | 'helix' | 'flat' | 'explode';

function computePositions(mode: LayoutMode, nodes: IdNode[]): Map<string, THREE.Vector3> {
  const out = new Map<string, THREE.Vector3>();

  if (mode === 'tree') {
    nodes.forEach(n => out.set(n.id, new THREE.Vector3(...n.pos)));
  } else if (mode === 'sphere') {
    const radius = 12;
    nodes.forEach((n, i) => {
      const t = i / nodes.length;
      const phi = Math.acos(1 - 2 * t);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      out.set(n.id, new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      ));
    });
  } else if (mode === 'helix') {
    const radius = 8;
    const height = 30;
    nodes.forEach((n, i) => {
      const t = i / (nodes.length - 1);
      const angle = t * Math.PI * 2 * 3;
      out.set(n.id, new THREE.Vector3(
        radius * Math.cos(angle),
        (t - 0.5) * height,
        radius * Math.sin(angle)
      ));
    });
  } else if (mode === 'flat') {
    const cols = Math.ceil(Math.sqrt(nodes.length));
    nodes.forEach((n, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      out.set(n.id, new THREE.Vector3(
        (col - cols / 2) * 5,
        0,
        (row - cols / 2) * 5
      ));
    });
  } else if (mode === 'explode') {
    nodes.forEach(n => {
      const base = new THREE.Vector3(...n.pos);
      if (n.id === 'root') {
        out.set(n.id, base);
      } else {
        const dir = base.clone().normalize();
        out.set(n.id, base.clone().add(dir.multiplyScalar(8)));
      }
    });
  }

  return out;
}

// ─── Component ───
export default function IdTree3DPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [layout, setLayout] = useState<LayoutMode>('tree');
  const [autoRotate, setAutoRotate] = useState(true);
  const [particlesOn, setParticlesOn] = useState(true);
  const [glowPulse, setGlowPulse] = useState(true);

  const layoutRef = useRef<LayoutMode>('tree');
  const autoRotateRef = useRef(true);
  const particlesRef = useRef(true);
  const glowPulseRef = useRef(true);

  useEffect(() => { layoutRef.current = layout; }, [layout]);
  useEffect(() => { autoRotateRef.current = autoRotate; }, [autoRotate]);
  useEffect(() => { particlesRef.current = particlesOn; }, [particlesOn]);
  useEffect(() => { glowPulseRef.current = glowPulse; }, [glowPulse]);

  const selectedRef = useRef<string | null>(null);
  useEffect(() => { selectedRef.current = selected; }, [selected]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Pre-compute all layout positions
    const layouts: Record<LayoutMode, Map<string, THREE.Vector3>> = {
      tree: computePositions('tree', NODES),
      sphere: computePositions('sphere', NODES),
      helix: computePositions('helix', NODES),
      flat: computePositions('flat', NODES),
      explode: computePositions('explode', NODES),
    };

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 500);
    camera.position.set(0, 12, 28);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(width, height);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0';
    labelRenderer.domElement.style.pointerEvents = 'none';
    container.appendChild(labelRenderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.04;
    controls.minDistance = 10;
    controls.maxDistance = 80;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.4;

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const pointLight = new THREE.PointLight(0x22c55e, 2, 50);
    pointLight.position.set(0, 15, 10);
    scene.add(pointLight);

    // --- Ground ring (subtle) ---
    const ringGeom = new THREE.RingGeometry(14, 14.1, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x22c55e, transparent: true, opacity: 0.08, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeom, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -0.5;
    scene.add(ring);

    // --- Particles ---
    const particleCount = 300;
    const pGeom = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);
    const pSpeeds = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 40;
      pPositions[i * 3 + 1] = Math.random() * 30 - 5;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 40;
      pSpeeds[i] = 0.01 + Math.random() * 0.03;
    }
    pGeom.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({ color: 0x22c55e, size: 0.08, transparent: true, opacity: 0.3 });
    const particles = new THREE.Points(pGeom, pMat);
    scene.add(particles);

    // --- Nodes ---
    interface NodeRef {
      id: string;
      sphere: THREE.Mesh;
      glowSphere: THREE.Mesh;
      label: CSS2DObject;
      cur: THREE.Vector3;
      color: string;
    }
    const nodeRefs: NodeRef[] = [];

    NODES.forEach(node => {
      const initPos = layouts.tree.get(node.id)!;
      const cur = initPos.clone();

      // Main sphere
      const isRoot = node.id === 'root';
      const radius = isRoot ? 0.8 : node.parentId === 'root' && !['rotate', 'revoke', 'economic', 'conditions'].includes(node.id) ? 0.5 : 0.35;
      const sphereGeom = new THREE.SphereGeometry(radius, 24, 24);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: node.color,
        emissive: node.color,
        emissiveIntensity: 0.4,
        roughness: 0.3,
        metalness: 0.6,
      });
      const sphere = new THREE.Mesh(sphereGeom, sphereMat);
      sphere.position.copy(cur);
      scene.add(sphere);

      // Glow sphere (larger, transparent)
      const glowGeom = new THREE.SphereGeometry(radius * 2.5, 16, 16);
      const glowMat = new THREE.MeshBasicMaterial({
        color: node.color,
        transparent: true,
        opacity: 0.06,
      });
      const glowSphere = new THREE.Mesh(glowGeom, glowMat);
      glowSphere.position.copy(cur);
      scene.add(glowSphere);

      // Label
      const div = document.createElement('div');
      const isOAuth = node.sublabel === 'OAuth Strand';
      div.innerHTML = `
        <div style="display:flex;align-items:center;gap:6px;padding:5px 12px 5px 8px;background:rgba(0,0,0,0.85);border:1px solid ${node.color}40;border-radius:9999px;cursor:pointer;transition:all 0.2s;backdrop-filter:blur(4px);">
          <span style="font-size:${isOAuth ? '16px' : '13px'};">${node.icon}</span>
          <div style="display:flex;flex-direction:column;">
            <span style="color:${node.color};font-size:${isRoot ? '13px' : '11px'};font-family:ui-monospace,monospace;font-weight:${isRoot ? '800' : '600'};white-space:nowrap;">${node.label}</span>
            <span style="color:rgba(255,255,255,0.35);font-size:8px;font-family:ui-monospace,monospace;letter-spacing:0.1em;">${node.sublabel}</span>
          </div>
        </div>
      `;
      div.style.pointerEvents = 'auto';
      div.onmouseenter = () => {
        const inner = div.firstElementChild as HTMLElement;
        if (inner) { inner.style.borderColor = node.color; inner.style.background = `rgba(0,0,0,0.95)`; }
      };
      div.onmouseleave = () => {
        const inner = div.firstElementChild as HTMLElement;
        if (inner) { inner.style.borderColor = `${node.color}40`; inner.style.background = 'rgba(0,0,0,0.85)'; }
      };
      div.onclick = () => {
        setSelected(prev => prev === node.id ? null : node.id);
      };

      const label = new CSS2DObject(div);
      label.position.copy(cur);
      label.position.y += radius + 0.8;
      scene.add(label);

      nodeRefs.push({ id: node.id, sphere, glowSphere, label, cur, color: node.color });
    });

    // --- Connection lines (branches) ---
    interface BranchRef { line: THREE.Line; parentId: string; childId: string }
    const branches: BranchRef[] = [];

    NODES.filter(n => n.parentId).forEach(node => {
      const geom = new THREE.BufferGeometry();
      const positions = new Float32Array(6);
      geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.LineBasicMaterial({
        color: node.color,
        transparent: true,
        opacity: 0.25,
      });
      const line = new THREE.Line(geom, mat);
      scene.add(line);
      branches.push({ line, parentId: node.parentId!, childId: node.id });
    });

    // --- Animation ---
    let curLayout: LayoutMode = 'tree';
    let animationId: number;
    let time = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      time += 0.016;

      if (layoutRef.current !== curLayout) curLayout = layoutRef.current;

      const tgtMap = layouts[curLayout];

      // Lerp nodes
      nodeRefs.forEach((n, i) => {
        const t = tgtMap.get(n.id);
        if (t) {
          n.cur.lerp(t, 0.04);
          n.sphere.position.copy(n.cur);
          n.glowSphere.position.copy(n.cur);
          n.label.position.copy(n.cur);

          const node = NODES.find(nd => nd.id === n.id)!;
          const isRoot = n.id === 'root';
          const radius = isRoot ? 0.8 : 0.5;
          n.label.position.y = n.cur.y + radius + 0.8;

          // Pulse glow
          if (glowPulseRef.current) {
            const pulse = 0.06 + Math.sin(time * 1.5 + i * 0.7) * 0.03;
            (n.glowSphere.material as THREE.MeshBasicMaterial).opacity = pulse;
            const s = 1 + Math.sin(time * 2 + i * 0.5) * 0.1;
            n.glowSphere.scale.setScalar(s);
          } else {
            (n.glowSphere.material as THREE.MeshBasicMaterial).opacity = 0.06;
            n.glowSphere.scale.setScalar(1);
          }

          // Highlight selected
          const isSelected = selectedRef.current === n.id;
          (n.sphere.material as THREE.MeshStandardMaterial).emissiveIntensity = isSelected ? 1.0 : 0.4;
        }
      });

      // Update branch lines
      branches.forEach(b => {
        const parent = nodeRefs.find(n => n.id === b.parentId);
        const child = nodeRefs.find(n => n.id === b.childId);
        if (parent && child) {
          const positions = b.line.geometry.attributes.position as THREE.BufferAttribute;
          positions.array[0] = parent.cur.x;
          positions.array[1] = parent.cur.y;
          positions.array[2] = parent.cur.z;
          positions.array[3] = child.cur.x;
          positions.array[4] = child.cur.y;
          positions.array[5] = child.cur.z;
          positions.needsUpdate = true;
        }
      });

      // Particles
      pMat.opacity = particlesRef.current ? 0.3 : 0;
      if (particlesRef.current) {
        const pp = pGeom.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < particleCount; i++) {
          pp.array[i * 3 + 1] += pSpeeds[i];
          if (pp.array[i * 3 + 1] > 25) pp.array[i * 3 + 1] = -5;
        }
        pp.needsUpdate = true;
      }

      // Rotate
      controls.autoRotate = autoRotateRef.current;

      controls.update();
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = container.clientWidth, h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      labelRenderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      container.removeChild(renderer.domElement);
      container.removeChild(labelRenderer.domElement);
    };
  }, []);

  const selectedNode = NODES.find(n => n.id === selected);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-zinc-900 px-6 md:px-8 pt-28 pb-6">
        <div className="flex items-end gap-4">
          <span className="text-4xl">🌳</span>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-none tracking-tighter">
            ID <span className="text-green-500">TREE</span>
          </h1>
          <div className="text-xs text-zinc-500 mb-2 font-mono uppercase tracking-widest">
            $401 IDENTITY
          </div>
        </div>
        <p className="text-zinc-500 text-sm font-mono mt-3 max-w-xl">
          Your identity is a tree. The root is yours. OAuth providers are leaves. Everything branches from your key.
        </p>
      </div>

      {/* Shape buttons */}
      <div className="border-b border-zinc-900 px-6 md:px-8 py-3 flex flex-wrap items-center gap-2">
        {([
          ['tree', '🌳 Tree'],
          ['sphere', '🌐 Sphere'],
          ['helix', '🧬 Helix'],
          ['flat', '▦ Grid'],
          ['explode', '💥 Explode'],
        ] as [LayoutMode, string][]).map(([mode, label]) => (
          <button
            key={mode}
            onClick={() => setLayout(mode)}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${
              layout === mode ? 'bg-green-500 text-black' : 'bg-black text-white border border-white/20 hover:border-green-500/40'
            }`}
          >
            {label}
          </button>
        ))}

        <div className="w-px h-6 bg-zinc-800 mx-2" />

        <button
          onClick={() => setAutoRotate(r => !r)}
          className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${
            autoRotate ? 'bg-green-500/20 text-green-400 border border-green-500/40' : 'bg-black text-white border border-white/20 hover:border-white/40'
          }`}
        >
          ↻ Spin
        </button>
        <button
          onClick={() => setGlowPulse(g => !g)}
          className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${
            glowPulse ? 'bg-green-500/20 text-green-400 border border-green-500/40' : 'bg-black text-white border border-white/20 hover:border-white/40'
          }`}
        >
          ✦ Glow
        </button>
        <button
          onClick={() => setParticlesOn(p => !p)}
          className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${
            particlesOn ? 'bg-green-500/20 text-green-400 border border-green-500/40' : 'bg-black text-white border border-white/20 hover:border-white/40'
          }`}
        >
          ⋮ Particles
        </button>
      </div>

      {/* 3D Scene */}
      <div className="relative" style={{ height: 'calc(100vh - 260px)', minHeight: '500px' }}>
        <div ref={containerRef} className="w-full h-full" style={{ cursor: 'grab' }} />

        {/* Legend */}
        <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2 text-[10px] bg-black/70 backdrop-blur p-3 rounded-lg border border-white/10">
          <div className="flex gap-3">
            <span className="flex items-center gap-1.5 text-green-400"><span className="w-2 h-2 rounded-full bg-green-500" />Root</span>
            <span className="flex items-center gap-1.5 text-white"><span className="w-2 h-2 rounded-full bg-white" />OAuth</span>
            <span className="flex items-center gap-1.5 text-yellow-400"><span className="w-2 h-2 rounded-full bg-yellow-500" />Economic</span>
          </div>
          <div className="text-zinc-600 font-mono">Click any node to explore</div>
        </div>
      </div>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        {selectedNode && (
          <motion.div
            key={selectedNode.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-zinc-900"
          >
            <div className="max-w-3xl mx-auto px-6 md:px-8 py-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selectedNode.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold tracking-tight">{selectedNode.detail.title}</h3>
                    <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: selectedNode.color }}>
                      {selectedNode.sublabel}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-zinc-500 hover:text-white text-xs font-mono uppercase tracking-widest transition-colors"
                >
                  Close
                </button>
              </div>
              <div className="space-y-3">
                {selectedNode.detail.body.map((para, i) => (
                  <p key={i} className="text-zinc-400 text-sm leading-relaxed font-mono">{para}</p>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <div className="border-t border-zinc-900 py-16 text-center">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tighter mb-4">
          YOUR IDENTITY. <span className="text-green-500">YOUR TREE.</span>
        </h2>
        <p className="text-zinc-500 text-sm font-mono mb-8">
          Create your root. Inscribe your strands. Own your name.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://bit-sign.online"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-green-600 text-white font-bold uppercase tracking-widest text-xs hover:bg-green-700 transition-colors"
          >
            Create Your Root
          </a>
          <Link
            href="/identity"
            className="px-8 py-4 border border-zinc-800 text-zinc-400 font-bold uppercase tracking-widest text-xs hover:border-green-500/50 hover:text-green-400 transition-colors"
          >
            Inscribe a Strand
          </Link>
        </div>
      </div>
    </div>
  );
}
