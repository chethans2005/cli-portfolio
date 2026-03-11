import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

function createDriftData(count, spread, speedRange, brightnessRange) {
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const targetAngleDeg = 30;

  for (let i = 0; i < count; i++) {
    const index = i * 3;

    positions[index] = randomRange(-spread, spread);
    positions[index + 1] = randomRange(-spread, spread);
    positions[index + 2] = randomRange(-spread, spread);

    const angle = THREE.MathUtils.degToRad(targetAngleDeg + randomRange(-6, 6));
    const speed = randomRange(speedRange[0] * 0.8, speedRange[0] * 1.2);

    velocities[index] = Math.cos(angle) * speed;
    velocities[index + 1] = Math.sin(angle) * speed;
    velocities[index + 2] = randomRange(-speedRange[2] * 0.15, speedRange[2] * 0.15);

    const brightness = randomRange(brightnessRange[0], brightnessRange[1]);
    colors[index] = brightness;
    colors[index + 1] = brightness;
    colors[index + 2] = brightness;
  }

  return { positions, velocities, colors };
}

function DriftLayer({ count, spread, size, speedRange, brightnessRange, opacity }) {
  const pointsRef = useRef(null);
  const { positions, velocities, colors } = useMemo(
    () => createDriftData(count, spread, speedRange, brightnessRange),
    [count, spread, speedRange, brightnessRange]
  );
  const circleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return null;
    }

    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.95)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) {
      return;
    }

    const positionAttr = pointsRef.current.geometry.attributes.position;
    const scaledDelta = delta * 60;

    for (let i = 0; i < count; i++) {
      const index = i * 3;
      positionAttr.array[index] += velocities[index] * scaledDelta;
      positionAttr.array[index + 1] += velocities[index + 1] * scaledDelta;
      positionAttr.array[index + 2] += velocities[index + 2] * scaledDelta;

      if (positionAttr.array[index] > spread) positionAttr.array[index] = -spread;
      if (positionAttr.array[index] < -spread) positionAttr.array[index] = spread;
      if (positionAttr.array[index + 1] > spread) positionAttr.array[index + 1] = -spread;
      if (positionAttr.array[index + 1] < -spread) positionAttr.array[index + 1] = spread;
      if (positionAttr.array[index + 2] > spread) positionAttr.array[index + 2] = -spread;
      if (positionAttr.array[index + 2] < -spread) positionAttr.array[index + 2] = spread;
    }

    positionAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color="#ffffff"
        vertexColors
        map={circleTexture}
        alphaMap={circleTexture}
        transparent
        opacity={opacity}
        alphaTest={0.08}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}

export function StarfieldParticles() {
  return (
    <>
      <DriftLayer
        count={1540}
        spread={24}
        size={0.085}
        speedRange={[0.0252, 0.0248, 0.0242]}
        brightnessRange={[0.45, 1]}
        opacity={0.92}
      />
      <DriftLayer
        count={1450}
        spread={20}
        size={0.16}
        speedRange={[0.0285, 0.0278, 0.0268]}
        brightnessRange={[0.62, 1]}
        opacity={0.85}
      />
    </>
  );
}
