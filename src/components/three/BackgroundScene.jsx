import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { FloatingParticles } from './Particles';

export default function BackgroundScene() {
  return (
    <div className="fixed inset-0 top-0 left-0 w-screen h-screen -z-10">
      <Canvas
        camera={{ position: [0, 0, 25], fov: 75 }}
        style={{ width: '100%', height: '100%', background: '#000000' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <FloatingParticles count={250} />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.3}
          maxPolarAngle={Math.PI}
          minPolarAngle={0}
        />
      </Canvas>
    </div>
  );
}
