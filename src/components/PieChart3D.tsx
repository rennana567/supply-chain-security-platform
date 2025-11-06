'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
// @ts-ignore
import * as THREE from 'three';

interface PieData {
  name: string;
  value: number;
  color: string;
}

interface PieChart3DProps {
  data: PieData[];
  width?: number;
  height?: number;
}

function PieSlice({
  startAngle,
  endAngle,
  value,
  color,
  maxValue,
  radius = 2,
}: {
  startAngle: number;
  endAngle: number;
  value: number;
  color: string;
  maxValue: number;
  radius?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  // 根据数据值计算高度（层次落差）
  const height = (value / maxValue) * 1.5 + 0.3;

  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const segments = 32;
    const angleStep = (endAngle - startAngle) / segments;

    // 绘制饼图扇形
    shape.moveTo(0, 0);
    for (let i = 0; i <= segments; i++) {
      const angle = startAngle + angleStep * i;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      shape.lineTo(x, y);
    }
    shape.lineTo(0, 0);

    const extrudeSettings = {
      depth: height,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 2,
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, [startAngle, endAngle, height, radius]);

  return (
    <mesh ref={meshRef} geometry={geometry} position={[0, 0, -height / 2]}>
      <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
    </mesh>
  );
}

function PieChart3DScene({ data }: { data: PieData[] }) {
  const groupRef = useRef<THREE.Group>(null);

  // 自动旋转
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.z += 0.003;
    }
  });

  const total = useMemo(() => data.reduce((sum, item) => sum + item.value, 0), [data]);
  const maxValue = useMemo(() => Math.max(...data.map((item) => item.value)), [data]);

  // 如果所有数据都是0，显示一个默认的多色饼图，保持与扫描后相同的比例和高度
  if (total === 0) {
    // 使用与扫描后相同的比例：npm: 80, pip: 30, other: 13
    const defaultData = [
      { value: 80, color: '#5b8def' },
      { value: 30, color: '#8b5cf6' },
      { value: 13, color: '#10b981' },
    ];
    const defaultTotal = defaultData.reduce((sum, item) => sum + item.value, 0);
    const defaultMaxValue = Math.max(...defaultData.map((item) => item.value));

    let currentAngle = 0;

    return (
      <group ref={groupRef}>
        {defaultData.map((item, index) => {
          const angle = (item.value / defaultTotal) * Math.PI * 2;
          const startAngle = currentAngle;
          const endAngle = currentAngle + angle;
          currentAngle = endAngle;

          return (
            <PieSlice
              key={index}
              startAngle={startAngle}
              endAngle={endAngle}
              value={item.value}
              color={item.color}
              maxValue={defaultMaxValue}
            />
          );
        })}
      </group>
    );
  }

  let currentAngle = 0;

  return (
    <group ref={groupRef}>
      {data.map((item, index) => {
        const angle = (item.value / total) * Math.PI * 2;
        const startAngle = currentAngle;
        const endAngle = currentAngle + angle;
        currentAngle = endAngle;

        return (
          <PieSlice
            key={index}
            startAngle={startAngle}
            endAngle={endAngle}
            value={item.value}
            color={item.color}
            maxValue={maxValue}
          />
        );
      })}
    </group>
  );
}

export default function PieChart3D({ data, width = 400, height = 400 }: PieChart3DProps) {
  return (
    <div style={{ width, height }}>
      <Canvas camera={{ position: [5, 3, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        <PieChart3DScene data={data} />
        <OrbitControls enableZoom={true} enablePan={false} />
      </Canvas>
    </div>
  );
}

