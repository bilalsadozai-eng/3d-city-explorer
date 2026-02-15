import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { Station } from '@/types';

interface StationMarkerProps {
  station: Station;
  isActive?: boolean;
  onClick?: () => void;
  onHover?: (hovered: boolean) => void;
}

export function StationMarker({ station, isActive = false, onClick, onHover }: StationMarkerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const cylinderRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const { x, y, z } = station.coordinates;

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle bobbing animation
      groupRef.current.position.y = y + Math.sin(state.clock.elapsedTime * 1.5 + x) * 0.08;
    }
    if (cylinderRef.current) {
      // Slow rotation
      cylinderRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
    if (ringRef.current) {
      // Pulsing ring
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      ringRef.current.scale.setScalar(scale);
    }
  });

  const handlePointerOver = () => {
    setHovered(true);
    onHover?.(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHovered(false);
    onHover?.(false);
    document.body.style.cursor = 'auto';
  };

  return (
    <group
      ref={groupRef}
      position={[x, y, z]}
      onClick={onClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Main glass cylinder */}
      <mesh ref={cylinderRef} position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 1.2, 16]} />
        <meshPhysicalMaterial
          color="#C8E5FF"
          transmission={0.9}
          thickness={0.6}
          roughness={0.1}
          ior={1.5}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Emissive core */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 1.25, 16]} />
        <meshStandardMaterial
          color="#2EE9FF"
          emissive="#2EE9FF"
          emissiveIntensity={isActive || hovered ? 2 : 1}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Metal rings */}
      <mesh position={[0, 0.2, 0]}>
        <torusGeometry args={[0.38, 0.03, 8, 32]} />
        <meshStandardMaterial color="#7D879C" metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.0, 0]}>
        <torusGeometry args={[0.38, 0.03, 8, 32]} />
        <meshStandardMaterial color="#7D879C" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Pulsing glow ring */}
      <mesh ref={ringRef} position={[0, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.55, 32]} />
        <meshBasicMaterial
          color="#2EE9FF"
          transparent
          opacity={isActive || hovered ? 0.5 : 0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Station label */}
      {(isActive || hovered) && (
        <Html position={[0, 1.8, 0]} center distanceFactor={8}>
          <div className="glass-panel px-3 py-2 rounded-lg whitespace-nowrap">
            <p className="text-metro-cyan font-mono text-xs uppercase tracking-wider">
              {station.name}
            </p>
          </div>
        </Html>
      )}

      {/* Platform hint */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.5, 1.5]} />
        <meshBasicMaterial
          color="#2EE9FF"
          transparent
          opacity={0.1}
        />
      </mesh>
    </group>
  );
}
