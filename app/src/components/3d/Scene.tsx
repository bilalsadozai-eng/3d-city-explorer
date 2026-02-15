import { useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { MetroLine } from './MetroLine';
import { StationMarker } from './StationMarker';
import { CityBlocks } from './CityBlocks';
import { Particles } from './Particles';
import { MetroBus } from './MetroBus';
import { stations } from '@/data/metroData';
import type { Station } from '@/types';

interface SceneProps {
  cameraProgress?: number;
  activeStation?: string | null;
  onStationClick?: (station: Station) => void;
  onStationHover?: (station: Station | null) => void;
  busProgress?: number;
  isBusMoving?: boolean;
}

export function Scene({
  cameraProgress = 0,
  activeStation = null,
  onStationClick,
  onStationHover,
  busProgress = 0,
  isBusMoving = false,
}: SceneProps) {
  const { camera } = useThree();

  // Create the metro route curve
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-18, -1, -3),
      new THREE.Vector3(-15, 0, 0),
      new THREE.Vector3(-12, 0.5, 2),
      new THREE.Vector3(-10, 0, 2),
      new THREE.Vector3(-8, -0.5, 0),
      new THREE.Vector3(-5, 0, -1),
      new THREE.Vector3(-2, 0.5, 1),
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(3, -0.5, -1),
      new THREE.Vector3(6, 0, -2),
      new THREE.Vector3(8, 0, -2),
      new THREE.Vector3(10, 0.5, -1),
      new THREE.Vector3(12, 0, 0),
      new THREE.Vector3(14, 0, 0.5),
      new THREE.Vector3(16, 0, 1),
      new THREE.Vector3(18, -1, 2),
    ]);
  }, []);

  // Camera animation based on progress
  useFrame(() => {
    if (camera) {
      // Calculate camera position along the curve
      const point = curve.getPoint(cameraProgress);
      const tangent = curve.getTangent(cameraProgress);

      // Camera offset for cinematic view
      const offset = new THREE.Vector3(0, 3, 8);
      const cameraPosition = point.clone().add(offset);

      // Smooth camera movement
      camera.position.lerp(cameraPosition, 0.05);

      // Look ahead along the curve
      const lookAtPoint = point.clone().add(tangent.multiplyScalar(5));
      camera.lookAt(lookAtPoint);
    }
  });

  return (
    <>
      {/* Fog for depth */}
      <fog attach="fog" args={['#050B14', 10, 50]} />

      {/* Ambient lighting */}
      <ambientLight intensity={0.3} color="#1a1a2e" />

      {/* Main directional light */}
      <directionalLight
        position={[10, 20, 10]}
        intensity={0.5}
        color="#C8E5FF"
        castShadow
      />

      {/* Cyan accent lights */}
      <pointLight position={[-10, 5, 5]} intensity={0.8} color="#2EE9FF" distance={20} />
      <pointLight position={[5, 5, -5]} intensity={0.6} color="#2EE9FF" distance={15} />
      <pointLight position={[15, 5, 5]} intensity={0.8} color="#2EE9FF" distance={20} />

      {/* Metro line */}
      <MetroLine curve={curve} />

      {/* Station markers */}
      {stations.map((station) => (
        <StationMarker
          key={station.id}
          station={station}
          isActive={activeStation === station.id}
          onClick={() => onStationClick?.(station)}
          onHover={(hovered) => onStationHover?.(hovered ? station : null)}
        />
      ))}

      {/* Metro bus */}
      <MetroBus
        curve={curve}
        progress={busProgress}
        isMoving={isBusMoving}
        speed={0.0003}
      />

      {/* City blocks background */}
      <CityBlocks count={60} />

      {/* Atmospheric particles */}
      <Particles count={150} color="#2EE9FF" />
      <Particles count={80} color="#FFFFFF" />

      {/* Ground plane */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial
          color="#050B14"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Grid helper for futuristic look */}
      <gridHelper
        args={[100, 50, '#2EE9FF', '#0B1628']}
        position={[0, -1.9, 0]}
      />
    </>
  );
}
