import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Float } from '@react-three/drei';
import * as THREE from 'three';

function Starfield({ isDark }: { isDark: boolean }) {
  const points = useRef<THREE.Points>(null!);
  const count = 1500;
  
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const color = new THREE.Color(isDark ? "#25f4ee" : "#1a1a1a");
    
    for (let i = 0; i < count; i++) {
       pos[i * 3] = (Math.random() - 0.5) * 50;
       pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
       pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
       
       cols[i * 3] = color.r;
       cols[i * 3 + 1] = color.g;
       cols[i * 3 + 2] = color.b;
    }
    return [pos, cols];
  }, [isDark]);

  useFrame((state) => {
    points.current.rotation.y += 0.0005;
    points.current.rotation.x += 0.0002;
    
    // Mouse interaction
    const targetX = state.mouse.x * 0.2;
    const targetY = state.mouse.y * 0.2;
    points.current.position.x += (targetX - points.current.position.x) * 0.05;
    points.current.position.y += (targetY - points.current.position.y) * 0.05;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.05} 
        vertexColors 
        transparent 
        opacity={0.2} 
        sizeAttenuation 
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Shard({ position, rotation, scale, color }: { position: [number, number, number], rotation: [number, number, number], scale: number, color: string }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const initialPos = useRef(new THREE.Vector3(...position));
  const velocity = useMemo(() => new THREE.Vector3((Math.random() - 0.5) * 0.01, (Math.random() - 0.5) * 0.01, (Math.random() - 0.5) * 0.01), []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.add(velocity);
      meshRef.current.rotation.x += 0.001;
      meshRef.current.rotation.y += 0.002;
      
      // If exploded too far, reset subtly (or just keep floating)
      if (meshRef.current.position.distanceTo(initialPos.current) > 5) {
        meshRef.current.position.copy(initialPos.current);
      }
    }
  });

  return (
     <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
        <icosahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial 
          color={color}
          transparent
          opacity={0.15}
          metalness={0.9}
          roughness={0.1}
          transmission={0.5}
          thickness={1}
        />
     </mesh>
  );
}

function ShatterField({ isDark }: { isDark: boolean }) {
  const shards = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      position: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20] as [number, number, number],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number],
      scale: Math.random() * 0.5 + 0.2,
      color: isDark ? "#25f4ee" : "#1a1a1a"
    }));
  }, [isDark]);

  return (
    <group>
      {shards.map((shard, i) => (
        <Shard key={i} {...shard} />
      ))}
    </group>
  );
}

function Atmosphere({ isDark }: { isDark: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.001;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} scale={10} position={[0,0,-5]}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial 
          transparent 
          opacity={0.1}
          color={isDark ? "#0a0a0a" : "#f5f5f0"}
          side={THREE.DoubleSide}
        />
      </mesh>
    </Float>
  );
}

export default function CinematicBackground({ isDark }: { isDark: boolean }) {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none transition-colors duration-1000" style={{ backgroundColor: isDark ? '#121212' : '#f5f5f4' }}>
      {/* Mesh Gradient Effect for Light Mode */}
      {!isDark && (
        <div className="absolute inset-0 opacity-20" style={{ 
          background: 'radial-gradient(circle at 20% 30%, #e5e5e0 0%, transparent 50%), radial-gradient(circle at 80% 70%, #dcdcdc 0%, transparent 50%)',
          filter: 'blur(80px)' 
        }} />
      )}
      
      <div className="absolute inset-0 backdrop-blur-[8px]" />
      
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 15]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color={isDark ? "#25f4ee" : "#fff"} />
        
        <Starfield isDark={isDark} />
        <ShatterField isDark={isDark} />
        <Atmosphere isDark={isDark} />
      </Canvas>
    </div>
  );
}
