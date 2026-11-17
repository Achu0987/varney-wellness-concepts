'use client';
import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Sparkles, useGLTF } from '@react-three/drei';
import { S } from '@/lib/c1/state';

const ICE = new THREE.Color('#8BDFFF');
const VIOLET = new THREE.Color('#7557FF');

/* Bust silhouette: [radius, y]. A classical torso-and-head form, abstracted. */
const PROFILE = [
  [0.8, -0.35], [0.78, -0.1], [0.82, 0.3], [0.95, 0.7], [1.1, 1.05], [1.26, 1.38], [1.16, 1.6],
  [0.88, 1.74], [0.5, 1.86], [0.3, 1.98], [0.24, 2.2], [0.25, 2.4], [0.4, 2.55], [0.46, 2.8],
  [0.5, 3.0], [0.47, 3.25], [0.36, 3.5], [0.16, 3.62], [0.0, 3.66],
];
const Y0 = -0.35;
const Y1 = 3.66;

function useProfile() {
  return useMemo(() => {
    const pts = new THREE.SplineCurve(PROFILE.map(([r, y]) => new THREE.Vector2(r, y))).getPoints(160).map(
      (p) => new THREE.Vector2(Math.max(0.0005, p.x), p.y),
    );
    const R = (y) => {
      if (y <= pts[0].y) return pts[0].x;
      for (let i = 0; i < pts.length - 1; i++) {
        if (pts[i + 1].y >= y) {
          const t = (y - pts[i].y) / Math.max(1e-6, pts[i + 1].y - pts[i].y);
          return pts[i].x + (pts[i + 1].x - pts[i].x) * t;
        }
      }
      return pts[pts.length - 1].x;
    };
    return { pts, R };
  }, []);
}

function buildScanLines(pts, R) {
  const pos = [];
  const col = [];
  const c = new THREE.Color();
  const push = (a, b, t) => {
    c.copy(ICE).lerp(VIOLET, THREE.MathUtils.clamp(t, 0, 1) * 0.85);
    pos.push(a.x, a.y, a.z, b.x, b.y, b.z);
    col.push(c.r, c.g, c.b, c.r, c.g, c.b);
  };
  // contour rings
  for (let y = Y0 + 0.15; y < Y1 - 0.1; y += 0.24) {
    const r = R(y) * 1.004;
    if (r < 0.03) continue;
    const t = (y - Y0) / (Y1 - Y0);
    for (let i = 0; i < 96; i++) {
      const a0 = (i / 96) * Math.PI * 2;
      const a1 = ((i + 1) / 96) * Math.PI * 2;
      push(
        new THREE.Vector3(Math.cos(a0) * r, y, Math.sin(a0) * r),
        new THREE.Vector3(Math.cos(a1) * r, y, Math.sin(a1) * r),
        t,
      );
    }
  }
  // meridians
  for (let m = 0; m < 8; m++) {
    const a = (m / 8) * Math.PI * 2 + 0.2;
    for (let i = 0; i < pts.length - 1; i += 1) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      if (p0.x < 0.03 || p1.x < 0.03) continue;
      const t = (p0.y - Y0) / (Y1 - Y0);
      push(
        new THREE.Vector3(Math.cos(a) * p0.x * 1.004, p0.y, Math.sin(a) * p0.x * 1.004),
        new THREE.Vector3(Math.cos(a) * p1.x * 1.004, p1.y, Math.sin(a) * p1.x * 1.004),
        t,
      );
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  return g;
}

useGLTF.preload('/models/skull.glb');

function Skull() {
  const { scene } = useGLTF('/models/skull.glb');
  const geo = useMemo(() => {
    scene.updateMatrixWorld(true);
    let g = null;
    scene.traverse((o) => {
      if (o.isMesh && !g) { g = o.geometry.clone(); g.applyMatrix4(o.matrixWorld); }
    });
    if (!g) return null;
    g.computeBoundingBox();
    const b = g.boundingBox;
    const size = b.getSize(new THREE.Vector3());
    const c = b.getCenter(new THREE.Vector3());
    g.translate(-c.x, -c.y, -c.z);
    const k = 1 / size.y;           // unit height, centred on origin
    g.scale(k, k, k);
    g.computeVertexNormals();
    return g;
  }, [scene]);
  const mat = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: '#d6e6ff', metalness: 0.95, roughness: 0.2, envMapIntensity: 1.8, clearcoat: 1, clearcoatRoughness: 0.15, emissive: '#2f7fe0', emissiveIntensity: 0.28 }),
    [],
  );
  if (!geo) return null;
  return <mesh geometry={geo} material={mat} position={[0, 3.0, 0.0]} scale={[0.95, 0.95, 0.8]} rotation={[0, 0, 0]} />;
}

