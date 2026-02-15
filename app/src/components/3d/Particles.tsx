import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticlesProps {
  count?: number;
  color?: string;
}

export function Particles({ count = 200, color = '#2EE9FF' }: ParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const velocitiesRef = useRef<Float32Array>(new Float32Array(count * 3));

  // Generate random particle positions and velocities
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = Math.random() * 15 - 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }

    // Initialize velocities
    for (let i = 0; i < count * 3; i += 3) {
      velocitiesRef.current[i] = (Math.random() - 0.5) * 0.02;
      velocitiesRef.current[i + 1] = Math.random() * 0.03 + 0.01;
      velocitiesRef.current[i + 2] = (Math.random() - 0.5) * 0.02;
    }

    return pos;
  }, [count]);

  useFrame(() => {
    if (pointsRef.current) {
      const positionAttribute = pointsRef.current.geometry.attributes.position;
      const posArray = positionAttribute.array as Float32Array;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        // Update positions based on velocity
        posArray[i3] += velocitiesRef.current[i3];
        posArray[i3 + 1] += velocitiesRef.current[i3 + 1];
        posArray[i3 + 2] += velocitiesRef.current[i3 + 2];

        // Reset particles that go too high
        if (posArray[i3 + 1] > 12) {
          posArray[i3 + 1] = -5;
          posArray[i3] = (Math.random() - 0.5) * 50;
          posArray[i3 + 2] = (Math.random() - 0.5) * 30;
        }

        // Wrap around horizontally
        if (Math.abs(posArray[i3]) > 25) {
          posArray[i3] *= -0.9;
        }
        if (Math.abs(posArray[i3 + 2]) > 15) {
          posArray[i3 + 2] *= -0.9;
        }
      }

      positionAttribute.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
