import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Float } from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';
import * as THREE from 'three';

function Starfield({ isDark }: { isDark: boolean }) {
  const points = useRef<THREE.Points>(null!);
  const count = 2000;
  const colorHex = isDark ? "#25f4ee" : "#1a1a1a";
  
  const [positions, colors, initialPositions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const initial = new Float32Array(count * 3);
    const color = new THREE.Color(colorHex);
    
    for (let i = 0; i < count; i++) {
       const radius = Math.random() * 25 + 5;
       const theta = Math.random() * Math.PI * 2;
       const phi = Math.random() * Math.PI;

       pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
       pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
       pos[i * 3 + 2] = radius * Math.cos(phi);
       
       initial[i * 3] = pos[i * 3];
       initial[i * 3 + 1] = pos[i * 3 + 1];
       initial[i * 3 + 2] = pos[i * 3 + 2];

       cols[i * 3] = color.r;
       cols[i * 3 + 1] = color.g;
       cols[i * 3 + 2] = color.b;
    }
    return [pos, cols, initial];
  }, [colorHex]);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y += 0.0003;
      points.current.rotation.x += 0.0001;
      
      const mouse = new THREE.Vector3(state.mouse.x * 15, state.mouse.y * 10, 0);
      const posAttr = points.current.geometry.attributes.position;
      const positionsArray = posAttr.array as Float32Array;

      for (let i = 0; i < count; i++) {
        const ix = initialPositions[i * 3];
        const iy = initialPositions[i * 3 + 1];
        const iz = initialPositions[i * 3 + 2];
        
        const x = positionsArray[i * 3];
        const y = positionsArray[i * 3 + 1];
        const z = positionsArray[i * 3 + 2];

        // Spring back to initial
        positionsArray[i * 3] += (ix - x) * 0.05;
        positionsArray[i * 3 + 1] += (iy - y) * 0.05;
        positionsArray[i * 3 + 2] += (iz - z) * 0.05;

        // Mouse repulsion
        const dx = x - mouse.x;
        const dy = y - mouse.y;
        const dz = z - mouse.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < 5) {
          const force = (5 - dist) / 5;
          positionsArray[i * 3] += dx * force * 0.5;
          positionsArray[i * 3 + 1] += dy * force * 0.5;
          positionsArray[i * 3 + 2] += dz * force * 0.5;
        }
      }
      posAttr.needsUpdate = true;

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

function NeuralNetwork({ isDark }: { isDark: boolean }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const count = 150; // Fewer points for connections
  const colorHex = isDark ? "#25f4ee" : "#222222";
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const radius = 10 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      temp.push({
        position: new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi)
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01
        )
      });
    }
    return temp;
  }, []);

  const linesRef = useRef<THREE.LineSegments>(null!);
  const lineGeometry = useMemo(() => new THREE.BufferGeometry(), []);
  const starPositions = useMemo(() => new Float32Array(count * 3), []);

  useFrame((state) => {
    const positions = [];
    const color = new THREE.Color(colorHex);
    
    particles.forEach((p, i) => {
      p.position.add(p.velocity);
      if (p.position.length() > 35) p.position.setLength(15);
      
      starPositions[i * 3] = p.position.x;
      starPositions[i * 3 + 1] = p.position.y;
      starPositions[i * 3 + 2] = p.position.z;
    });

    if (pointsRef.current) {
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      pointsRef.current.rotation.y += 0.0005;
    }

    // Connections logic
    const connectionPositions = [];
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dist = particles[i].position.distanceTo(particles[j].position);
        if (dist < 4) {
          connectionPositions.push(
            particles[i].position.x, particles[i].position.y, particles[i].position.z,
            particles[j].position.x, particles[j].position.y, particles[j].position.z
          );
        }
      }
    }

    if (linesRef.current) {
      linesRef.current.geometry.setAttribute('position', new THREE.Float32BufferAttribute(connectionPositions, 3));
      linesRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={starPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial 
          size={0.08} 
          color={colorHex}
          transparent 
          opacity={isDark ? 0.6 : 0.2} 
          sizeAttenuation 
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial 
          color={colorHex} 
          transparent 
          opacity={isDark ? 0.15 : 0.05} 
          linewidth={1}
        />
      </lineSegments>
    </group>
  );
}

export default function CinematicBackground({ isDark }: { isDark: boolean }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [ripple, setRipple] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    setRipple(true);
    const timer = setTimeout(() => setRipple(false), 800);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timer);
    };
  }, [isDark]);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none transition-colors duration-1000 overflow-hidden" 
         style={{ backgroundColor: isDark ? '#121212' : '#f5f5f2' }}>
      
      {/* Dynamic Ambient Glow */}
      <div 
        className="absolute inset-0 transition-opacity duration-1000 opacity-40 dark:opacity-20"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, ${isDark ? 'rgba(37, 244, 238, 0.15)' : 'rgba(0, 242, 255, 0.1)'}, transparent 50%)`
        }}
      />
      
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
        
        <NeuralNetwork isDark={isDark} />
        <Starfield isDark={isDark} />
        <ShatterField isDark={isDark} />
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
           <mesh position={[-10, 5, -5]}>
              <sphereGeometry args={[2, 32, 32]} />
              <meshBasicMaterial color={isDark ? "#25f4ee" : "#000000"} wireframe opacity={0.05} transparent />
           </mesh>
        </Float>
      </Canvas>
    </div>
  );
}
