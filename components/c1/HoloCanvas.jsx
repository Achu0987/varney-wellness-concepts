'use client';
import * as THREE from 'three';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles, useTexture } from '@react-three/drei';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { S } from '@/lib/c1/state';

const damp = THREE.MathUtils.damp;
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const ICE = new THREE.Color('#A6F2D6');
const VIOLET = new THREE.Color('#2FA37A');

/* torso silhouette [radius, y], pelvis to neck */
const PROFILE = [[0.78, -1.6], [0.86, -1.2], [0.8, -0.8], [0.66, -0.35], [0.68, 0.0], [0.82, 0.45], [0.98, 0.9], [1.12, 1.3], [1.16, 1.55], [0.92, 1.76], [0.5, 1.88], [0.3, 1.98], [0.27, 2.25]];

function useTorso() {
  return useMemo(() => {
    const pts = new THREE.SplineCurve(PROFILE.map(([r, y]) => new THREE.Vector2(r, y))).getPoints(120);
    const R = (y) => {
      for (let i = 0; i < pts.length - 1; i++) if (pts[i + 1].y >= y) {
        const t = (y - pts[i].y) / Math.max(1e-6, pts[i + 1].y - pts[i].y);
        return pts[i].x + (pts[i + 1].x - pts[i].x) * t;
      }
      return pts[pts.length - 1].x;
    };
    return { pts, R };
  }, []);
}

function bumpy(src, amp, freq, seed) {
  src.deleteAttribute('normal'); src.deleteAttribute('uv');
  const g = mergeVertices(src);
  const p = g.attributes.position; const v = new THREE.Vector3(); const n = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i); n.copy(v).normalize();
    const d = Math.sin(n.x * freq + seed) * Math.sin(n.y * freq * 1.4 + seed) * Math.sin(n.z * freq + seed * 2)
      + 0.5 * Math.sin(n.x * freq * 3 + seed) * Math.sin(n.y * freq * 2.6) * Math.sin(n.z * freq * 3.3 + seed);
    v.addScaledVector(n, d * amp); p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
}

/* hologram edge glow, ice at the top fading to violet at the base */
function rim(k = 1.4, power = 2.2) {
  return new THREE.ShaderMaterial({
    uniforms: { k: { value: k }, c1: { value: ICE.clone() }, c2: { value: VIOLET.clone() } },
    vertexShader: 'varying vec3 vN; varying vec3 vV; varying float vY; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vY = w.y; vN = normalize(normalMatrix * normal); vec4 mv = viewMatrix * w; vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }',
    fragmentShader: `uniform float k; uniform vec3 c1; uniform vec3 c2; varying vec3 vN; varying vec3 vV; varying float vY; void main(){ float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), ${power.toFixed(1)}); vec3 col = mix(c2, c1, clamp(vY * 0.3 + 0.55, 0.0, 1.0)); gl_FragColor = vec4(col * f * k, f * 0.9); }`,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
  });
}
const glowMat = (color, opacity) => new THREE.MeshBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });

function contourLines(pts, R) {
  const pos = [];
  for (let y = -1.5; y < 2.2; y += 0.16) {
    const r = R(y) * 1.005;
    for (let i = 0; i < 80; i++) {
      const a0 = (i / 80) * Math.PI * 2; const a1 = ((i + 1) / 80) * Math.PI * 2;
      pos.push(Math.cos(a0) * r, y, Math.sin(a0) * r, Math.cos(a1) * r, y, Math.sin(a1) * r);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  return g;
}

/* A real chest X-ray (CC0, Wikimedia Commons) turned into a hologram: edges glow, soft tissue falls away. */
function Xray({ xray }) {
  const tex = useTexture('/images/xray.jpg');
  const mat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { map: { value: tex }, px: { value: new THREE.Vector2(3 / 1280, 3 / 1464) }, k: { value: 1.7 }, t: { value: 0 }, c1: { value: ICE.clone() }, c2: { value: VIOLET.clone() } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `uniform sampler2D map; uniform vec2 px; uniform float k; uniform float t; uniform vec3 c1; uniform vec3 c2; varying vec2 vUv;
      float L(vec2 o){ vec3 c = texture2D(map, vUv + o * px).rgb; return dot(c, vec3(0.299, 0.587, 0.114)); }
      void main(){
        float gx = -L(vec2(-1.,-1.)) - 2.*L(vec2(-1.,0.)) - L(vec2(-1.,1.)) + L(vec2(1.,-1.)) + 2.*L(vec2(1.,0.)) + L(vec2(1.,1.));
        float gy = -L(vec2(-1.,-1.)) - 2.*L(vec2(0.,-1.)) - L(vec2(1.,-1.)) + L(vec2(-1.,1.)) + 2.*L(vec2(0.,1.)) + L(vec2(1.,1.));
        float e = smoothstep(0.08, 0.3, length(vec2(gx, gy)));
        float base = smoothstep(0.62, 0.95, L(vec2(0.)));
        vec2 d = abs(vUv - 0.5) * 2.0;
        float v = (1.0 - smoothstep(0.7, 0.97, d.x)) * (1.0 - smoothstep(0.72, 0.96, d.y));
        float scan = 0.82 + 0.18 * sin(vUv.y * 700.0 - t * 5.0);
        float sweep = smoothstep(0.05, 0.0, abs(vUv.y - fract(t * 0.16))) * 0.9;
        float glow = (e * 1.15 + base * 0.16) * scan + sweep * (e + base * 0.3);
        vec3 col = mix(c2, c1, clamp(vUv.y * 1.2, 0.0, 1.0)) * glow * k * v;
        gl_FragColor = vec4(col, clamp(max(col.r, max(col.g, col.b)), 0.0, 1.0));
      }`,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
  }), [tex]);
  useFrame((s) => { mat.uniforms.t.value = s.clock.elapsedTime; mat.uniforms.k.value = 1.7 + 0.6 * (xray ?? S.xray); });
  return (
    <group position={[0, 0.78, 0.04]}>
      <mesh material={mat}><planeGeometry args={[2.55, 2.92]} /></mesh>
      <mesh material={mat} position={[0, 0, -0.12]} scale={0.985}><planeGeometry args={[2.55, 2.92]} /></mesh>
    </group>
  );
}

