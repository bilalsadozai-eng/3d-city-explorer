import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MetroLineProps {
  curve: THREE.CatmullRomCurve3;
  color?: string;
}

export function MetroLine({ curve, color = '#2EE9FF' }: MetroLineProps) {
  const lineRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  // Tube geometry along the curve
  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 128, 0.12, 8, false);
  }, [curve]);

  // Glow geometry (slightly larger)
  const glowGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 64, 0.25, 8, false);
  }, [curve]);

  useFrame((state) => {
    if (lineRef.current) {
      const material = lineRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 1.2 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
    if (glowRef.current) {
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
    }
  });

  return (
    <group>
      {/* Main metro line */}
      <mesh ref={lineRef} geometry={tubeGeometry}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.2}
          metalness={0.8}
          roughness={0.2}
          toneMapped={false}
        />
      </mesh>

      {/* Glow effect */}
      <mesh ref={glowRef} geometry={glowGeometry}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Animated pulse along the line */}
      <PulseEffect curve={curve} color={color} />
    </group>
  );
}

interface PulseEffectProps {
  curve: THREE.CatmullRomCurve3;
  color: string;
}

function PulseEffect({ curve, color }: PulseEffectProps) {
  const pulseRef = useRef<THREE.Mesh>(null);
  const progressRef = useRef(0);

  useFrame((_, delta) => {
    if (pulseRef.current) {
      progressRef.current += delta * 0.15;
      if (progressRef.current > 1) progressRef.current = 0;
      
      const point = curve.getPoint(progressRef.current);
      pulseRef.current.position.copy(point);
      
      const scale = 1 + Math.sin(progressRef.current * Math.PI) * 0.5;
      pulseRef.current.scale.setScalar(scale);
    }
  });

  return (
    <mesh ref={pulseRef}>
      <sphereGeometry args={[0.25, 16, 16]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}
