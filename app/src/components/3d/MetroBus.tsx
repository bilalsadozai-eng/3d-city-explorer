import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MetroBusProps {
  curve: THREE.CatmullRomCurve3;
  progress?: number;
  isMoving?: boolean;
  speed?: number;
}

export function MetroBus({ curve, progress = 0, isMoving = false, speed = 0.0005 }: MetroBusProps) {
  const busRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const currentProgress = useRef(progress);

  const busCurve = useMemo(() => curve, [curve]);

  useFrame((_, delta) => {
    if (isMoving && busRef.current) {
      currentProgress.current += speed * delta * 60;
      if (currentProgress.current > 1) currentProgress.current = 0;

      const point = busCurve.getPoint(currentProgress.current);
      const tangent = busCurve.getTangent(currentProgress.current);

      busRef.current.position.copy(point);
      busRef.current.position.y += 0.3;
      busRef.current.lookAt(point.clone().add(tangent));
    } else if (busRef.current) {
      // Set to specified progress position
      const point = busCurve.getPoint(progress);
      const tangent = busCurve.getTangent(progress);
      busRef.current.position.copy(point);
      busRef.current.position.y += 0.3;
      busRef.current.lookAt(point.clone().add(tangent));
    }

    // Animate glow
    if (glowRef.current) {
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.3 + Math.sin(Date.now() * 0.003) * 0.1;
    }
  });

  return (
    <group ref={busRef}>
      {/* Bus body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.8, 0.4, 2]} />
        <meshStandardMaterial
          color="#FFFFFF"
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Bus roof */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.7, 0.1, 1.8]} />
        <meshStandardMaterial
          color="#2EE9FF"
          emissive="#2EE9FF"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Front windshield */}
      <mesh position={[0, 0.05, 1.01]}>
        <planeGeometry args={[0.6, 0.25]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Side windows */}
      <mesh position={[0.41, 0.05, 0]}>
        <planeGeometry args={[1.6, 0.2]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      <mesh position={[-0.41, 0.05, 0]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1.6, 0.2]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Headlights */}
      <mesh position={[-0.25, -0.1, 1.01]}>
        <circleGeometry args={[0.08, 16]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0.25, -0.1, 1.01]}>
        <circleGeometry args={[0.08, 16]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>

      {/* Taillights */}
      <mesh position={[-0.25, -0.1, -1.01]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[0.06, 16]} />
        <meshBasicMaterial color="#FF3333" />
      </mesh>
      <mesh position={[0.25, -0.1, -1.01]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[0.06, 16]} />
        <meshBasicMaterial color="#FF3333" />
      </mesh>

      {/* Glow effect */}
      <mesh ref={glowRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial
          color="#2EE9FF"
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Wheels */}
      <group position={[-0.35, -0.25, 0.6]} rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[0.12, 0.12, 0.1, 16]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      </group>
      <group position={[0.35, -0.25, 0.6]} rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[0.12, 0.12, 0.1, 16]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      </group>
      <group position={[-0.35, -0.25, -0.6]} rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[0.12, 0.12, 0.1, 16]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      </group>
      <group position={[0.35, -0.25, -0.6]} rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[0.12, 0.12, 0.1, 16]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      </group>
    </group>
  );
}