function Torso({ xray }) {
  const { pts, R } = useTorso();
  const root = useRef();
  const scan = useRef();
  const heart = useRef();
  const mats = useRef({});

  const g = useMemo(() => {
    const shell = new THREE.LatheGeometry(pts, 96);
    const lines = contourLines(pts, R);
    const ribs = [];
    for (let k = 0; k < 9; k++) {
      const y = 1.5 - k * 0.19; const rr = R(y) * 0.8; const arc = [];
      for (let i = 0; i <= 26; i++) { const s = i / 26; const phi = s * 0.96 * Math.PI; arc.push(new THREE.Vector3(Math.sin(phi) * rr, y - 0.2 * s, -Math.cos(phi) * rr)); }
      ribs.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(arc), 60, 0.011, 6, false));
    }
    const spineCurve = new THREE.CatmullRomCurve3([-1.5, -0.8, 0, 0.8, 1.5, 2.25].map((y, i) => new THREE.Vector3(0, y, -R(y) * 0.62 + Math.sin(i) * 0.03)));
    const spine = new THREE.TubeGeometry(spineCurve, 120, 0.022, 8, false);
    const vertebrae = Array.from({ length: 30 }, (_, i) => { const y = -1.45 + i * 0.125; return [0, y, -R(y) * 0.62]; });
    const clav = (s) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0.04 * s, 1.62, R(1.6) * 0.5), new THREE.Vector3(0.55 * s, 1.72, R(1.7) * 0.3), new THREE.Vector3(1.05 * s, 1.62, 0)]), 30, 0.028, 6, false);
    const arm = (s) => [
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(1.08 * s, 1.55, 0), new THREE.Vector3(1.42 * s, 0.85, 0.12), new THREE.Vector3(1.62 * s, 0.25, 0.32)]), 40, 0.17, 16, false),
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(1.62 * s, 0.25, 0.32), new THREE.Vector3(1.85 * s, -0.25, 0.75), new THREE.Vector3(2.05 * s, -0.55, 1.2)]), 40, 0.12, 16, false),
    ];
    const bone = (s) => [
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(1.08 * s, 1.55, 0), new THREE.Vector3(1.42 * s, 0.85, 0.12), new THREE.Vector3(1.62 * s, 0.25, 0.32)]), 30, 0.03, 6, false),
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(1.62 * s, 0.25, 0.32), new THREE.Vector3(1.85 * s, -0.25, 0.75), new THREE.Vector3(2.05 * s, -0.55, 1.2)]), 30, 0.025, 6, false),
    ];
    const pelvis = (s) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0.05 * s, -1.45, 0.25), new THREE.Vector3(0.55 * s, -1.25, 0.2), new THREE.Vector3(0.7 * s, -0.95, -0.05), new THREE.Vector3(0.2 * s, -1.05, -0.35)]), 40, 0.03, 8, false);
    const lung = bumpy(new THREE.IcosahedronGeometry(1, 18), 0.06, 5, 1.1);
    const organ = bumpy(new THREE.IcosahedronGeometry(1, 16), 0.12, 7, 2.4);
    const gut = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(Array.from({ length: 24 }, (_, i) => { const t = i / 23; return new THREE.Vector3(Math.sin(t * Math.PI * 5) * 0.38, -0.55 - t * 0.55, 0.22 + Math.cos(t * Math.PI * 5) * 0.08); })), 160, 0.06, 8, false);
    const heartG = bumpy(new THREE.IcosahedronGeometry(0.2, 12), 0.03, 6, 0.4);
    return { shell, lines, ribs, spine, vertebrae, clavs: [clav(1), clav(-1)], arms: [...arm(1), ...arm(-1)], bones: [...bone(1), ...bone(-1)], pelvis: [pelvis(1), pelvis(-1)], lung, organ, gut, heartG };
  }, [pts, R]);

  const m = useMemo(() => ({
    shellRim: rim(1.5), shellFill: glowMat('#2f9e78', 0.05), lines: new THREE.LineBasicMaterial({ color: '#A6F2D6', transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false }),
    bone: glowMat('#b4f5dc', 0.55), spine: glowMat('#e9fbff', 0.8), armRim: rim(1.2, 2.0), organRim: rim(1.6, 1.8), organFill: glowMat('#4fd1a0', 0.18), heart: glowMat('#7fe0bf', 0.95),
  }), []);
  mats.current = m;

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const x = smooth(0.05, 0.95, xray ?? S.xray);
    root.current.rotation.y = Math.sin(t * 0.3) * 0.18;
    m.shellRim.uniforms.k.value = 1.5 - 0.9 * x;
    m.shellFill.opacity = 0.05 - 0.04 * x;
    m.lines.opacity = 0.22 - 0.15 * x;
    m.organRim.uniforms.k.value = 1.6 + 1.2 * x;
    m.organFill.opacity = 0.18 + 0.2 * x;
    m.bone.opacity = 0.5 + 0.05 * Math.sin(t * 1.5) + 0.2 * x;
    const beat = 1 + Math.max(0, Math.sin(t * 3.2)) * 0.18;
    heart.current.scale.setScalar(beat);
    scan.current.position.y = -1.5 + ((t * 0.45) % 1) * 3.8;
    scan.current.material.opacity = 0.55;
  });

  return (
    <group ref={root}>
      <group scale={[1, 1, 0.62]}>
        <mesh geometry={g.shell} material={m.shellRim} />
        <mesh geometry={g.shell} material={m.shellFill} />
        <lineSegments geometry={g.lines} material={m.lines} />
        {g.vertebrae.filter((p) => p[1] < -0.55).map((p, i) => (<mesh key={i} position={p} material={m.bone}><boxGeometry args={[0.1, 0.04, 0.08]} /></mesh>))}
        {g.pelvis.map((c, i) => <mesh key={i} geometry={c} material={m.bone} />)}
        {[1, -1].map((s) => (
          <group key={s}>
            <mesh geometry={g.organ} material={m.organRim} position={[0.36 * s, -0.42, 0.05]} scale={[0.28, 0.36, 0.26]} />
            <mesh geometry={g.organ} material={m.organFill} position={[0.36 * s, -0.42, 0.05]} scale={[0.26, 0.34, 0.24]} />
          </group>
        ))}
        <mesh geometry={g.gut} material={m.organRim} />
        <mesh ref={heart} geometry={g.heartG} material={m.heart} position={[-0.14, 0.78, 0.25]} />
      </group>
      <Xray xray={xray} />
      {g.arms.map((a, i) => <mesh key={`a${i}`} geometry={a} material={m.armRim} />)}
      {g.bones.map((a, i) => <mesh key={`b${i}`} geometry={a} material={m.bone} />)}
      <mesh ref={scan} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.0, 1.08, 96]} />
        <meshBasicMaterial color="#A6F2D6" transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Ready() {
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => window.dispatchEvent(new Event('vw-3d-ready'))));
    return () => cancelAnimationFrame(id);
  }, []);
  return null;
}

