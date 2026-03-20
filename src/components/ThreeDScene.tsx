import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Instances, Instance, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface ThreeDSceneProps {
  text: string;
  animation: string;
  themeAccent: string;
  onComplete: () => void;
}

const THEME_COLORS: Record<string, string[]> = {
  purple: ['#a855f7', '#d8b4fe', '#ffffff'],
  blue: ['#3b82f6', '#93c5fd', '#ffffff'],
  red: ['#ef4444', '#fca5a5', '#ffffff'],
  slate: ['#64748b', '#cbd5e1', '#ffffff'],
  zinc: ['#71717a', '#d4d4d8', '#ffffff'],
  amber: ['#f59e0b', '#fcd34d', '#ffffff'],
};

// A single particle instance
const Particle = ({ position, velocity, color, scale, rotation, angularVelocity, life, type }: any) => {
  const ref = useRef<any>(null);
  
  useFrame((state, delta) => {
    if (!ref.current) return;
    
    // Update position
    ref.current.position.x += velocity.x * delta;
    ref.current.position.y += velocity.y * delta;
    ref.current.position.z += velocity.z * delta;
    
    // Apply gravity or forces based on type
    if (type === 'shatter' || type === 'goldenRain' || type === 'bloodMoon') {
      velocity.y -= 9.8 * delta * 0.5; // Gravity
    } else if (type === 'ascend' || type === 'ascendLight') {
      velocity.y += 5 * delta; // Anti-gravity
    } else if (type === 'blackhole') {
      // Pull towards center (0,0,-5)
      const dir = new THREE.Vector3(0, 0, -5).sub(ref.current.position);
      const dist = dir.length();
      dir.normalize().multiplyScalar(20 / (dist + 1));
      velocity.x += dir.x * delta;
      velocity.y += dir.y * delta;
      velocity.z += dir.z * delta;
    }
    
    // Update rotation
    ref.current.rotation.x += angularVelocity.x * delta;
    ref.current.rotation.y += angularVelocity.y * delta;
    ref.current.rotation.z += angularVelocity.z * delta;
    
    // Update scale (shrink over time)
    const shrinkRate = type === 'blackhole' ? 2 : 0.5;
    const currentScale = ref.current.scale.x;
    if (currentScale > 0) {
      const newScale = Math.max(0, currentScale - shrinkRate * delta);
      ref.current.scale.set(newScale, newScale, newScale);
    }
  });

  return (
    <Instance
      ref={ref}
      position={position}
      rotation={rotation}
      scale={scale}
      color={color}
    />
  );
};

