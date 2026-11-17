'use client';
import * as THREE from 'three';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer, Sparkles, MeshReflectorMaterial, useGLTF } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

const damp = THREE.MathUtils.damp;
const C = { ice: new THREE.Color('#8BDFFF'), violet: new THREE.Color('#7557FF'), white: new THREE.Color('#ffffff'), pearl: new THREE.Color('#e8f4ff') };

export const OCCASIONS = {
  birthday: { label: 'Birthday', colors: [C.ice, C.white], speed: 0.5, bob: 0.16 },
  bridal: { label: 'Bridal / Bachelorette', colors: [C.pearl, C.white], speed: 0.22, bob: 0.06 },
  friends: { label: 'Friends Gathering', colors: [C.violet, C.ice], speed: 0.65, bob: 0.12 },
  wellness: { label: 'Private Wellness Event', colors: [C.ice, C.violet], speed: 0.15, bob: 0.04 },
};
export const TIERS = [
  { label: '4 to 6', n: 5 },
  { label: '7 to 10', n: 8 },
  { label: '11 to 15', n: 12 },
  { label: '16+', n: 16 },
];

useGLTF.preload('/models/GlamVelvetSofa.glb');
useGLTF.preload('/models/GlassHurricaneCandleHolder.glb');

/** A real, licensed 3D model, normalised to a target height and set on the floor. */
function Prop({ url, height, position, rotation = [0, 0, 0] }) {
  const { scene } = useGLTF(url);
  const obj = useMemo(() => {
    const c = scene.clone(true);
    const size = new THREE.Box3().setFromObject(c).getSize(new THREE.Vector3());
    c.scale.setScalar(height / size.y);
    const b = new THREE.Box3().setFromObject(c);
    c.position.y -= b.min.y;
    return c;
  }, [scene, height]);
  return <group position={position} rotation={rotation}><primitive object={obj} /></group>;
}

const metal = { metalness: 0.85, roughness: 0.15, envMapIntensity: 1.8 };

/** The centrepiece changes form with the occasion. */
function Centrepiece({ occasion }) {
  const refs = { birthday: useRef(), bridal: useRef(), friends: useRef(), wellness: useRef() };
  const spin = useRef();
  useFrame((s, dt) => {
    const t = s.clock.elapsedTime;
    for (const k of Object.keys(refs)) {
      const g = refs[k].current;
      const target = k === occasion ? 1 : 0;
      g.scale.setScalar(damp(g.scale.x, target, 5, dt) + 0.0001);
      g.visible = g.scale.x > 0.01;
    }
    spin.current.rotation.y = t * 0.4;
    spin.current.position.y = 0.2 + Math.sin(t) * 0.08;
    refs.bridal.current.children[1].rotation.x = Math.sin(t * 0.8) * 0.4;
  });
  const petals = Array.from({ length: 8 });
  return (
    <group ref={spin}>
      {/* birthday: a faceted crystal crowned with light */}
      <group ref={refs.birthday}>
        <mesh><octahedronGeometry args={[0.7, 0]} /><meshPhysicalMaterial color="#9fe3ff" {...metal} clearcoat={1} flatShading iridescence={1} /></mesh>
        <mesh scale={[1, 1.5, 1]} position={[0, 0.9, 0]}><octahedronGeometry args={[0.2, 0]} /><meshBasicMaterial color="#8BDFFF" toneMapped={false} /></mesh>
      </group>
      {/* bridal: two interlocked rings */}
      <group ref={refs.bridal}>
        <mesh rotation={[0.3, 0, 0]}><torusGeometry args={[0.55, 0.075, 32, 120]} /><meshPhysicalMaterial color="#ffffff" {...metal} /></mesh>
        <mesh position={[0.42, 0, 0]} rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[0.55, 0.075, 32, 120]} /><meshPhysicalMaterial color="#cfe9ff" {...metal} /></mesh>
      </group>
      {/* friends: a cluster of linked orbs */}
      <group ref={refs.friends}>
        {[[0, 0.35, 0], [-0.5, -0.2, 0.1], [0.5, -0.2, -0.1], [0, -0.25, 0.5]].map((p, i) => (
          <mesh key={i} position={p}><sphereGeometry args={[0.32, 48, 48]} /><meshPhysicalMaterial color={i % 2 ? '#8BDFFF' : '#7557FF'} {...metal} clearcoat={1} /></mesh>
        ))}
      </group>
      {/* wellness: an opening lotus of glass petals */}
      <group ref={refs.wellness}>
        {petals.map((_, i) => (
          <mesh key={i} rotation={[0, (i / 8) * Math.PI * 2, 0.9]} position={[Math.cos((i / 8) * Math.PI * 2) * 0.28, 0, -Math.sin((i / 8) * Math.PI * 2) * 0.28]} scale={[0.32, 0.8, 0.12]}>
            <sphereGeometry args={[0.6, 32, 32]} />
            <meshPhysicalMaterial color="#bfe8ff" metalness={0.2} roughness={0.08} transmission={0.6} thickness={0.5} clearcoat={1} envMapIntensity={1.8} iridescence={1} />
          </mesh>
        ))}
        <mesh><sphereGeometry args={[0.16, 24, 24]} /><meshBasicMaterial color="#8BDFFF" toneMapped={false} /></mesh>
      </group>
    </group>
  );
}

