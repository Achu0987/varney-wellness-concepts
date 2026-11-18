'use client';
/*
 * The crowd: small clay figures that stand on a floor line and turn to look at the visitor's cursor.
 * Orthographic camera at zoom 1, so one world unit is one CSS pixel and the origin is the canvas centre.
 * A shared mutable `stage` object carries the floor line, the pointer, hops and celebrations, so React never re-renders per frame.
 */
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

export const C3 = {
  lav: '#E9DFFF', lav3: '#B9A2F0', pur: '#38206B', pur3: '#6B4FAE', cor: '#FF806B', off: '#FAF9F6', gra: '#24212B', white: '#FFFFFF',
};

/* shared geometry, built once */
const G = {
  body: new THREE.CapsuleGeometry(24, 46, 8, 20),
  head: new THREE.SphereGeometry(23, 28, 20),
  eye: new THREE.SphereGeometry(3.3, 10, 8),
  shadow: new THREE.CircleGeometry(30, 28),
  hat: new THREE.ConeGeometry(14, 36, 20),
  pom: new THREE.SphereGeometry(4.5, 10, 8),
  veil: new THREE.ConeGeometry(30, 70, 24, 1, true),
  band: new THREE.TorusGeometry(22, 4.2, 10, 30),
  lens: new THREE.BoxGeometry(13, 8, 3),
  bridge: new THREE.BoxGeometry(6, 2, 2),
  tie: new THREE.BoxGeometry(8, 26, 3),
  spark: new THREE.OctahedronGeometry(7, 0),
  flower: new THREE.SphereGeometry(6, 10, 8),
};
const matCache = new Map();
function mat(color, opts = {}) {
  const k = color + JSON.stringify(opts);
  if (!matCache.has(k)) matCache.set(k, new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0, ...opts }));
  return matCache.get(k);
}
const shadowMat = new THREE.MeshBasicMaterial({ color: '#000000', transparent: true, opacity: 0.18, depthWrite: false });

const darkBody = (c) => c === C3.pur || c === C3.gra || c === C3.pur3;

export function makeStage(extra = {}) {
  return { floor: 0.7, pointer: { x: 0, y: 0, t: -10 }, hops: [], celebrateAt: -10, alpha: 1, ...extra };
}

function Accessory({ acc, body }) {
  if (acc === 'hat') {
    return (
      <group position={[5, 160, 0]} rotation={[0, 0, -0.2]}>
        <mesh geometry={G.hat} material={mat(body === C3.cor ? C3.lav3 : C3.cor)} />
        <mesh geometry={G.pom} material={mat(C3.off)} position={[0, 20, 0]} />
      </group>
    );
  }
  if (acc === 'veil') {
    return <mesh geometry={G.veil} material={mat(C3.white, { transparent: true, opacity: 0.72, side: THREE.DoubleSide })} position={[0, 112, -6]} />;
  }
  if (acc === 'band') {
    return <mesh geometry={G.band} material={mat(C3.off)} position={[0, 132, 0]} rotation={[Math.PI / 2.3, 0, 0]} />;
  }
  if (acc === 'shades') {
    return (
      <group position={[0, 124, 21]}>
        <mesh geometry={G.lens} material={mat(C3.gra)} position={[-8, 0, 0]} />
        <mesh geometry={G.lens} material={mat(C3.gra)} position={[8, 0, 0]} />
        <mesh geometry={G.bridge} material={mat(C3.gra)} />
      </group>
    );
  }
  if (acc === 'tie') return <mesh geometry={G.tie} material={mat(C3.cor)} position={[0, 70, 23]} />;
  if (acc === 'flower') {
    return (
      <group position={[14, 138, 10]}>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} geometry={G.flower} material={mat(C3.cor)} position={[Math.cos((i / 5) * Math.PI * 2) * 6, Math.sin((i / 5) * Math.PI * 2) * 6, 0]} />
        ))}
        <mesh geometry={G.pom} material={mat(C3.off)} position={[0, 0, 3]} />
      </group>
    );
  }
  return null;
}

function Spark({ color }) {
  const r = useRef();
  useFrame((s) => { if (r.current) { r.current.rotation.y = s.clock.elapsedTime * 1.6; r.current.position.y = 172 + Math.sin(s.clock.elapsedTime * 2) * 4; } });
  return <mesh ref={r} geometry={G.spark} material={mat(color)} position={[0, 172, 0]} />;
}

