'use client';
import * as THREE from 'three';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Html, Lightformer, Line, Sparkles } from '@react-three/drei';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { S } from '@/lib/c1/state';

const damp = THREE.MathUtils.damp;
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

/** Organic surface: push every vertex along its normal by layered sine noise. */
function bumpy(src, amp, freq, seed) {
  src.deleteAttribute("normal"); src.deleteAttribute("uv");
  const geo = mergeVertices(src);
  const p = geo.attributes.position;
  const v = new THREE.Vector3();
  const n = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    n.copy(v).normalize();
    const d = Math.sin(n.x * freq + seed) * Math.sin(n.y * freq * 1.3 + seed * 2) * Math.sin(n.z * freq * 0.9 + seed * 3)
      + 0.5 * Math.sin(n.x * freq * 2.7 + seed) * Math.sin(n.y * freq * 2.1 + seed) * Math.sin(n.z * freq * 3.1 + seed)
      + 0.25 * Math.sin(n.x * freq * 6.3) * Math.sin(n.y * freq * 5.7 + seed) * Math.sin(n.z * freq * 6.9);
    v.addScaledVector(n, d * amp);
    p.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

/* edge glow: violet at the bottom, ice at the top; works on plain and instanced meshes */
function makeRim(k = 1.3) {
  return new THREE.ShaderMaterial({
    uniforms: { c1: { value: new THREE.Color('#A7ECCD') }, c2: { value: new THREE.Color('#1FA37A') }, k: { value: k } },
    vertexShader: `varying vec3 vN; varying vec3 vV; varying float vY;
      void main(){
        vec4 p = vec4(position, 1.0); vec3 nn = normal;
        #ifdef USE_INSTANCING
          p = instanceMatrix * p; nn = mat3(instanceMatrix) * nn;
        #endif
        vec4 w = modelMatrix * p; vY = w.y;
        vN = normalize(normalMatrix * nn);
        vec4 mv = viewMatrix * w; vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `uniform vec3 c1; uniform vec3 c2; uniform float k; varying vec3 vN; varying vec3 vV; varying float vY;
      void main(){
        float f = pow(1.0 - max(dot(normalize(vN), normalize(vV)), 0.0), 2.4);
        vec3 col = mix(c2, c1, clamp(vY * 0.35 + 0.5, 0.0, 1.0));
        gl_FragColor = vec4(col * f * k, f);
      }`,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
  });
}

const BLOBS = 46;

function Cell({ xray, scroll }) {
  const root = useRef();
  const membrane = useRef();
  const blobs = useRef();
  const blobRim = useRef();
  const nucleus = useRef();
  const light = useRef();

  const coreGeo = useMemo(() => bumpy(new THREE.IcosahedronGeometry(1.35, 48), 0.07, 6, 1.7), []);
  const blobGeo = useMemo(() => bumpy(new THREE.IcosahedronGeometry(1, 12), 0.12, 5, 0.6), []);
  const nucGeo = useMemo(() => bumpy(new THREE.IcosahedronGeometry(0.62, 24), 0.06, 7, 2.3), []);
  const rimCore = useMemo(() => makeRim(1.4), []);
  const rimBlob = useMemo(() => makeRim(1.1), []);

  // blobs sit half-embedded in the membrane, spread evenly (fibonacci sphere)
  const layout = useMemo(() => {
    const arr = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < BLOBS; i++) {
      const y = 1 - (i / (BLOBS - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = golden * i;
      const dir = new THREE.Vector3(Math.cos(th) * r, y, Math.sin(th) * r);
      const size = 0.16 + ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1 * 0.26;
      arr.push({ dir, size, rot: new THREE.Euler(i, i * 0.7, i * 1.3), wob: i * 0.37 });
    }
    return arr;
  }, []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const cur = useRef(0);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    cur.current = damp(cur.current, xray ?? S.xray, 4, dt);
    const open = smooth(0.05, 0.95, cur.current);
    root.current.rotation.y += dt * 0.12;
    if (scroll) root.current.rotation.x = damp(root.current.rotation.x, S.rot * 0.3, 4, dt);
    if (membrane.current) membrane.current.opacity = 0.82 - 0.62 * open;
    rimCore.uniforms.k.value = 1.4 - 0.6 * open;
    for (let i = 0; i < BLOBS; i++) {
      const b = layout[i];
      const dist = 1.35 + b.size * 0.35 + open * (0.9 + b.size * 2) + Math.sin(t * 0.8 + b.wob) * 0.02;
      dummy.position.copy(b.dir).multiplyScalar(dist);
      dummy.rotation.copy(b.rot);
      dummy.scale.setScalar(b.size * (1 - 0.25 * open));
      dummy.updateMatrix();
      blobs.current.setMatrixAt(i, dummy.matrix);
      blobRim.current.setMatrixAt(i, dummy.matrix);
    }
    blobs.current.instanceMatrix.needsUpdate = true;
    blobRim.current.instanceMatrix.needsUpdate = true;
    const beat = 1 + Math.sin(t * 2) * 0.03;
    nucleus.current.scale.setScalar(beat * (1 + 0.25 * open));
    nucleus.current.material.emissiveIntensity = 0.9 + 1.4 * open;
    light.current.intensity = 6 + 14 * open;
  });

  return (
    <group ref={root}>
      <mesh ref={nucleus} geometry={nucGeo}>
        <meshStandardMaterial color="#9fe3c6" emissive="#1FA37A" emissiveIntensity={1} roughness={0.3} metalness={0.1} toneMapped={false} />
      </mesh>
      <pointLight ref={light} color="#5fd3a6" intensity={6} distance={6} decay={1.6} />
      <mesh geometry={coreGeo}>
        <meshPhysicalMaterial ref={membrane} color="#c4f0dc" roughness={0.3} metalness={0.05} clearcoat={1} clearcoatRoughness={0.3} sheen={1} sheenColor="#A7ECCD" iridescence={0.6} transparent opacity={0.82} envMapIntensity={1.3} emissive="#0a5c40" emissiveIntensity={0.25} depthWrite={false} />
      </mesh>
      <mesh geometry={coreGeo} material={rimCore} scale={1.01} />
      <instancedMesh ref={blobs} args={[blobGeo, null, BLOBS]} frustumCulled={false}>
        <meshPhysicalMaterial color="#d2f3e3" roughness={0.35} clearcoat={1} sheen={1} sheenColor="#A7ECCD" iridescence={0.5} envMapIntensity={1.3} emissive="#0a5c40" emissiveIntensity={0.3} />
      </instancedMesh>
      <instancedMesh ref={blobRim} args={[blobGeo, rimBlob, BLOBS]} frustumCulled={false} />
    </group>
  );
}

/** Explanation cards orbit the cell, joined to it by glowing lines; cards behind it dim. */
function Orbit({ chips }) {
  const g = useRef();
  const els = useRef([]);
  const anchors = useMemo(() => chips.map((_, i) => {
    const a = (i / chips.length) * Math.PI * 2;
    const y = [0.9, -0.4, 0.5, -0.9, 0.1, -0.2][i % 6];
    return new THREE.Vector3(Math.cos(a) * 2.45, y, Math.sin(a) * 2.75);
  }), [chips]);
  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame((state, dt) => {
    g.current.rotation.y += dt * 0.14;
    anchors.forEach((p, i) => {
      v.copy(p).applyMatrix4(g.current.matrixWorld);
      const front = smooth(0.42, 0.75, (v.z + 2.75) / 5.5);
      const el = els.current[i];
      if (el) { el.style.opacity = front.toFixed(2); el.style.transform = `translate(-50%,-50%) scale(${(0.85 + 0.15 * front).toFixed(3)})`; }
    });
  });
  return (
    <group ref={g}>
      {anchors.map((p, i) => (
        <group key={chips[i].t}>
          <Line points={[p, p.clone().multiplyScalar(0.58)]} color="#A7ECCD" lineWidth={1.2} transparent opacity={0.55} />
          <mesh position={p.clone().multiplyScalar(0.58)}><sphereGeometry args={[0.035, 12, 12]} /><meshBasicMaterial color="#A7ECCD" toneMapped={false} /></mesh>
          <Html position={p} zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
            <div ref={(el) => { els.current[i] = el; }} className="w-[13.5rem] rounded-2xl bg-white/[0.08] px-4 py-3 text-white ring-1 ring-white/15 backdrop-blur-md" style={{ transform: 'translate(-50%,-50%)' }}>
              <p className="text-[0.95rem] font-semibold leading-tight">{chips[i].t}</p>
              <p className="mt-1 text-[0.8rem] leading-snug text-white/65">{chips[i].d}</p>
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
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

function Pointer({ children }) {
  const g = useRef();
  const m = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const move = (e) => { m.current.x = (e.clientX / window.innerWidth - 0.5) * 2; m.current.y = (e.clientY / window.innerHeight - 0.5) * 2; };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);
  useFrame((s, dt) => {
    g.current.rotation.y = damp(g.current.rotation.y, m.current.x * 0.35, 3, dt);
    g.current.rotation.x = damp(g.current.rotation.x, m.current.y * 0.15, 3, dt);
  });
  return <group ref={g}>{children}</group>;
}

/**
 * A glowing 3D cell sculpture (midnight navy, electric violet, ice blue) on a transparent canvas.
 * `xray` fixes how far the cell is opened; leave it out to follow the scroll (S.xray).
 * `chips` adds the orbiting explanation cards.
 */
export default function CellCanvas({ className = '', xray, scroll = false, chips = null, cam = [0, 0.4, 8.2], fov = 34, scale = 1 }) {
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
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
      >
        <ambientLight intensity={0.3} color="#9fe0c4" />
        <directionalLight position={[-4, 5, 6]} intensity={1.6} color="#e8fbf2" />
        <directionalLight position={[5, -2, -3]} intensity={2.2} color="#1FA37A" />
        <Suspense fallback={null}>
          <Environment resolution={256} frames={1}>
            <Lightformer form="rect" intensity={3} position={[0, 6, 3]} scale={[12, 3, 1]} color="#ffffff" />
            <Lightformer form="rect" intensity={3} position={[-6, 1, 2]} scale={[6, 4, 1]} color="#A7ECCD" />
            <Lightformer form="rect" intensity={4} position={[6, 0, -2]} scale={[6, 4, 1]} color="#1FA37A" />
          </Environment>
          <group scale={scale}>
            <Pointer><Cell xray={xray} scroll={scroll} /></Pointer>
            {chips && !mobile && <Orbit chips={chips} />}
          </group>
          <Sparkles count={mobile ? 30 : 70} scale={[7, 5, 5]} size={2.5} speed={0.25} opacity={0.7} color="#A7ECCD" />
        </Suspense>
      </Canvas>
    </div>
  );
}
