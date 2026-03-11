import { Canvas } from '@react-three/fiber';
import { StarfieldParticles } from './Particles';

export default function BackgroundScene() {
  return (
    <div className="fixed inset-0 top-0 left-0 w-screen h-screen -z-10">
      <Canvas
        camera={{ position: [0, 0, 20], fov: 60 }}
        style={{ width: '100%', height: '100%', background: '#000000' }}
      >
        <StarfieldParticles count={220} />
      </Canvas>
    </div>
  );
}
