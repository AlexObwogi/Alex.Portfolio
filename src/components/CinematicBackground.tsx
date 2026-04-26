import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Float } from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';
import * as THREE from 'three';

function Starfield({ isDark }: { isDark: boolean }) {
  const points = useRef<THREE.Points>(null!);
  const count = 2000;
  const colorHex = isDark ? "#25f4ee" : "#1a1a1a";
  
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const color = new THREE.Color(colorHex);
    
    for (let i = 0; i < count; i++) {
       // Spiral or sparse formation
       const radius = Math.random() * 25 + 5;
       const theta = Math.random() * Math.PI * 2;
       const phi = Math.random() * Math.PI;

       pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
       pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
       pos[i * 3 + 2] = radius * Math.cos(phi);
       
       cols[i * 3] = color.r;
       cols[i * 3 + 1] = color.g;
       cols[i * 3 + 2] = color.b;
    }
    return [pos, cols];
  }, [colorHex]);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y += 0.0003;
      points.current.rotation.x += 0.0001;
      
      const targetX = state.mouse.x * 0.1;
      const targetY = state.mouse.y * 0.1;
      points.current.position.x += (targetX - points.current.position.x) * 0.02;
      points.current.position.y += (targetY - points.current.position.y) * 0.02;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.04} 
        vertexColors 
        transparent 
        opacity={isDark ? 0.4 : 0.1} 
        sizeAttenuation 
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function ShatterFragment({ position, rotation, scale, color, isDark }: any) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [exploded, setExploded] = useState(false);
  const initialPos = useMemo(() => new THREE.Vector3(...position), [position]);
  const drift = useMemo(() => new THREE.Vector3(
    (Math.random() - 0.5) * 0.02,
    (Math.random() - 0.5) * 0.02,
    (Math.random() - 0.5) * 0.02
  ), []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.z += 0.003;
      
      // Reaction to mouse "explosion"
      const dist = state.mouse.distanceTo(new THREE.Vector2(0, 0));
      if (dist < 0.2 && !exploded) {
        setExploded(true);
      }

      if (exploded) {
         meshRef.current.position.addScaledVector(drift, 2);
         if (meshRef.current.position.distanceTo(initialPos) > 10) {
           setExploded(false);
           meshRef.current.position.copy(initialPos);
         }
      } else {
        meshRef.current.position.add(drift);
        if (meshRef.current.position.distanceTo(initialPos) > 1) {
          drift.negate();
        }
      }
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
      <icosahedronGeometry args={[1, 0]} />
      <meshPhysicalMaterial 
        color={color}
        transparent
        opacity={0.2}
        metalness={0.9}
        roughness={0.05}
        transmission={0.8}
        thickness={2}
        envMapIntensity={1}
      />
    </mesh>
  );
}

function ShatterField({ isDark }: { isDark: boolean }) {
  const shards = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15
      ] as [number, number, number],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number],
      scale: Math.random() * 0.4 + 0.1,
      color: isDark ? "#25f4ee" : "#222222"
    }));
  }, [isDark]);

  return (
    <group>
      {shards.map((s, i) => <ShatterFragment key={i} {...s} isDark={isDark} />)}
    </group>
  );
}

export default function CinematicBackground({ isDark }: { isDark: boolean }) {
  const [ripple, setRipple] = useState(false);

  useEffect(() => {
    setRipple(true);
    const timer = setTimeout(() => setRipple(false), 800);
    return () => clearTimeout(timer);
  }, [isDark]);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none transition-colors duration-1000 overflow-hidden" 
         style={{ backgroundColor: isDark ? '#121212' : '#f5f5f2' }}>
      
      {/* Light Mode Mesh Gradient */}
      {!isDark && (
        <div className="absolute inset-0 opacity-40 mix-blend-overlay">
          <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-[#d9d4cc] rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-14%] w-[70%] h-[70%] bg-[#cfc9bf] rounded-full blur-[120px] animation-delay-2000 animate-pulse" />
        </div>
      )}

      {/* Ripple Transition */}
      <AnimatePresence>
        {ripple && (
          <motion.div 
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vmax] h-[100vmax] rounded-full border-[20px] border-tiktok-cyan/20 z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="absolute inset-0 backdrop-blur-[8px] opacity-[0.85] z-10" />
      
      <div className="absolute inset-0 opacity-20 dark:opacity-10 mix-blend-overlay pointer-events-none z-20"
           style={{ background: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }} />

      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 18]} />
        <ambientLight intensity={isDark ? 0.3 : 1} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color={isDark ? "#25f4ee" : "#ffffff"} />
        
        <Starfield isDark={isDark} />
        <ShatterField isDark={isDark} />
      </Canvas>
    </div>
  );
}
