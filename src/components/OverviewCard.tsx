'use client';

import dynamic from 'next/dynamic';

const ScoreGauge = dynamic(() => import('@/components/ScoreGauge'), { ssr: false });

interface OverviewCardProps {
  totalComponents: number;
  licensedComponents: number;
  vulnerabilities: number;
  riskLevel: string;
  overallScore: number;
}

export function OverviewCard({
  totalComponents,
  licensedComponents,
  vulnerabilities,
  riskLevel,
  overallScore,
}: OverviewCardProps) {
  return (
    <div className="bg-[#151b2e] border border-[#1e293b] rounded-lg p-8 card-gradient">
      <div className="flex items-center justify-between">
        {/* Left: Stats */}
        <div className="flex items-center gap-12">
          <div>
            <div className="text-5xl font-bold text-white">{totalComponents}</div>
            <div className="text-sm text-gray-400 mt-1">组件</div>
          </div>
          <div>
            <div className="text-5xl font-bold text-white">{licensedComponents}</div>
            <div className="text-sm text-gray-400 mt-1">个许可证</div>
          </div>
          <div>
            <div className="text-5xl font-bold text-white">{vulnerabilities}</div>
            <div className="text-sm text-gray-400 mt-1">个漏洞</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-[#5b8def]">{riskLevel}</div>
          </div>
        </div>

        {/* Right: Score Gauge */}
        <div className="flex items-center justify-center">
          <ScoreGauge score={overallScore} title="综合评分" width={350} height={350} />
        </div>
      </div>
    </div>
  );
}

