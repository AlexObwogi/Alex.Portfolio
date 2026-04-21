import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function Gear({ position, radius, teeth, speed, direction }: {
  position: [number, number, number],
  radius: number,
  teeth: number,
  speed: number,
  direction: number
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  const gearGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const toothDepth = 0.2;
    const toothAngle = (Math.PI * 2) / teeth;
    
    for (let i = 0; i < teeth; i++) {
      const angle = i * toothAngle;
      const nextAngle = (i + 1) * toothAngle;
      
      const rOuter = radius + toothDepth;
      const rInner = radius;
      
      shape.lineTo(Math.cos(angle) * rInner, Math.sin(angle) * rInner);
      shape.lineTo(Math.cos(angle + toothAngle * 0.2) * rOuter, Math.sin(angle + toothAngle * 0.2) * rOuter);
      shape.lineTo(Math.cos(angle + toothAngle * 0.8) * rOuter, Math.sin(angle + toothAngle * 0.8) * rOuter);
      shape.lineTo(Math.cos(nextAngle) * rInner, Math.sin(nextAngle) * rInner);
    }
    
    return new THREE.ExtrudeGeometry(shape, { depth: 0.5, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1 });
  }, [radius, teeth]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += speed * direction;
      // Mouse parallax
      const mouseX = state.mouse.x * 0.5;
      const mouseY = state.mouse.y * 0.5;
      meshRef.current.position.x = position[0] + mouseX;
      meshRef.current.position.y = position[1] + mouseY;
    }
  });

  return (
    <mesh ref={meshRef} position={position} geometry={gearGeometry} rotation={[Math.PI / 2, 0, 0]}>
      <MeshDistortMaterial 
        speed={1} 
        distort={0.1} 
        transparent 
        opacity={0.2}
        color="#ffffff"
        metalness={1}
        roughness={0}
      />
    </mesh>
  );
}

function GearScene({ isDark }: { isDark: boolean }) {
  return (
    <>
      <ambientLight intensity={isDark ? 0.3 : 1} />
      <pointLight position={[10, 10, 10]} intensity={3} />
      <pointLight position={[-10, -10, -10]} intensity={1.5} color="#00ffff" />
      
      <Gear 
        position={[-4, 1, -8]} 
        radius={3} 
        teeth={12} 
        speed={0.005} 
        direction={1} 
      />
      <Gear 
        position={[2, 3, -10]} 
        radius={2} 
        teeth={10} 
        speed={0.007} 
        direction={-1} 
      />
      <Gear 
        position={[5, -2, -12]} 
        radius={4} 
        teeth={16} 
        speed={0.004} 
        direction={1} 
      />
    </>
  );
}

export default function ThreeGears({ isDark }: { isDark: boolean }) {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none bg-transparent">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        <GearScene isDark={isDark} />
      </Canvas>
    </div>
  );
}