function Pointer({ children }) {
  const gr = useRef();
  const mm = useRef({ x: 0, y: 0 });
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const move = (e) => { mm.current.x = (e.clientX / window.innerWidth - 0.5) * 2; mm.current.y = (e.clientY / window.innerHeight - 0.5) * 2; };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);
  useFrame((s, dt) => {
    gr.current.rotation.y = damp(gr.current.rotation.y, mm.current.x * 0.4 + (S.rot || 0), 3, dt);
    gr.current.rotation.x = damp(gr.current.rotation.x, mm.current.y * 0.1, 3, dt);
  });
  return <group ref={gr}>{children}</group>;
}

/** Holographic anatomy torso (ribcage, spine, lungs, heart, organs), transparent canvas. */
export default function HoloCanvas({ className = '', xray, cam = [0, 0.3, 8], fov = 34, look = 0.3 }) {
  const ref = useRef(null);
  const [on, setOn] = useState(true);
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    setMobile(window.matchMedia('(max-width: 820px)').matches);
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: '100px' });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} aria-hidden="true">
      <Canvas frameloop={on ? 'always' : 'never'} dpr={mobile ? [1, 1.4] : [1, 1.8]} gl={{ alpha: true, antialias: true }} camera={{ fov, position: cam }} onCreated={({ camera }) => camera.lookAt(0, look, 0)}>
        <Suspense fallback={null}>
          <Pointer><Torso xray={xray} /></Pointer>
          <Ready />
          <Sparkles count={mobile ? 40 : 110} scale={[7, 6, 4]} position={[0, 0.3, 0]} size={2.4} speed={0.3} opacity={0.8} color="#A6F2D6" />
        </Suspense>
      </Canvas>
    </div>
  );
}
