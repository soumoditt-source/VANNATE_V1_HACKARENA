"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, MeshDistortMaterial, Float } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

function Droplet({ onBurst }: { onBurst: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Idle rotation
    meshRef.current.rotation.y += delta * 0.2;
    meshRef.current.rotation.x += delta * 0.1;

    // Scale up slightly on hover
    const targetScale = clicked ? 10 : hovered ? 1.2 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => {
          if (clicked) return;
          setClicked(true);
          // Wait for scale up animation then trigger burst
          setTimeout(onBurst, 800);
        }}
      >
        <sphereGeometry args={[1.5, 64, 64]} />
        <MeshDistortMaterial
          color="#ffffff"
          distort={clicked ? 1.5 : hovered ? 0.6 : 0.3} // More distortion on interaction
          speed={clicked ? 5 : hovered ? 4 : 2}
          roughness={0}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0}
          transmission={1} // Glass-like water effect
          ior={1.33} // Index of refraction for water
          thickness={2}
        />
      </mesh>
    </Float>
  );
}

export default function DropletIntro3D({ onComplete }: { onComplete: () => void }) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", background: "#000" }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
        {/* Environment map for realistic reflections on the water droplet */}
        <Environment preset="city" />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#14b8a6" />
        <pointLight position={[-10, -10, -5]} intensity={1} color="#3b82f6" />
        
        <Droplet onBurst={onComplete} />
      </Canvas>

      {/* Helper Text Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        style={{ 
          position: "absolute", 
          bottom: "15%", 
          left: 0, 
          right: 0, 
          textAlign: "center",
          pointerEvents: "none"
        }}
      >
        <p style={{ 
          color: "rgba(255,255,255,0.6)", 
          fontSize: "1.1rem", 
          letterSpacing: "4px",
          textTransform: "uppercase",
          fontFamily: "var(--font-inter)"
        }}>
          Tap the droplet to begin
        </p>
      </motion.div>
    </div>
  );
}
