'use client';
import * as THREE from 'three';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';

function useInView(ref) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: '200px' });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [ref]);
  return on;
}

function Spin({ children, speed = 0.35, hover }) {
  const g = useRef();
  useFrame((s, dt) => {
    const k = hover.current ? 2.6 : 1;
    g.current.rotation.y += dt * speed * k;
    g.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.5) * 0.25 + s.pointer.y * 0.3;
    g.current.position.y = Math.sin(s.clock.elapsedTime * 0.9) * 0.08;
  });
  return <group ref={g}>{children}</group>;
}

function Gyro({ color }) {
  const a = useRef(); const b = useRef(); const c = useRef();
  useFrame((s, dt) => { a.current.rotation.x += dt * 0.8; b.current.rotation.y += dt * 1.1; c.current.rotation.z += dt * 0.6; });
  const mat = <meshPhysicalMaterial color={color} metalness={0.85} roughness={0.18} iridescence={1} envMapIntensity={1.8} />;
  return (
    <group>
      <mesh ref={a}><torusGeometry args={[1.15, 0.06, 24, 120]} />{mat}</mesh>
      <mesh ref={b}><torusGeometry args={[0.86, 0.06, 24, 120]} />{mat}</mesh>
      <mesh ref={c}><torusGeometry args={[0.58, 0.06, 24, 120]} />{mat}</mesh>
      <mesh><sphereGeometry args={[0.24, 32, 32]} /><meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={2.4} toneMapped={false} /></mesh>
    </group>
  );
}

function Spiral({ color }) {
  const bead = useRef();
  const curve = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 90; i++) { const t = i / 90; const a = t * Math.PI * 5; pts.push(new THREE.Vector3(Math.cos(a) * (0.35 + t * 0.7), (t - 0.5) * 2.6, Math.sin(a) * (0.35 + t * 0.7))); }
    return new THREE.CatmullRomCurve3(pts);
  }, []);
  useFrame((s) => { bead.current.position.copy(curve.getPoint((s.clock.elapsedTime * 0.12) % 1)); });
  return (
    <group>
      <mesh><tubeGeometry args={[curve, 200, 0.05, 12, false]} /><meshPhysicalMaterial color={color} metalness={0.8} roughness={0.2} envMapIntensity={1.6} /></mesh>
      <mesh ref={bead}><sphereGeometry args={[0.15, 24, 24]} /><meshStandardMaterial color="#fff" emissive={color} emissiveIntensity={3} toneMapped={false} /></mesh>
    </group>
  );
}

function Shape({ kind, color }) {
  if (kind === 'knot')
    return <mesh><torusKnotGeometry args={[0.8, 0.27, 180, 28]} /><meshPhysicalMaterial color={color} metalness={0.7} roughness={0.12} iridescence={1} iridescenceIOR={1.6} clearcoat={1} envMapIntensity={1.8} /></mesh>;
  if (kind === 'gem')
    return (
      <group>
        <mesh><icosahedronGeometry args={[1.05, 0]} /><meshPhysicalMaterial color={color} metalness={0.3} roughness={0.05} clearcoat={1} flatShading envMapIntensity={2.2} iridescence={1} /></mesh>
        <mesh scale={1.22}><icosahedronGeometry args={[1.05, 1]} /><meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.3} toneMapped={false} /></mesh>
      </group>
    );
  if (kind === 'gyro') return <Gyro color={color} />;
  return <Spiral color={color} />;
}

export default function MiniIcon({ kind = 'knot', color = '#8BDFFF' }) {
  const ref = useRef(null);
  const hover = useRef(false);
  const inView = useInView(ref);
  return (
    <div ref={ref} className="h-full w-full" onPointerEnter={() => { hover.current = true; }} onPointerLeave={() => { hover.current = false; }} aria-hidden="true">
      <Canvas frameloop={inView ? 'always' : 'never'} dpr={[1, 1.5]} camera={{ position: [0, 0, 4.2], fov: 38 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.4} />
        <Environment resolution={128} frames={1}>
          <Lightformer form="rect" intensity={4} position={[-3, 2, 3]} scale={[4, 3, 1]} color="#ffffff" />
          <Lightformer form="rect" intensity={4} position={[3, -1, 2]} scale={[4, 3, 1]} color="#7557FF" />
          <Lightformer form="rect" intensity={3} position={[0, 4, -2]} scale={[6, 2, 1]} color="#8BDFFF" />
        </Environment>
        <Spin hover={hover}><Shape kind={kind} color={color} /></Spin>
      </Canvas>
    </div>
  );
}
