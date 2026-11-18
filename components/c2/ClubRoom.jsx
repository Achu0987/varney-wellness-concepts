'use client';
import { A } from '@/lib/asset';
import * as THREE from 'three';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, useGLTF, useTexture } from '@react-three/drei';
import { EffectComposer, DepthOfField, Vignette } from '@react-three/postprocessing';

/*
  Inside the club: a walk through one photoreal room, driven by scroll.
  Real-scan PBR textures, models and lighting: Poly Haven (CC0).
  Velvet sofa: Wayfair via Khronos glTF Sample Assets (CC BY 4.0).
*/

const PH = (id) => A(`/models/ph/${id}/${id}.gltf`);
const SOFA = A('/models/GlamVelvetSofa.glb');
[PH('marble_bust_01'), PH('brass_vase_01'), PH('brass_vase_03'), PH('potted_plant_02'), PH('ceramic_vase_02'), SOFA].forEach((u) => useGLTF.preload(u));
const damp = THREE.MathUtils.damp;

function Prop({ url, size, axis = 'y', position = [0, 0, 0], rotation = [0, 0, 0], fabric }) {
  const { scene, parser } = useGLTF(url);
  const { obj, k } = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((o) => {
      if (!o.isMesh || !o.material) return;
      const m = o.material;
      if (m.transmission > 0) { m.transmission = 0; m.transparent = true; m.opacity = 0.3; m.roughness = 0.05; m.depthWrite = false; }
    });
    const box = new THREE.Box3().setFromObject(c);
    const s = box.getSize(new THREE.Vector3());
    const ctr = box.getCenter(new THREE.Vector3());
    c.position.set(-ctr.x, -box.min.y, -ctr.z);
    return { obj: c, k: size / (axis === 'x' ? s.x : s.y) };
  }, [scene, size, axis]);
  useEffect(() => {
    if (fabric == null) return undefined;
    let live = true;
    parser.getDependency('material', fabric).then((mat) => { if (live) obj.traverse((o) => { if (o.isMesh && o.material && /fabric/i.test(o.material.name)) o.material = mat; }); });
    return () => { live = false; };
  }, [obj, parser, fabric]);
  return <group position={position} rotation={rotation} scale={k}><primitive object={obj} /></group>;
}

/** PBR texture set with repeat, from /models/ph/tex/<id>/ */
function useSurface(id, rx, ry) {
  const t = useTexture({ map: A(`/models/ph/tex/${id}/diff.jpg`), normalMap: A(`/models/ph/tex/${id}/nor.jpg`), roughnessMap: A(`/models/ph/tex/${id}/rough.jpg`) });
  return useMemo(() => {
    const out = {};
    Object.entries(t).forEach(([k, tex]) => {
      const c = tex.clone(); c.wrapS = c.wrapT = THREE.RepeatWrapping; c.repeat.set(rx, ry); c.anisotropy = 8;
      if (k === 'map') c.colorSpace = THREE.SRGBColorSpace;
      c.needsUpdate = true; out[k] = c;
    });
    return out;
  }, [t, rx, ry]);
}

/** A wall with an arched opening, extruded so it has real thickness. */
function ArchWall({ width, height, openW, openH, depth = 0.3, position, rotation = [0, 0, 0], children }) {
  const geo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-width / 2, 0); s.lineTo(width / 2, 0); s.lineTo(width / 2, height); s.lineTo(-width / 2, height); s.lineTo(-width / 2, 0);
    const r = openW / 2; const h = new THREE.Path();
    h.moveTo(-r, 0); h.lineTo(-r, openH - r); h.absarc(0, openH - r, r, Math.PI, 0, true); h.lineTo(r, 0); h.lineTo(-r, 0);
    s.holes.push(h);
    const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: 48 });
    g.translate(0, 0, -depth / 2);
    return g;
  }, [width, height, openW, openH, depth]);
  return <mesh geometry={geo} position={position} rotation={rotation}>{children}</mesh>;
}

