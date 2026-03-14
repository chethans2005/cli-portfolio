import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ── shared star texture (created once) ──────────────────── */
let _sharedTexture = null;
function getStarTexture() {
  if (_sharedTexture) return _sharedTexture;
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0,   'rgba(255,255,255,1)');
  g.addColorStop(0.5, 'rgba(255,255,255,0.9)');
  g.addColorStop(1,   'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  _sharedTexture = new THREE.CanvasTexture(canvas);
  return _sharedTexture;
}

/* ── build particle data ──────────────────────────────────── */
function buildParticles(count, spread, speed, color) {
  const positions  = new Float32Array(count * 3);
  const colors     = new Float32Array(count * 3);

  /* drift direction: upper-right at ~30°, consistent across all particles */
  const angle = THREE.MathUtils.degToRad(30);
  const dx = Math.cos(angle) * speed;
  const dy = Math.sin(angle) * speed;

  const c = new THREE.Color(color);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    /* scatter randomly across the volume */
    positions[i3]     = (Math.random() * 2 - 1) * spread;
    positions[i3 + 1] = (Math.random() * 2 - 1) * spread;
    positions[i3 + 2] = (Math.random() * 2 - 1) * spread;

    /* brightness variation — keep hue, vary luminance */
    const b = 0.45 + Math.random() * 0.55;
    colors[i3]     = c.r * b;
    colors[i3 + 1] = c.g * b;
    colors[i3 + 2] = c.b * b;
  }

  return { positions, colors, dx, dy };
}

/* ── single drift layer ───────────────────────────────────── */
function DriftLayer({ count, spread, size, speed, color, opacity }) {
  const ref = useRef(null);

  const { positions, colors, dx, dy } = useMemo(
    () => buildParticles(count, spread, speed, color),
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [count, spread, speed, color]
  );

  const tex = useMemo(getStarTexture, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array;
    const step = delta * 60;
    const sdx = dx * step;
    const sdy = dy * step;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3]     += sdx;
      pos[i3 + 1] += sdy;

      /* wrap — stars that leave one edge re-enter from the opposite side */
      if (pos[i3]     >  spread) pos[i3]     -= spread * 2;
      if (pos[i3]     < -spread) pos[i3]     += spread * 2;
      if (pos[i3 + 1] >  spread) pos[i3 + 1] -= spread * 2;
      if (pos[i3 + 1] < -spread) pos[i3 + 1] += spread * 2;
    }

    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color"    count={count} array={colors}    itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        vertexColors
        map={tex}
        alphaMap={tex}
        transparent
        opacity={opacity}
        alphaTest={0.06}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ── exported component ───────────────────────────────────── */
export function StarfieldParticles() {
  return (
    <>
      {/* background layer — small, dim, slow */}
      <DriftLayer
        count={1400}
        spread={24}
        size={0.07}
        speed={0.122}
        color="#a8ff78"
        opacity={0.75}
      />
      {/* foreground layer — larger, brighter, slightly faster */}
      <DriftLayer
        count={600}
        spread={20}
        size={0.15}
        speed={0.112}
        color="#c8ffb0"
        opacity={0.90}
      />
    </>
  );
}