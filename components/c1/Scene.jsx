'use client';
import * as THREE from 'three';
import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, MeshReflectorMaterial } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise, ToneMapping } from '@react-three/postprocessing';
import { BlendFunction, ToneMappingMode } from 'postprocessing';
import Sculpture from './RealBust';
import { S, KEYS } from '@/lib/c1/state';

const damp = THREE.MathUtils.damp;

function Rig({ mobile }) {
  const group = useRef();
  const spot = useRef();
  const spot2 = useRef();
  const cur = useRef(null);
  const { camera, scene } = useThree();

  useEffect(() => {
    const move = (e) => {
      S.mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      S.mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (!S.reduced) window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (!cur.current) cur.current = Object.fromEntries(KEYS.map((k) => [k, S[k]]));
    const c = cur.current;
    const k = S.reduced ? 40 : 3.2;
    for (const key of KEYS) c[key] = damp(c[key], S[key], k, Math.min(dt, 0.05));

    const mx = S.reduced ? 0 : S.mouse.x;
    const my = S.reduced ? 0 : S.mouse.y;
    camera.position.set(c.cx + mx * 0.35, c.cy - my * 0.18, c.cz);
    camera.lookAt(c.lx, c.ly, c.lz);

    if (group.current) {
      const idle = S.reduced ? 0 : Math.sin(t * 0.35) * 0.18;
      group.current.position.set(c.sx, c.sy + (S.reduced ? 0 : Math.sin(t * 0.8) * 0.05), 0);
      group.current.rotation.y = c.rot + mx * 0.5 + idle;
      group.current.rotation.x = my * 0.06;
      group.current.scale.setScalar(c.scale);
    }
    if (spot.current) spot.current.intensity = 90 * (0.7 + c.flood * 1.1);
    if (spot2.current) {
      spot2.current.intensity = 70 * (1 - c.flood * 0.5);
      spot2.current.position.x = 4 + mx * 2;
    }
    scene.fog.color.set('#080E20');
  });

  return (
    <>
      <group ref={group}>
        <Sculpture mobile={mobile} />
      </group>
      <directionalLight position={[-3, 4, 7]} intensity={1.5} color="#fff1e6" />
      <spotLight ref={spot} position={[-5, 5, -4]} angle={0.7} penumbra={1} color="#7557FF" intensity={90} distance={30} decay={1.4} />
      <spotLight ref={spot2} position={[4, 4, 5]} angle={0.8} penumbra={1} color="#8BDFFF" intensity={70} distance={30} decay={1.4} />
    </>
  );
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.23, 0]}>
      <circleGeometry args={[16, 64]} />
      <MeshReflectorMaterial
        blur={[420, 140]} resolution={512} mixBlur={1.2} mixStrength={38} mixContrast={1.1} roughness={0.9}
        depthScale={1.1} minDepthThreshold={0.4} maxDepthThreshold={1.3} color="#0a1128" metalness={0.6} mirror={0.55}
      />
    </mesh>
  );
}

export default function Scene() {
  const [mobile, setMobile] = useState(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const m = window.matchMedia('(max-width: 820px)').matches || window.matchMedia('(pointer: coarse)').matches;
    S.mobile = m;
    S.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setMobile(m);
    const onVis = (e) => setPaused(!e.detail);
    window.addEventListener('c1-visible', onVis);
    return () => window.removeEventListener('c1-visible', onVis);
  }, []);

  if (mobile === null) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        frameloop={paused ? 'never' : 'always'}
        dpr={mobile ? [1, 1.3] : [1, 1.6]}
        camera={{ fov: 34, near: 0.1, far: 60, position: [0, 1, 10.2] }}
        gl={{ antialias: !mobile, powerPreference: 'high-performance', toneMapping: mobile ? THREE.ACESFilmicToneMapping : THREE.NoToneMapping }}
      >
        <color attach="background" args={['#080E20']} />
        <fog attach="fog" args={['#080E20', 11, 26]} />
        <ambientLight intensity={0.18} color="#8899ff" />
        <Suspense fallback={null}>
          <Environment resolution={256} frames={1}>
            <Lightformer form="rect" intensity={4} position={[-6, 3, -3]} scale={[9, 3, 1]} color="#8BDFFF" />
            <Lightformer form="rect" intensity={5} position={[6, 2, -4]} scale={[9, 4, 1]} color="#7557FF" />
            <Lightformer form="rect" intensity={2.6} position={[0, 7, 2]} scale={[12, 2, 1]} color="#ffffff" />
            <Lightformer form="ring" intensity={3.2} position={[0, 1, 7]} scale={4.5} color="#cfe8ff" />
            <Lightformer form="rect" intensity={1.5} position={[0, -3, 4]} scale={[10, 1, 1]} color="#7557FF" />
          </Environment>
          <Rig mobile={mobile} />
          {!mobile && <Floor />}
        </Suspense>
        {!mobile && (
          <EffectComposer multisampling={0} disableNormalPass>
            <Bloom intensity={0.8} luminanceThreshold={0.62} luminanceSmoothing={0.7} mipmapBlur radius={0.72} />
            <Noise opacity={0.045} blendFunction={BlendFunction.OVERLAY} />
            <Vignette offset={0.22} darkness={0.8} />
            <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