/** Guests orbit the centrepiece: one orb per guest tier. */
function Guests({ occasion, tier }) {
  const mesh = useRef();
  const scales = useRef(new Float32Array(18));
  const radius = useRef(2);
  const dummy = useRef(new THREE.Object3D());
  const col = useRef(new THREE.Color());
  const last = useRef('');

  useFrame((s, dt) => {
    const t = s.clock.elapsedTime;
    const theme = OCCASIONS[occasion];
    const n = TIERS[tier].n;
    radius.current = damp(radius.current, 1.7 + n * 0.07, 3, dt);
    if (last.current !== occasion) {
      for (let i = 0; i < 18; i++) mesh.current.setColorAt(i, col.current.copy(theme.colors[i % theme.colors.length]));
      mesh.current.instanceColor.needsUpdate = true;
      last.current = occasion;
    }
    for (let i = 0; i < 18; i++) {
      scales.current[i] = damp(scales.current[i], i < n ? 1 : 0, 6, dt);
      const a = (i / n) * Math.PI * 2 + t * theme.speed;
      dummy.current.position.set(Math.cos(a) * radius.current, 0.1 + Math.sin(t * 1.3 + i) * theme.bob, Math.sin(a) * radius.current);
      dummy.current.scale.setScalar(Math.max(0.0001, scales.current[i]));
      dummy.current.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.current.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, 18]} frustumCulled={false}>
      <sphereGeometry args={[0.26, 40, 40]} />
      <meshPhysicalMaterial color="#ffffff" metalness={0.2} roughness={0.12} clearcoat={1} iridescence={1} envMapIntensity={1.7} />
    </instancedMesh>
  );
}

function Rig({ children }) {
  const g = useRef();
  useFrame((s) => {
    g.current.rotation.y = s.pointer.x * 0.4;
    g.current.rotation.x = -s.pointer.y * 0.12;
  });
  return <group ref={g}>{children}</group>;
}

export default function PartyScene({ occasion, tier, mobile }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '150px' });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0" aria-hidden="true">
      <Canvas frameloop={inView ? 'always' : 'never'} dpr={mobile ? [1, 1.3] : [1, 1.6]} camera={{ position: [0, 3.6, 8.4], fov: 38 }} gl={{ antialias: !mobile, toneMapping: THREE.ACESFilmicToneMapping }}>
        <color attach="background" args={['#0a1128']} />
        <fog attach="fog" args={['#0a1128', 9, 20]} />
        <ambientLight intensity={0.25} />
        <pointLight position={[0, 1.5, 0]} intensity={14} color="#8f7bff" distance={9} />
        <Environment resolution={128} frames={1}>
          <Lightformer form="rect" intensity={4} position={[-5, 3, 2]} scale={[7, 3, 1]} color="#8BDFFF" />
          <Lightformer form="rect" intensity={5} position={[5, 2, -3]} scale={[7, 3, 1]} color="#7557FF" />
          <Lightformer form="rect" intensity={2.5} position={[0, 6, 2]} scale={[10, 2, 1]} color="#ffffff" />
        </Environment>
        <Rig>
          <Centrepiece occasion={occasion} />
          <Suspense fallback={null}>
            <Prop url="/models/GlamVelvetSofa.glb" height={1.15} position={[-3.4, -0.75, -2.7]} rotation={[0, 0.7, 0]} />
            <Prop url="/models/GlamVelvetSofa.glb" height={1.15} position={[3.4, -0.75, -2.7]} rotation={[0, -0.7, 0]} />
            <Prop url="/models/GlassHurricaneCandleHolder.glb" height={0.95} position={[-2.3, -0.75, 2.3]} />
            <Prop url="/models/GlassHurricaneCandleHolder.glb" height={0.75} position={[2.5, -0.75, 2.0]} />
            <Prop url="/models/GlassHurricaneCandleHolder.glb" height={0.6} position={[0.3, -0.75, 3.4]} />
          </Suspense>
          <Guests occasion={occasion} tier={tier} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.75, 0]}>
            <circleGeometry args={[9, 64]} />
            {mobile ? (
              <meshStandardMaterial color="#0c1536" metalness={0.8} roughness={0.35} />
            ) : (
              <MeshReflectorMaterial blur={[300, 100]} resolution={512} mixBlur={1} mixStrength={30} roughness={0.9} depthScale={1} minDepthThreshold={0.4} maxDepthThreshold={1.3} color="#0b1330" metalness={0.6} mirror={0.55} />
            )}
          </mesh>
        </Rig>
        <Sparkles count={mobile ? 40 : 90} scale={[9, 5, 9]} position={[0, 1.5, 0]} size={3.5} speed={0.3} opacity={0.8} color="#8BDFFF" />
        {!mobile && (
          <EffectComposer multisampling={0} disableNormalPass>
            <Bloom intensity={0.8} luminanceThreshold={0.4} mipmapBlur radius={0.7} />
            <Vignette offset={0.25} darkness={0.7} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