function Room() {
  const parquet = useSurface('herringbone_parquet', 3, 4);
  const marble = useSurface('marble_01', 3, 3);
  const plasterIn = useSurface('white_plaster_02', 3, 1.5);
  const plasterOut = useSurface('white_plaster_02', 1.2, 0.6);
  const GREEN = '#2c5a4c';
  return (
    <group>
      {/* floors: marble outside the door, parquet inside */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 7]}><planeGeometry args={[14, 8]} /><meshStandardMaterial {...marble} color="#f2ede4" roughness={0.35} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -1]}><planeGeometry args={[9, 8]} /><meshStandardMaterial {...parquet} color="#d9c2a2" /></mesh>
      {/* rug under the sofa */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, -3.3]}><circleGeometry args={[2.0, 96]} /><meshStandardMaterial color="#cfc2aa" roughness={1} /></mesh>

      {/* walls: forest-green plaster inside, ivory outside, ceiling dark */}
      <mesh position={[0, 2.1, -5]}><planeGeometry args={[9, 4.2]} /><meshStandardMaterial {...plasterIn} color={GREEN} /></mesh>
      <mesh position={[-4.5, 2.1, -1]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[8, 4.2]} /><meshStandardMaterial {...plasterIn} color={GREEN} /></mesh>
      <mesh position={[4.5, 2.1, -1]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[8, 4.2]} /><meshStandardMaterial {...plasterIn} color={GREEN} /></mesh>
      <mesh position={[0, 4.2, -1]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[9, 8]} /><meshStandardMaterial color="#1d3d35" roughness={0.95} /></mesh>
      <ArchWall width={9} height={4.2} openW={2.3} openH={3.1} position={[0, 0, 3]}><meshStandardMaterial {...plasterOut} color="#efe8dc" /></ArchWall>
      {/* outside façade continues left and right */}
      <mesh position={[-9.75, 2.1, 3.16]}><planeGeometry args={[10.5, 4.2]} /><meshStandardMaterial {...plasterOut} color="#efe8dc" /></mesh>
      <mesh position={[9.75, 2.1, 3.16]}><planeGeometry args={[10.5, 4.2]} /><meshStandardMaterial {...plasterOut} color="#efe8dc" /></mesh>

      {/* back wall: a brass ring above the sofa */}
      <mesh position={[0, 2.35, -4.96]}><torusGeometry args={[0.62, 0.035, 32, 160]} /><meshStandardMaterial color="#C5A77B" metalness={1} roughness={0.25} /></mesh>
      <mesh position={[0, 2.35, -4.98]}><circleGeometry args={[0.6, 96]} /><meshStandardMaterial color="#1f4a3f" metalness={0.5} roughness={0.15} /></mesh>

      <Prop url={SOFA} size={2.3} axis="x" position={[0, 0, -4.2]} fabric={2} />
      <Prop url={PH('brass_vase_03')} size={0.42} position={[1.6, 0, -3.95]} />
      <Prop url={PH('ceramic_vase_02')} size={0.34} position={[1.95, 0, -4.3]} />

      {/* the consultation corner: marble plinth and bust */}
      <mesh position={[-2.7, 0.55, -2.6]}><boxGeometry args={[0.55, 1.1, 0.55]} /><meshStandardMaterial color="#efe9df" roughness={0.22} metalness={0.02} /></mesh>
      <Prop url={PH('marble_bust_01')} size={0.72} position={[-2.7, 1.1, -2.6]} rotation={[0, 0.5, 0]} />

      {/* side table with brass and ceramic */}
      <mesh position={[3.0, 0.32, -3.4]}><cylinderGeometry args={[0.42, 0.42, 0.64, 48]} /><meshStandardMaterial color="#C5A77B" metalness={0.9} roughness={0.3} /></mesh>
      <Prop url={PH('brass_vase_01')} size={0.62} position={[2.9, 0.64, -3.45]} />
      <Prop url={PH('ceramic_vase_02')} size={0.3} position={[3.2, 0.64, -3.25]} />
      <Prop url={PH('potted_plant_02')} size={1.25} position={[3.75, 0, -4.4]} />
      <Prop url={PH('potted_plant_02')} size={1.1} position={[-3.8, 0, -4.4]} rotation={[0, 1.4, 0]} />
      <Prop url={PH('brass_vase_03')} size={0.32} position={[-2.0, 0, -4.5]} />

      {/* warm light: a spot over the sofa, candle glow, a lamp near the bust */}
      <spotLight position={[0, 4.0, -2.2]} angle={0.6} penumbra={0.9} intensity={11} distance={8} color="#ffdcae" />
      <pointLight position={[1.65, 0.4, -3.9]} intensity={1.6} distance={2.6} decay={2} color="#ffad5c" />
      <pointLight position={[-2.4, 2.2, -1.8]} intensity={2.4} distance={4} decay={2} color="#ffe6c4" />
      <ContactShadows position={[0, 0.008, -2.5]} opacity={0.6} scale={10} blur={2.4} far={2} frames={1} color="#1a120a" />
    </group>
  );
}