export default function Sculpture({ mobile = false }) {
  const { pts, R } = useProfile();
  const lines = useMemo(() => buildScanLines(pts, R), [pts, R]);
  const lineMat = useRef();
  const core = useRef();
  const coreLight = useRef();
  const halo = useRef();
  const wire = useRef();

  const shellGeo = useMemo(() => {
    const g = new THREE.LatheGeometry(pts, mobile ? 80 : 160);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      if (y > 2.3 && z > 0) {
        const nose = 0.2 * Math.exp(-(((y - 2.93) / 0.15) ** 2 + (x / 0.075) ** 2));
        const chin = 0.1 * Math.exp(-(((y - 2.55) / 0.1) ** 2 + (x / 0.13) ** 2));
        const brow = 0.1 * Math.exp(-(((y - 3.16) / 0.07) ** 2 + (x / 0.28) ** 2));
        const lips = 0.05 * Math.exp(-(((y - 2.72) / 0.05) ** 2 + (x / 0.13) ** 2));
        p.setZ(i, z + nose + chin + brow + lips);
      }
    }
    g.computeVertexNormals();
    return g;
  }, [pts, mobile]);

  /* spine: a column of metal vertebrae that follows the back of the torso */
  const vertebrae = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 20; i++) {
      const y = -0.3 + i * 0.148;
      const r = R(y);
      arr.push({ y, z: -r * 0.78, s: 0.05 + 0.06 * Math.min(1, r / 0.8) });
    }
    return arr;
  }, [R]);

  /* ribs: eight pairs wrapping from spine to sternum */
  const ribs = useMemo(() => {
    const out = [];
    for (let k = 0; k < 8; k++) {
      const y = 1.5 - k * 0.2;
      const rr = R(y) * 0.78;
      const pts3 = [];
      for (let i = 0; i <= 28; i++) {
        const s = i / 28;
        const phi = s * 0.97 * Math.PI;
        pts3.push(new THREE.Vector3(Math.sin(phi) * rr, y - 0.17 * s, -Math.cos(phi) * rr));
      }
      out.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts3), 72, 0.02 + 0.004 * (7 - k) / 7, 8, false));
    }
    return out;
  }, [R]);

  const clavicle = useMemo(() => {
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.04, 1.55, R(1.55) * 0.76),
      new THREE.Vector3(0.5, 1.64, R(1.6) * 0.5),
      new THREE.Vector3(1.0, 1.55, 0.05),
    ]);
    return new THREE.TubeGeometry(c, 40, 0.026, 8, false);
  }, [R]);

  const metal = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#b9c4dc', metalness: 1, roughness: 0.2, envMapIntensity: 1.6, emissive: '#3b2bb0', emissiveIntensity: 0.18 }),
    [],
  );
  const ribMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#cfe6ff', metalness: 0.9, roughness: 0.22, envMapIntensity: 1.5, emissive: '#6fcaf0', emissiveIntensity: 0.35 }),
    [],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const x = S.xray;
    if (lineMat.current) lineMat.current.opacity = 0.2 + 0.5 * x;
    const beat = 1 + Math.sin(t * 2.2) * 0.06 + Math.max(0, Math.sin(t * 2.2 - 0.6)) * 0.08;
    if (core.current) {
      core.current.scale.setScalar(beat);
      core.current.material.emissiveIntensity = (1.6 + 1.4 * x) * S.glow;
    }
    if (coreLight.current) coreLight.current.intensity = (7 + 14 * x) * S.glow * beat;
    if (halo.current) { halo.current.rotation.z = t * 0.5; halo.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.7) * 0.35; }
    if (wire.current) wire.current.rotation.y = t * 0.25;
  });

  return (
    <group>
      <group scale={[1, 1, 0.7]}>
        {/* glass shell */}
        <mesh geometry={shellGeo}>
          {mobile ? (
            <meshPhysicalMaterial color="#bfe8ff" transparent opacity={0.2} roughness={0.05} metalness={0} clearcoat={1} envMapIntensity={1.6} side={THREE.DoubleSide} depthWrite={false} />
          ) : (
            <MeshTransmissionMaterial
              samples={5} resolution={512} transmission={1} thickness={0.55} roughness={0.1} ior={1.32}
              chromaticAberration={0.07} anisotropicBlur={0.15} distortion={0.12} distortionScale={0.35} temporalDistortion={0.08}
              color="#cfe9ff" attenuationColor="#8BDFFF" attenuationDistance={2.2} clearcoat={1} clearcoatRoughness={0.05}
              envMapIntensity={1.7} backside={false} side={THREE.DoubleSide}
            />
          )}
        </mesh>

        {/* glowing scan contours */}
        <lineSegments geometry={lines}>
          <lineBasicMaterial ref={lineMat} vertexColors transparent opacity={0.25} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </lineSegments>

        {/* skeleton */}
        {vertebrae.map((v, i) => (
          <mesh key={i} position={[0, v.y, v.z]} scale={[1.35, 1, 1]} material={metal}>
            <capsuleGeometry args={[v.s, 0.045, 4, 12]} />
          </mesh>
        ))}
        {ribs.map((g, i) => (
          <group key={i}>
            <mesh geometry={g} material={ribMat} />
            <mesh geometry={g} material={ribMat} scale={[-1, 1, 1]} />
          </group>
        ))}
        <mesh position={[0, 0.95, R(0.95) * 0.8]} material={ribMat}>
          <capsuleGeometry args={[0.05, 0.95, 4, 12]} />
        </mesh>
        <mesh geometry={clavicle} material={ribMat} />
        <mesh geometry={clavicle} material={ribMat} scale={[-1, 1, 1]} />

        {/* real skull (CC0, Khronos glTF Sample Assets) */}
        <Skull />

        {/* energy core */}
        <mesh ref={core} position={[-0.2, 0.9, 0.16]}>
          <icosahedronGeometry args={[0.17, 4]} />
          <meshStandardMaterial color="#9d8bff" emissive="#7557FF" emissiveIntensity={2} roughness={0.2} metalness={0.2} toneMapped={false} />
        </mesh>
        <pointLight ref={coreLight} position={[-0.2, 0.9, 0.16]} color="#8f7bff" distance={5} decay={1.6} intensity={8} />
        <mesh ref={halo} position={[-0.2, 0.9, 0.16]}>
          <torusGeometry args={[0.34, 0.006, 8, 96]} />
          <meshBasicMaterial color="#8BDFFF" transparent opacity={0.9} toneMapped={false} />
        </mesh>
      </group>

      {/* plinth */}
      <mesh position={[0, Y0 - 0.1, 0]}>
        <cylinderGeometry args={[0.92, 1.0, 0.16, 80]} />
        <meshStandardMaterial color="#10183a" metalness={1} roughness={0.28} envMapIntensity={1.2} />
      </mesh>
      <mesh position={[0, Y0 - 0.015, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.94, 0.012, 8, 120]} />
        <meshBasicMaterial color="#8BDFFF" toneMapped={false} />
      </mesh>

      {/* dust in the light */}
      <Sparkles count={mobile ? 40 : 110} scale={[5, 6.5, 4]} position={[0, 0.9, 0]} size={3} speed={0.25} opacity={0.8} color="#8BDFFF" noise={0.6} />
      <Sparkles count={mobile ? 20 : 60} scale={[6, 7, 5]} position={[0, 0.9, 0]} size={4.5} speed={0.18} opacity={0.7} color="#9d8bff" noise={0.8} />
    </group>
  );
}
