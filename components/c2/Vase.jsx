'use client';
import * as THREE from 'three';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer, useGLTF } from '@react-three/drei';

const damp = THREE.MathUtils.damp;
useGLTF.preload('/models/vase.glb');

/** The real glass vase with flowers (CC0, Khronos glTF Sample Assets), centred and scaled. */
function Model() {
  const { scene } = useGLTF('/models/vase.glb');
  const { obj, k } = useMemo(() => {
    const c = scene.clone(true);
    const box = new THREE.Box3().setFromObject(c);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    c.position.set(-center.x, -box.min.y, -center.z);
    c.traverse((o) => { if (o.isMesh && o.material) { o.material.envMapIntensity = 1.2; } });
    return { obj: c, k: 3.4 / size.y };
  }, [scene]);
  return <group scale={k}><primitive object={obj} /></group>;
}

function Rig({ children }) {
  const g = useRef();
  const m = useRef({ x: 0, y: 0 });
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const move = (e) => { m.current.x = (e.clientX / window.innerWidth - 0.5) * 2; m.current.y = (e.clientY / window.innerHeight - 0.5) * 2; };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);
  useFrame((s, dt) => {
    g.current.rotation.y += dt * 0.12;
    g.current.rotation.x = damp(g.current.rotation.x, m.current.y * 0.06, 3, dt);
    g.current.position.x = damp(g.current.position.x, m.current.x * 0.12, 3, dt);
    g.current.position.y = Math.sin(s.clock.elapsedTime * 0.7) * 0.04;
  });
  return <group ref={g}>{children}</group>;
}

export default function Vase({ className = '', onReady }) {
  const ref = useRef(null);
  const [on, setOn] = useState(true);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: '100px' });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} aria-hidden="true">
      <Canvas
        frameloop={on ? 'always' : 'never'} dpr={[1, 1.8]}
        gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
        camera={{ fov: 30, position: [0, 2.2, 8.6] }}
        onCreated={({ camera }) => { camera.lookAt(0, 1.65, 0); onReady?.(); }}
      >
        <ambientLight intensity={0.6} color="#fff6e8" />
        <directionalLight position={[-3, 5, 4]} intensity={2.4} color="#fff1dc" />
        <directionalLight position={[4, 2, -3]} intensity={1.4} color="#C5A77B" />
        <Suspense fallback={null}>
          <Environment resolution={256} frames={1}>
            <Lightformer form="rect" intensity={3} position={[0, 6, 3]} scale={[10, 3, 1]} color="#fff8ee" />
            <Lightformer form="rect" intensity={2.4} position={[-5, 2, 2]} scale={[4, 5, 1]} color="#ffffff" />
            <Lightformer form="rect" intensity={2} position={[5, 2, -2]} scale={[4, 5, 1]} color="#e9d7b8" />
            <Lightformer form="rect" intensity={1.2} position={[0, -2, 3]} scale={[8, 1, 1]} color="#D9E2D6" />
          </Environment>
          <Rig><Model /></Rig>
          <ContactShadows position={[0, 0, 0]} opacity={0.45} scale={6} blur={2.4} far={3} color="#06120f" />
        </Suspense>
      </Canvas>
    </div>
  );
}