// the walk: position and look target per stop
const POS = [[0, 1.6, 8.6], [0, 1.55, 3.9], [-1.25, 1.5, -0.4], [0.55, 1.2, -1.1], [2.1, 1.35, -1.7], [-1.15, 1.7, 1.0]].map((p) => new THREE.Vector3(...p));
const LOOK = [[0, 1.45, 0], [0, 1.25, -4], [-2.7, 1.35, -2.6], [0, 0.65, -4.2], [3.0, 0.85, -3.5], [-1.05, 1.1, -4.4]].map((p) => new THREE.Vector3(...p));
const posCurve = new THREE.CatmullRomCurve3(POS, false, 'centripetal');
const lookCurve = new THREE.CatmullRomCurve3(LOOK, false, 'centripetal');

function Walk({ progress, focus }) {
  const { camera } = useThree();
  const look = useRef(LOOK[0].clone());
  const m = useRef({ x: 0, y: 0 });
  const s = useRef(0);
  useEffect(() => {
    const move = (e) => { m.current.x = (e.clientX / window.innerWidth - 0.5) * 2; m.current.y = (e.clientY / window.innerHeight - 0.5) * 2; };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);
  useFrame((st, dt) => {
    s.current = damp(s.current, progress.current, 3, dt);
    const t = THREE.MathUtils.clamp(s.current, 0, 1);
    const p = posCurve.getPoint(t); const l = lookCurve.getPoint(t);
    camera.position.set(p.x + m.current.x * 0.12, p.y - m.current.y * 0.06, p.z);
    look.current.set(damp(look.current.x, l.x, 6, dt), damp(look.current.y, l.y, 6, dt), damp(look.current.z, l.z, 6, dt));
    camera.lookAt(look.current);
    if (focus.current) focus.current.copy(look.current);
  });
  return null;
}

export default function ClubRoom({ progress, className = '' }) {
  const [desk, setDesk] = useState(true);
  const focus = useRef(new THREE.Vector3(0, 1.2, -4));
  useEffect(() => { setDesk(window.innerWidth >= 900); }, []);
  return (
    <div className={className} aria-hidden="true">
      <Canvas
        dpr={[1, desk ? 1.6 : 1.3]}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
        camera={{ fov: desk ? 40 : 55, near: 0.05, far: 60, position: POS[0].toArray() }}
      >
        <color attach="background" args={['#EFE8DC']} />
        <ambientLight intensity={0.25} color="#fff1dd" />
        <directionalLight position={[3, 8, 10]} intensity={1.4} color="#fff3e0" />
        <Suspense fallback={null}>
          <Environment files={A('/models/ph/lounge.hdr')} environmentIntensity={0.85} />
          <Room />
        </Suspense>
        <Walk progress={progress} focus={focus} />
        {desk && (
          <EffectComposer multisampling={0}>
            <DepthOfField target={focus.current} focalLength={0.03} bokehScale={2.2} height={480} />
            <Vignette eskil={false} offset={0.22} darkness={0.55} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