function Figure({ spec, stage, index, size }) {
  const root = useRef();
  const lean = useRef();
  const head = useRef();
  const eyes = useRef();
  const st = useRef({ yaw: 0, pitch: 0, hop: -10, blinkAt: 1 + Math.random() * 4, born: -1 });
  const eyeColor = darkBody(spec.color) ? C3.off : C3.gra;

  useFrame((s, dt) => {
    const t = s.clock.elapsedTime;
    const o = st.current;
    if (o.born < 0) o.born = t + (spec.delay || 0);
    const w = size.width; const h = size.height;
    const floorY = h / 2 - stage.floor * h;
    const px = spec.x * w - w / 2;
    // who to look at: the pointer when it moved recently, otherwise a slow wander
    const live = performance.now() / 1000 - stage.pointer.t < 4;
    const tx = live ? stage.pointer.x / size.u - w / 2 : Math.sin(t * 0.35 + spec.seed * 7) * w * 0.4;
    const ty = live ? h / 2 - stage.pointer.y / size.u : floorY + 260 + Math.cos(t * 0.5 + spec.seed * 3) * 120;
    const headY = floorY + 125 * spec.scale;
    const dx = tx - px; const dy = ty - headY;
    const yaw = THREE.MathUtils.clamp(Math.atan2(dx, 420), -0.95, 0.95);
    const pitch = THREE.MathUtils.clamp(-Math.atan2(dy, 520), -0.45, 0.4);
    const k = 1 - Math.exp(-dt * 7);
    o.yaw += (yaw - o.yaw) * k; o.pitch += (pitch - o.pitch) * k;
    head.current.rotation.set(o.pitch, o.yaw, -o.yaw * 0.12);
    lean.current.rotation.z = THREE.MathUtils.clamp(-dx / 2600, -0.14, 0.14) + Math.sin(t * 1.3 + spec.seed * 9) * 0.025;
    // blink
    if (t > o.blinkAt) { o.blinkAt = t + 2.2 + Math.random() * 4.5; o.blinkEnd = t + 0.13; }
    eyes.current.scale.y = o.blinkEnd && t < o.blinkEnd ? 0.12 : 1;
    // hop requests: by index or celebration
    for (let i = stage.hops.length - 1; i >= 0; i--) {
      if (stage.hops[i] === index) { o.hop = t; stage.hops.splice(i, 1); }
    }
    const ct = performance.now() / 1000 - stage.celebrateAt;
    if (o.celeb !== stage.celebrateAt && ct > index * 0.06 && ct < 3) { o.hop = t; o.celeb = stage.celebrateAt; }
    const hp = (t - o.hop) / 0.55;
    const hopY = hp >= 0 && hp <= 1 ? Math.sin(hp * Math.PI) * 70 * spec.scale : 0;
    const squash = hp >= 0 && hp <= 1 ? 1 + Math.sin(hp * Math.PI * 2) * 0.06 : 1;
    // entrance: grow up out of the floor
    const b = THREE.MathUtils.clamp((t - o.born) / 0.7, 0, 1);
    const grow = b === 1 ? 1 : 1 - Math.pow(1 - b, 3) * Math.cos(b * 5.5);
    const sc = spec.scale * Math.max(0.001, grow) * stage.alpha;
    root.current.position.set(px, floorY + hopY + (spec.lift || 0), spec.z || 0);
    root.current.scale.set(sc / squash, sc * squash, sc);
    root.current.visible = sc > 0.01;
  });

  return (
    <group ref={root}>
      <mesh geometry={G.shadow} material={shadowMat} scale={[1.1, 0.16, 1]} position={[0, 0, -40]} />
      <group ref={lean}>
        <mesh geometry={G.body} material={mat(spec.color)} position={[0, 47, 0]} />
        <group ref={head} position={[0, 121, 0]}>
          <mesh geometry={G.head} material={mat(spec.headColor || spec.color)} />
          <group ref={eyes} position={[0, 3, 0]}>
            <mesh geometry={G.eye} material={mat(eyeColor)} position={[-8, 0, 20.5]} scale={[1, 1.6, 0.6]} />
            <mesh geometry={G.eye} material={mat(eyeColor)} position={[8, 0, 20.5]} scale={[1, 1.6, 0.6]} />
          </group>
          <group position={[0, -121, 0]}>
            {spec.acc && spec.acc !== 'tie' && spec.acc !== 'spark' && <Accessory acc={spec.acc} body={spec.color} />}
          </group>
        </group>
        {spec.acc === 'tie' && <Accessory acc="tie" body={spec.color} />}
        {spec.acc === 'spark' && <Spark color={spec.sparkColor || C3.cor} />}
      </group>
    </group>
  );
}

function Scene({ specs, stage, unit }) {
  const { size } = useThree();
  return (
    <>
      <ambientLight intensity={1.15} />
      <directionalLight position={[-300, 520, 800]} intensity={1.9} />
      <directionalLight position={[400, 100, 300]} intensity={0.45} color={C3.lav} />
      <group scale={unit}>
        {specs.map((sp, i) => <Figure key={sp.key || i} spec={sp} stage={stage} index={i} size={{ width: size.width / unit, height: size.height / unit, u: unit }} />)}
      </group>
    </>
  );
}

/**
 * <Crowd specs stage unit className />
 * specs: [{ x: 0..1 across the canvas, scale, color, headColor?, acc?, z?, lift?, seed, delay? }]
 * unit: figure size multiplier (1 = a figure about 150px tall).
 */
export default function Crowd({ specs, stage, unit = 1, className = '' }) {
  const wrap = useRef(null);
  const [on, setOn] = useState(false);
  const [desk, setDesk] = useState(true);
  useEffect(() => {
    setDesk(window.matchMedia('(min-width: 900px)').matches);
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: '80px' });
    if (wrap.current) io.observe(wrap.current);
    return () => io.disconnect();
  }, []);
  const memo = useMemo(() => specs, [specs]);
  return (
    <div ref={wrap} className={className} aria-hidden="true">
      <Canvas
        orthographic
        camera={{ position: [0, 0, 1000], zoom: 1, near: 1, far: 3000 }}
        frameloop={on ? 'always' : 'never'}
        dpr={[1, desk ? 1.5 : 1.25]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ pointerEvents: 'none' }}
      >
        <Scene specs={memo} stage={stage} unit={unit} />
      </Canvas>
    </div>
  );
}
