import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function generateRandomParticles(count) {
  const temp = [];
  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * 50;
    const y = (Math.random() - 0.5) * 50;
    const z = (Math.random() - 0.5) * 50;
    temp.push({ x, y, z });
  }
  return temp;
}

export function FloatingParticles({ count = 300 }) {
  const meshRef = useRef();
  
  const particles = useMemo(() => generateRandomParticles(count), [count]);

  const particlePositions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    particles.forEach((particle, i) => {
      positions[i * 3] = particle.x;
      positions[i * 3 + 1] = particle.y;
      positions[i * 3 + 2] = particle.z;
    });
    return positions;
  }, [particles, count]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particlePositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#00ff41"
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function AtomStructure() {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.05) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Orbital rings */}
      {[0, 60, 120].map((angle, i) => (
        <mesh key={i} rotation={[0, 0, (angle * Math.PI) / 180]}>
          <torusGeometry args={[3, 0.02, 16, 100]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.3} />
        </mesh>
      ))}
      
      {/* Center sphere */}
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshBasicMaterial color="#00ff41" />
      </mesh>

      {/* Orbiting particles */}
      {[0, 120, 240].map((angle, i) => (
        <mesh
          key={`particle-${i}`}
          position={[
            Math.cos((angle * Math.PI) / 180) * 3,
            0,
            Math.sin((angle * Math.PI) / 180) * 3,
          ]}
        >
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color="#bd93f9" />
        </mesh>
      ))}
    </group>
  );
}
