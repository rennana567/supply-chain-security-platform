'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';

const PieChart3D = dynamic(() => import('@/components/PieChart3D'), { ssr: false });
const BarChart3D = dynamic(() => import('@/components/BarChart3D'), { ssr: false });

interface ModuleEntryCardProps {
  title: string;
  description: string;
  icon: string;
  href: string;
  data: any;
  chartType: 'pie' | 'donut' | 'radar' | 'line' | 'bar';
}

export function ModuleEntryCard({ title, description, icon, href, data, chartType }: ModuleEntryCardProps) {
  const renderChart = () => {
    switch (chartType) {
      case 'pie':
        const pieData = [
          { name: 'npm', value: data.npm, color: '#5b8def' },
          { name: 'pip', value: data.pip, color: '#8b5cf6' },
          { name: 'other', value: data.other, color: '#10b981' },
        ];
        return (
          <div className="flex justify-center items-center">
            <PieChart3D data={pieData} width={240} height={160} />
          </div>
        );

      case 'donut':
        const donutData = [
          { name: '未声明', value: data.undeclared || 1, color: '#94a3b8' },
          { name: '兼容', value: data.compatible, color: '#5b8def' },
        ];
        return (
          <div className="flex justify-center items-center">
            <PieChart3D data={donutData} width={240} height={160} />
          </div>
        );

      case 'radar':
        // 使用 ECharts 实现 3D 雷达图效果
        return (
          <div className="flex justify-center items-center h-[140px]">
            <svg width="100%" height="140" viewBox="0 0 200 140">
              <defs>
                <linearGradient id="radarGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#5b8def" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#5b8def" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              {/* 背景网格 */}
              <polygon
                points="100,20 160,60 100,100 40,60"
                fill="none"
                stroke="#1e293b"
                strokeWidth="1"
              />
              <polygon
                points="100,35 145,60 100,85 55,60"
                fill="none"
                stroke="#1e293b"
                strokeWidth="1"
              />
              <polygon
                points="100,50 130,60 100,70 70,60"
                fill="none"
                stroke="#1e293b"
                strokeWidth="1"
              />
              {/* 数据区域 */}
              <polygon
                points={`100,${20 + (100 - 20) * (1 - data.high / 5)} ${160 - (160 - 100) * (1 - data.medium / 5)},60 100,${100 - (100 - 20) * (1 - data.low / 5)} ${40 + (100 - 40) * (1 - data.medium / 5)},60`}
                fill="url(#radarGradient)"
                stroke="#5b8def"
                strokeWidth="2"
              />
              {/* 标签 */}
              <text x="100" y="15" fill="#94a3b8" fontSize="10" textAnchor="middle">高</text>
              <text x="165" y="65" fill="#94a3b8" fontSize="10" textAnchor="start">中</text>
              <text x="100" y="110" fill="#94a3b8" fontSize="10" textAnchor="middle">低</text>
            </svg>
          </div>
        );

      case 'line':
        // 使用 SVG 实现带阴影的折线图效果
        const lineData = [
          { name: '1', value: 3 },
          { name: '2', value: 5 },
          { name: '3', value: 4 },
          { name: '4', value: 6 },
          { name: '5', value: 4 },
          { name: '6', value: 5 },
        ];
        const maxValue = Math.max(...lineData.map(d => d.value));
        const points = lineData.map((d, i) => {
          const x = (i / (lineData.length - 1)) * 180 + 10;
          const y = 120 - (d.value / maxValue) * 100;
          return `${x},${y}`;
        }).join(' ');
        const areaPoints = `10,120 ${points} 190,120`;
        
        return (
          <div className="flex justify-center items-center h-[140px]">
            <svg width="100%" height="140" viewBox="0 0 200 140">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#5b8def" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#5b8def" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              {/* 阴影区域 */}
              <polygon points={areaPoints} fill="url(#lineGradient)" />
              {/* 折线 */}
              <polyline
                points={points}
                fill="none"
                stroke="#5b8def"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* 数据点 */}
              {lineData.map((d, i) => {
                const x = (i / (lineData.length - 1)) * 180 + 10;
                const y = 120 - (d.value / maxValue) * 100;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="3"
                    fill="#5b8def"
                    stroke="#0a0e1a"
                    strokeWidth="2"
                  />
                );
              })}
            </svg>
          </div>
        );

      case 'bar':
        const barData = [
          { name: 'A', value: data.commits || 80, color: '#5b8def' },
          { name: 'B', value: data.prs || 60, color: '#8b5cf6' },
          { name: 'C', value: data.reviews || 40, color: '#10b981' },
        ];
        return (
          <div className="flex justify-center items-center">
            <BarChart3D data={barData} width={240} height={160} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Link href={href}>
      <div className="h-full bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 card-gradient hover:border-[var(--primary)]/30 cursor-pointer transition-all duration-300 hover:scale-105 flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-3xl mb-2">{icon}</div>
            <h3 className="text-lg font-semibold text-[var(--foreground)]">{title}</h3>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">{description}</p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center min-h-[140px]">
          {renderChart()}
        </div>
        {chartType === 'pie' && (
          <div className="mt-4 flex items-center gap-4 text-xs justify-center">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-[#5b8def]"></div>
              <span className="text-[var(--muted-foreground)]">npm</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-[#8b5cf6]"></div>
              <span className="text-[var(--muted-foreground)]">pip</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
              <span className="text-[var(--muted-foreground)]">Other</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

