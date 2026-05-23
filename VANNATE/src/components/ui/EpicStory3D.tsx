"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

function GoldenGlobe() {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate 8,000 particles on the surface of a sphere
  const particlesPosition = useMemo(() => {
    const numParticles = 8000;
    const positions = new Float32Array(numParticles * 3);
    const radius = 2.5;

    for (let i = 0; i < numParticles; i++) {
      // Golden ratio Fibonacci sphere distribution
      const phi = Math.acos(1 - (2 * i) / numParticles);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      // Slow majestic rotation
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.02;
      
      // Breathing scale effect (subtle pulsing of the globe)
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
      pointsRef.current.scale.set(scale, scale, scale);
    }
    
    // Spatial Mouse Parallax
    const targetX = (state.pointer.x * Math.PI) / 10;
    const targetY = (state.pointer.y * Math.PI) / 10;
    
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.02);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.02);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 3.5 + (state.pointer.y * 0.5), 0.01);
    
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
          args={[particlesPosition, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#ffaa00"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function EpicStory3D() {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0, background: "#050505" }}>
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <GoldenGlobe />
      </Canvas>
      {/* Radial gradient overlay to blend edges */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(circle at center, transparent 10%, rgba(5,5,5,0.8) 70%, #050505 100%)"
      }} />
    </div>
  );
}
