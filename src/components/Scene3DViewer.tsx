import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, PresentationControls, Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function RotatingScene({ color = "#d4940a" }: { color?: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} scale={1.8}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color={color}
          roughness={0.2}
          metalness={0.8}
          distort={0.3}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

function GroundPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#111118" roughness={0.9} metalness={0.1} />
    </mesh>
  );
}

interface Scene3DViewerProps {
  className?: string;
  accentColor?: string;
}

const Scene3DViewer = ({ className = "", accentColor = "#d4940a" }: Scene3DViewerProps) => {
  return (
    <div
      className={`relative w-full aspect-square md:aspect-[4/3] rounded-xl overflow-hidden border border-border bg-background protected-content ${className}`}
      data-protected="true"
      onContextMenu={(e) => e.preventDefault()}
    >
      <Canvas
        camera={{ position: [0, 1, 5], fov: 45 }}
        shadows
        gl={{
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: false, // Prevents canvas export
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
          <pointLight position={[-3, 2, -3]} intensity={0.5} color={accentColor} />
          <PresentationControls
            global
            zoom={0.8}
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI / 4, Math.PI / 4]}
          >
            <RotatingScene color={accentColor} />
          </PresentationControls>
          <GroundPlane />
          <Environment preset="night" />
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            minDistance={3}
            maxDistance={10}
          />
        </Suspense>
      </Canvas>
      {/* Watermark overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none flex items-end justify-end p-3">
        <span className="text-foreground/[0.08] font-display text-xs tracking-widest select-none">ENV.ART</span>
      </div>
      <div className="absolute bottom-3 left-3 z-20 bg-background/80 backdrop-blur-sm text-muted-foreground text-xs font-body px-3 py-1.5 rounded-lg border border-border">
        Drag to rotate · Scroll to zoom
      </div>
    </div>
  );
};

export default Scene3DViewer;
