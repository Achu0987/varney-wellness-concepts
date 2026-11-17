'use client';
import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles, useGLTF, useTexture } from '@react-three/drei';
import { S } from '@/lib/c1/state';

useGLTF.preload('/models/head.glb');
useGLTF.preload('/models/skull.glb');

/** Pull the first mesh out of a GLB, bake its transform, centre it and scale it to a target height. */
function useNormalised(url, height, { baseAtZero = true } = {}) {
  const { scene } = useGLTF(url);
  return useMemo(() => {
    scene.updateMatrixWorld(true);
    let g = null;
    scene.traverse((o) => { if (o.isMesh && !g) { g = o.geometry.clone(); g.applyMatrix4(o.matrixWorld); } });
    if (!g) return null;
    g.computeBoundingBox();
    const b = g.boundingBox;
    const size = b.getSize(new THREE.Vector3());
    const c = b.getCenter(new THREE.Vector3());
    g.translate(-c.x, baseAtZero ? -b.min.y : -c.y, -c.z);
    const k = height / size.y;
    g.scale(k, k, k);
    g.computeVertexNormals();
    return g;
  }, [scene, height, baseAtZero]);
}

const ICE = '#8BDFFF';
const HEAD_H = 3.5;
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

/**
 * A real human head scan (skin colour + normal maps from the scan itself) with a real skull inside.
 * Scrolling dissolves the skin to reveal the skull, then closes it again.
 */
export default function RealBust({ mobile = false, bare = false, explode = 0, xray, glow: glowMode = false }) {
  const head = useNormalised('/models/head.glb', HEAD_H);
  const skull = useNormalised('/models/skull.glb', HEAD_H * 0.44, { baseAtZero: false });
  const [color, normal, spec] = useTexture(['/models/head-color.jpg', '/models/head-normal.jpg', '/models/head-spec.jpg']);
  const skin = useRef();
  const skullRef = useRef();
  const ring = useRef();
  const glow = useRef();

  useMemo(() => {
    color.colorSpace = THREE.SRGBColorSpace;
    [color, normal, spec].forEach((t) => { t.anisotropy = 8; });
  }, [color, normal, spec]);

  const skullMat = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: glowMode ? '#d9e6ff' : '#e4e2dc', metalness: glowMode ? 0.4 : 0.05, roughness: glowMode ? 0.3 : 0.5, envMapIntensity: 0.9, clearcoat: 0.25, emissive: glowMode ? '#8BDFFF' : '#2f7fe0', emissiveIntensity: 0.05 }),
    [glowMode],
  );

  /* fresnel rim: the sculpture's edges glow, violet at the base to ice at the crown */
  const rimMat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { c1: { value: new THREE.Color('#8BDFFF') }, c2: { value: new THREE.Color('#7557FF') }, k: { value: 1.4 }, h: { value: HEAD_H } },
    vertexShader: 'varying vec3 vN; varying vec3 vV; varying float vY; void main(){ vY = position.y; vN = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position, 1.0); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }',
    fragmentShader: 'uniform vec3 c1; uniform vec3 c2; uniform float k; uniform float h; varying vec3 vN; varying vec3 vV; varying float vY; void main(){ float f = pow(1.0 - max(dot(normalize(vN), normalize(vV)), 0.0), 2.2); vec3 col = mix(c2, c1, clamp(vY / h, 0.0, 1.0)); gl_FragColor = vec4(col * f * k, f); }',
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
  }), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const reveal = smooth(0.12, 0.9, xray ?? S.xray);
    if (skin.current) {
      skin.current.opacity = glowMode ? 0.3 - 0.16 * reveal : 1 - 0.93 * reveal;
      skin.current.emissiveIntensity = glowMode ? 0.3 + 0.3 * reveal : 0.02 + 0.25 * reveal;
    }
    rimMat.uniforms.k.value = 1.3 + 0.9 * reveal;
    if (skullRef.current) skullRef.current.material.emissiveIntensity = glowMode ? 0.35 + 0.45 * reveal : 0.02 + 0.1 * reveal;
    if (glow.current) glow.current.intensity = (0.4 + 1.6 * reveal) * Math.min(1.2, S.glow);
    if (ring.current) {
      ring.current.visible = glowMode || reveal > 0.02;
      ring.current.position.y = HEAD_H * (0.52 + 0.46 * (0.5 + 0.5 * Math.sin(t * 0.9)));
      ring.current.material.opacity = glowMode ? 0.5 + 0.4 * reveal : Math.min(1, reveal * 1.5) * 0.9;
    }
  });

  if (!head || !skull) return null;

  return (
    <group>
      {/* real skull */}
      <mesh ref={skullRef} geometry={skull} material={skullMat} position={[0, HEAD_H * 0.745, -0.03]} scale={[0.86, 0.92, 0.7]} />
      <pointLight ref={glow} position={[0, HEAD_H * 0.74, 0.3]} color="#8f7bff" distance={5} decay={1.6} intensity={4} />

      {/* real skin */}
      <group position={[0, explode * 1.9, 0]}>
      {glowMode ? (<>
        <mesh geometry={head}>
          <meshPhysicalMaterial ref={skin} color="#9aa8ff" transparent opacity={0.3} roughness={0.15} metalness={0.1} clearcoat={1} envMapIntensity={1.5} emissive="#7557FF" emissiveIntensity={0.3} depthWrite={false} normalMap={normal} />
        </mesh>
        <mesh geometry={head} material={rimMat} scale={1.004} />
      </>) : (
      <mesh geometry={head}>
        <meshPhysicalMaterial
          ref={skin} map={color} normalMap={normal} normalScale={new THREE.Vector2(1.1, 1.1)}
          roughness={0.55} metalness={0} envMapIntensity={0.7} sheen={0.5} sheenRoughness={0.5} sheenColor="#ffb9a0"
          clearcoat={0.12} clearcoatRoughness={0.4} specularIntensityMap={spec} transparent emissive="#8BDFFF" emissiveIntensity={0.02}
          emissiveMap={null}
        />
      </mesh>
      )}
      </group>

      {/* scanning ring sweeps the head while the skin is open */}
      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]} visible={false}>
        <torusGeometry args={[0.95, 0.012, 8, 160]} />
        <meshBasicMaterial color={ICE} transparent opacity={0.9} toneMapped={false} />
      </mesh>

      {!bare && <>
      {/* plinth */}
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.95, 1.05, 0.2, 80]} />
        <meshStandardMaterial color="#10183a" metalness={1} roughness={0.28} envMapIntensity={1.2} />
      </mesh>
      <mesh position={[0, -0.015, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.97, 0.012, 8, 120]} />
        <meshBasicMaterial color={ICE} toneMapped={false} />
      </mesh>

      <Sparkles count={mobile ? 40 : 100} scale={[5, 6.5, 4]} position={[0, 1.8, 0]} size={2.6} speed={0.22} opacity={0.7} color={ICE} noise={0.6} />
      <Sparkles count={mobile ? 20 : 50} scale={[6, 7, 5]} position={[0, 1.8, 0]} size={4} speed={0.16} opacity={0.6} color="#9d8bff" noise={0.8} />
      </>}
    </group>
  );
}
