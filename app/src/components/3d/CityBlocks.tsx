import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CityBlocksProps {
  count?: number;
}

export function CityBlocks({ count = 80 }: CityBlocksProps) {
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const windowLightsRef = useRef<THREE.InstancedMesh>(null);

  // Generate random building positions
  const { positions, scales, rotations } = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    const scales: THREE.Vector3[] = [];
    const rotations: THREE.Euler[] = [];

    for (let i = 0; i < count; i++) {
      // Distribute buildings along the metro route
      const t = i / count;
      const x = -20 + t * 45 + (Math.random() - 0.5) * 15;
      const z = (Math.random() - 0.5) * 20;
      const y = Math.random() * 2 - 2;

      // Keep buildings away from the metro line center
      if (Math.abs(z) < 3) continue;

      positions.push(new THREE.Vector3(x, y, z));
      scales.push(new THREE.Vector3(
        1 + Math.random() * 2,
        2 + Math.random() * 6,
        1 + Math.random() * 2
      ));
      rotations.push(new THREE.Euler(0, Math.random() * Math.PI, 0));
    }

    return { positions, scales, rotations };
  }, [count]);

  // Set up instanced mesh
  useMemo(() => {
    if (instancedMeshRef.current) {
      const dummy = new THREE.Object3D();
      positions.forEach((pos, i) => {
        dummy.position.copy(pos);
        dummy.scale.copy(scales[i]);
        dummy.rotation.copy(rotations[i]);
        dummy.updateMatrix();
        instancedMeshRef.current!.setMatrixAt(i, dummy.matrix);
      });
      instancedMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [positions, scales, rotations]);

  useFrame((state) => {
    // Subtle movement of window lights
    if (windowLightsRef.current) {
      const material = windowLightsRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group>
      {/* Main building blocks */}
      <instancedMesh
        ref={instancedMeshRef}
        args={[undefined, undefined, positions.length]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#2A2E38"
          roughness={0.8}
          metalness={0.2}
        />
      </instancedMesh>

      {/* Window lights (smaller blocks on building faces) */}
      <instancedMesh
        ref={windowLightsRef}
        args={[undefined, undefined, positions.length * 2]}
      >
        <boxGeometry args={[0.15, 0.15, 0.05]} />
        <meshBasicMaterial
          color="#FF6A3D"
          transparent
          opacity={0.3}
        />
      </instancedMesh>
    </group>
  );
}
