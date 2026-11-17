'use client';
import * as THREE from 'three';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Html, Lightformer, useGLTF, useTexture } from '@react-three/drei';

const damp = THREE.MathUtils.damp;
const HEAD_H = 3.5;

/* treatment areas, as (x, y) on the face; z is found by casting a ray onto the real scan */
export const ZONES = [
  { key: 'forehead', x: 0, y: 2.84, rot: 0.05, tilt: 0.06 },
  { key: 'brows', x: 0, y: 2.6, rot: 0.0, tilt: 0.02 },
  { key: 'eyes', x: 0.4, y: 2.5, rot: -0.28, tilt: 0.0 },
  { key: 'skin', x: -0.32, y: 2.18, rot: 0.22, tilt: -0.04 },
];

function useHead() {
  const { scene } = useGLTF('/models/head.glb');
  return useMemo(() => {
    scene.updateMatrixWorld(true);
    let g = null;
    scene.traverse((o) => { if (o.isMesh && !g) { g = o.geometry.clone(); g.applyMatrix4(o.matrixWorld); } });
    if (!g) return null;
    g.computeBoundingBox();
    const b = g.boundingBox;
    const size = b.getSize(new THREE.Vector3());
    const c = b.getCenter(new THREE.Vector3());
    g.translate(-c.x, -b.min.y, -c.z);
    const k = HEAD_H / size.y;
    g.scale(k, k, k);
    g.computeVertexNormals();
    return g;
  }, [scene]);
}

function Head({ active, onPick, overlay }) {
  const { camera, gl } = useThree();
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const geo = useHead();
  const [color, normal] = useTexture(['/models/head-color.jpg', '/models/head-normal.jpg']);
  useMemo(() => { color.colorSpace = THREE.SRGBColorSpace; color.anisotropy = 8; normal.anisotropy = 8; }, [color, normal]);
  const group = useRef();
  const mesh = useRef();
  const scan = useRef();
  const [points, setPoints] = useState([]);
  const mouse = useRef({ x: 0, y: 0 });

  // put each hotspot exactly on the scanned skin
  useEffect(() => {
    if (!mesh.current) return;
    const ray = new THREE.Raycaster();
    const pts = ZONES.map((z) => {
      ray.set(new THREE.Vector3(z.x, z.y, 6), new THREE.Vector3(0, 0, -1));
      const hit = ray.intersectObject(mesh.current, false)[0];
      return hit ? hit.point.clone().add(new THREE.Vector3(0, 0, 0.02)) : new THREE.Vector3(z.x, z.y, 0.9);
    });
    setPoints(pts);
  }, [geo]);

  useEffect(() => {
    const move = (e) => { mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2; mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2; };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);

  useFrame((state, dt) => {
    const z = ZONES[active];
    group.current.rotation.y = damp(group.current.rotation.y, z.rot + mouse.current.x * 0.12, 3.2, dt);
    group.current.rotation.x = damp(group.current.rotation.x, z.tilt + mouse.current.y * 0.04, 3.2, dt);
    if (scan.current) {
      const t = state.clock.elapsedTime;
      scan.current.position.y = 1.95 + ((t * 0.35) % 1) * 1.25;
      scan.current.material.opacity = 0.35 + 0.15 * Math.sin(t * 3);
    }
    // draw each callout line from the point on the face to its label card
    if (overlay?.container.current && points.length) {
      group.current.updateMatrixWorld();
      const cr = overlay.container.current.getBoundingClientRect();
      const vr = gl.domElement.getBoundingClientRect();
      points.forEach((p, i) => {
        const path = overlay.paths.current[i];
        const card = overlay.cards.current[i];
        if (!path || !card) return;
        tmp.copy(p).applyMatrix4(group.current.matrixWorld).project(camera);
        const hx = vr.left - cr.left + (tmp.x * 0.5 + 0.5) * vr.width;
        const hy = vr.top - cr.top + (-tmp.y * 0.5 + 0.5) * vr.height;
        const rc = card.getBoundingClientRect();
        const left = overlay.sides[i] === 'left';
        const ax = (left ? rc.right : rc.left) - cr.left;
        const ay = rc.top - cr.top + rc.height / 2;
        const ex = ax + (left ? 40 : -40);
        path.setAttribute('d', `M${hx.toFixed(1)} ${hy.toFixed(1)} L${ex.toFixed(1)} ${ay.toFixed(1)} L${ax.toFixed(1)} ${ay.toFixed(1)}`);
      });
    }
  });

  if (!geo) return null;
  return (
    <group ref={group}>
      <mesh ref={mesh} geometry={geo}>
        <meshPhysicalMaterial map={color} normalMap={normal} normalScale={new THREE.Vector2(1.1, 1.1)} roughness={0.55} metalness={0} sheen={0.5} sheenRoughness={0.5} sheenColor="#ffb9a0" clearcoat={0.12} clearcoatRoughness={0.4} envMapIntensity={0.8} />
      </mesh>
      {/* a soft scanning band that sweeps the face */}
      <mesh ref={scan} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.62, 0.66, 96]} />
        <meshBasicMaterial color="#8BDFFF" transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      {points.map((p, i) => (
        <Html key={ZONES[i].key} position={p} center occlude={[mesh]} zIndexRange={[20, 0]}>
          <button
            type="button" onClick={() => onPick(i)} aria-label={`Show area ${i + 1}`}
            className={`relative grid place-items-center rounded-full transition-all duration-500 ${i === active ? 'h-9 w-9' : 'h-6 w-6'}`}
          >
            <span className={`absolute inset-0 rounded-full ${i === active ? 'animate-ping bg-ice/50' : 'bg-white/20'}`} />
            <span className={`relative rounded-full ring-2 ring-white ${i === active ? 'h-4 w-4 bg-ice shadow-[0_0_20px_#8BDFFF]' : 'h-2.5 w-2.5 bg-violet'}`} />
          </button>
        </Html>
      ))}
    </group>
  );
}

/** Close-up of a real 3D head scan, turned to each treatment area in turn. */
export default function TreatmentScene({ active, onPick, overlay }) {
  const ref = useRef(null);
  const [on, setOn] = useState(true);
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    setMobile(window.matchMedia('(max-width: 820px)').matches);
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: '150px' });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="h-full w-full" aria-hidden="true">
      <Canvas
        frameloop={on ? 'always' : 'never'} dpr={mobile ? [1, 1.4] : [1, 1.8]}
        gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        camera={{ fov: 26, position: [0, 2.62, 5.6] }}
        onCreated={({ camera }) => camera.lookAt(0, 2.56, 0)}
      >
        <ambientLight intensity={0.45} />
        <directionalLight position={[-2.5, 4, 5]} intensity={2.2} color="#fff4ea" />
        <directionalLight position={[3.5, 2, -2]} intensity={2.4} color="#8BDFFF" />
        <directionalLight position={[-4, 1, -3]} intensity={1.8} color="#7557FF" />
        <Suspense fallback={null}>
          <Environment resolution={256} frames={1}>
            <Lightformer form="rect" intensity={3} position={[0, 6, 4]} scale={[10, 3, 1]} color="#ffffff" />
            <Lightformer form="rect" intensity={2} position={[-6, 3, 2]} scale={[5, 4, 1]} color="#dff4ff" />
            <Lightformer form="rect" intensity={2.5} position={[6, 2, -2]} scale={[5, 4, 1]} color="#b9a8ff" />
          </Environment>
          <Head active={active} onPick={onPick} overlay={overlay} />
        </Suspense>
      </Canvas>
    </div>
  );
}
