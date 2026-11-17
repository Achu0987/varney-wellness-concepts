'use client';
import * as THREE from 'three';
import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer } from '@react-three/drei';
import RealBust from './RealBust';
import { S } from '@/lib/c1/state';

const damp = THREE.MathUtils.damp;

/** Turns the head toward the cursor; optionally adds the scroll-driven turn from S.rot. */
function Rig({ children, base, scroll }) {
  const g = useRef();
  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return undefined;
    const move = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);
  useFrame((state, dt) => {
    const target = base + mouse.current.x * 0.45 + (scroll ? S.rot : 0);
    g.current.rotation.y = damp(g.current.rotation.y, target, 4, dt);
    g.current.rotation.x = damp(g.current.rotation.x, mouse.current.y * 0.08, 4, dt);
    g.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.03;
  });
  return <group ref={g}>{children}</group>;
}

function useInView(ref) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: '100px' });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [ref]);
  return on;
}

/**
 * The real 3D head scan, lit like a bright studio, on a transparent canvas so it
 * sits on the page's light background. `xray` fixes the skin reveal; leave it out
 * to follow the scroll (S.xray).
 */
export default function HeadCanvas({ className = '', xray, scroll = false, base = -0.45, cam = [0, 2.0, 8.4], look = 1.8, fov = 30, glow = true }) {
  const ref = useRef(null);
  const inView = useInView(ref);
  const [mobile, setMobile] = useState(false);
  useEffect(() => setMobile(window.matchMedia('(max-width: 820px)').matches), []);

  return (
    <div ref={ref} className={className} aria-hidden="true">
      <Canvas
        frameloop={inView ? 'always' : 'never'}
        dpr={mobile ? [1, 1.4] : [1, 1.8]}
        gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        camera={{ fov, position: cam }}
        onCreated={({ camera }) => camera.lookAt(0, look, 0)}
      >
        <ambientLight intensity={glow ? 0.25 : 0.55} color="#8899ff" />
        <directionalLight position={[-3, 4, 7]} intensity={glow ? 1.2 : 2.1} color={glow ? "#cfe8ff" : "#fff6ee"} />
        <directionalLight position={[4, 2, -3]} intensity={1.3} color="#8BDFFF" />
        <directionalLight position={[3, -1, 2]} intensity={glow ? 1.6 : 0.5} color="#7557FF" />
        <Suspense fallback={null}>
          <Environment resolution={256} frames={1}>
            <Lightformer form="rect" intensity={3.5} position={[0, 6, 3]} scale={[12, 3, 1]} color="#ffffff" />
            <Lightformer form="rect" intensity={2.5} position={[-6, 2, 2]} scale={[6, 4, 1]} color="#dff4ff" />
            <Lightformer form="rect" intensity={2.5} position={[6, 1, -2]} scale={[6, 4, 1]} color="#c9bcff" />
          </Environment>
          <Rig base={base} scroll={scroll}>
            <RealBust bare mobile={mobile} xray={xray} glow={glow} />
          </Rig>
          {!glow && <ContactShadows position={[0, 0, 0]} opacity={0.28} scale={7} blur={2.6} far={3} color="#1b2650" />}
          {glow && <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}><ringGeometry args={[1.05, 1.12, 96]} /><meshBasicMaterial color="#8BDFFF" transparent opacity={0.7} toneMapped={false} /></mesh>}
        </Suspense>
      </Canvas>
    </div>
  );
}