const ParticleSystem = ({ animation, themeAccent }: { animation: string, themeAccent: string }) => {
  const colors = THEME_COLORS[themeAccent] || THEME_COLORS.zinc;
  
  const particles = useMemo(() => {
    const count = animation === 'supernovaPro' || animation === 'blackhole' ? 400 : 200;
    const temp = [];
    for (let i = 0; i < count; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      let pos = new THREE.Vector3((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 5);
      let vel = new THREE.Vector3((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
      
      if (animation === 'shatter' || animation === 'shatterGlass') {
        pos.set((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 2, 0);
        vel.set((Math.random() - 0.5) * 15, Math.random() * 15, (Math.random() - 0.5) * 15);
      } else if (animation === 'implode' || animation === 'voidCollapse') {
        pos.set((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20);
        vel = pos.clone().negate().multiplyScalar(0.5);
      } else if (animation === 'blackhole') {
        pos.set((Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 10);
        vel.set((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5);
      } else if (animation === 'goldenRain') {
        pos.set((Math.random() - 0.5) * 20, 10 + Math.random() * 10, (Math.random() - 0.5) * 10);
        vel.set((Math.random() - 0.5) * 2, -10 - Math.random() * 10, (Math.random() - 0.5) * 2);
      } else if (animation === 'supernova' || animation === 'supernovaPro') {
        pos.set(0, 0, 0);
        vel.set((Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30);
      }

      temp.push({
        position: pos,
        velocity: vel,
        color: new THREE.Color(color),
        scale: Math.random() * 0.2 + 0.05,
        rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
        angularVelocity: new THREE.Euler((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10),
        life: 1.0
      });
    }
    return temp;
  }, [animation, colors]);

  // Choose geometry based on animation
  const isBox = animation === 'shatter' || animation === 'matrix' || animation === 'glitch' || animation === 'shatterGlass';

  return (
    <Instances limit={particles.length}>
      {isBox ? <boxGeometry args={[1, 1, 1]} /> : <tetrahedronGeometry args={[1, 0]} />}
      <meshStandardMaterial roughness={0.2} metalness={0.8} />
      {particles.map((p, i) => (
        <Particle key={i} {...p} type={animation} />
      ))}
    </Instances>
  );
};

const Letter = ({ char, position, animation, delay }: { char: string, position: [number, number, number], animation: string, delay: number }) => {
  const meshRef = useRef<any>(null);
  const [time, setTime] = useState(0);
  
  // Initial random velocities for explosion
  const velocity = useMemo(() => new THREE.Vector3((Math.random() - 0.5) * 15, Math.random() * 15, (Math.random() - 0.5) * 15), []);
  const rotationVel = useMemo(() => new THREE.Vector3((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10), []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    setTime(t => t + delta);
    
    // Wait for delay before animating
    if (time < delay) return;
    
    const activeTime = time - delay;
    const mesh = meshRef.current;

    if (animation === 'shatter' || animation === 'shatterGlass' || animation === 'fracture') {
      mesh.position.x += velocity.x * delta;
      mesh.position.y += velocity.y * delta - (9.8 * activeTime * delta); // Gravity
      mesh.position.z += velocity.z * delta;
      mesh.rotation.x += rotationVel.x * delta;
      mesh.rotation.y += rotationVel.y * delta;
    } else if (animation === 'blackhole' || animation === 'implode' || animation === 'voidCollapse') {
      const dir = new THREE.Vector3(0, 0, -10).sub(mesh.position);
      mesh.position.add(dir.multiplyScalar(delta * 3));
      mesh.scale.multiplyScalar(1 - delta * 2);
      mesh.rotation.z += delta * 10;
    } else if (animation === 'ascend' || animation === 'ascendLight') {
      mesh.position.y += delta * 8;
      mesh.position.z -= delta * 4;
      mesh.material.opacity = Math.max(0, 1 - activeTime * 0.5);
    } else if (animation === 'dissolve' || animation === 'fadeAway' || animation === 'mist') {
      mesh.position.y += delta * 1;
      mesh.scale.multiplyScalar(1 - delta * 0.5);
      mesh.material.opacity = Math.max(0, 1 - activeTime * 0.5);
    } else if (animation === 'supernova' || animation === 'supernovaPro' || animation === 'burst') {
      const dir = mesh.position.clone().normalize();
      mesh.position.add(dir.multiplyScalar(delta * 20));
      mesh.scale.multiplyScalar(1 + delta * 3);
      mesh.material.opacity = Math.max(0, 1 - activeTime);
    } else {
      // Default fallaway
      mesh.position.y -= delta * 10;
      mesh.rotation.x += delta * 5;
      mesh.material.opacity = Math.max(0, 1 - activeTime);
    }
  });

  return (
    <Text
      ref={meshRef}
      position={position}
      fontSize={0.8}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
      font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"
    >
      {char}
      <meshStandardMaterial color="#ffffff" transparent opacity={1} roughness={0.2} metalness={0.8} />
    </Text>
  );
};

const AnimatedText = ({ text, animation, onComplete }: { text: string, animation: string, onComplete: () => void }) => {
  const [time, setTime] = useState(0);
  
  useFrame((state, delta) => {
    setTime(t => {
      const newTime = t + delta;
      if (t <= 2.5 && newTime > 2.5) {
        onComplete();
      }
      return newTime;
    });
  });

  // Split text into words and characters for layout
  const words = text.split(' ');
  let charIndex = 0;
  
  return (
    <group position={[0, 0, 0]}>
      {words.map((word, wIdx) => {
        // Simple layout: wrap text roughly
        const xOffset = (wIdx % 5) * 3 - 6;
        const yOffset = -Math.floor(wIdx / 5) * 1.5 + 2;
        
        return word.split('').map((char, cIdx) => {
          const delay = (animation === 'shatter' || animation === 'fracture') ? charIndex++ * 0.02 : 0;
          return (
            <Letter
              key={`${wIdx}-${cIdx}`}
              char={char}
              position={[xOffset + cIdx * 0.6 - (word.length * 0.3), yOffset, 0]}
              animation={animation}
              delay={delay}
            />
          );
        });
      })}
    </group>
  );
};

export const ThreeDScene: React.FC<ThreeDSceneProps> = ({ text, animation, themeAccent, onComplete }) => {
  return (
    <div className="absolute inset-0 z-50 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color={THEME_COLORS[themeAccent]?.[0] || '#ffffff'} />
        
        {animation && (
          <>
            <AnimatedText text={text} animation={animation} onComplete={onComplete} />
            <ParticleSystem animation={animation} themeAccent={themeAccent} />
          </>
        )}
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default ThreeDScene;
