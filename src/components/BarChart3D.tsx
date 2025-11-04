'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
// @ts-ignore
import * as THREE from 'three';

interface BarData {
  name: string;
  value: number;
  color: string;
}

interface BarChart3DProps {
  data: BarData[];
  width?: number;
  height?: number;
}

function Bar({
  position,
  height,
  color,
  label,
}: {
  position: [number, number, number];
  height: number;
  color: string;
  label: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <group position={position}>
      <mesh ref={meshRef} position={[0, height / 2, 0]}>
        <boxGeometry args={[0.8, height, 0.8]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
      </mesh>
      <Text
        position={[0, -0.3, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
      <Text
        position={[0, height + 0.3, 0]}
        fontSize={0.25}
        color="#5b8def"
        anchorX="center"
        anchorY="middle"
      >
        {Math.round(height * 10)}
      </Text>
    </group>
  );
}

function BarChart3DScene({ data }: { data: BarData[] }) {
  const groupRef = useRef<THREE.Group>(null);

  // 自动旋转
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003;
    }
  });

  const maxValue = Math.max(...data.map((item) => item.value));
  const spacing = 1.5;

  return (
    <group ref={groupRef}>
      {data.map((item, index) => {
        const normalizedHeight = (item.value / maxValue) * 3;
        const xPosition = (index - (data.length - 1) / 2) * spacing;

        return (
          <Bar
            key={index}
            position={[xPosition, 0, 0]}
            height={normalizedHeight}
            color={item.color}
            label={item.name}
          />
        );
      })}
    </group>
  );
}

export default function BarChart3D({ data, width = 400, height = 400 }: BarChart3DProps) {
  return (
    <div style={{ width, height }}>
      <Canvas camera={{ position: [5, 3, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        <BarChart3DScene data={data} />
        <OrbitControls enableZoom={true} enablePan={false} />
      </Canvas>
    </div>
  );
}

