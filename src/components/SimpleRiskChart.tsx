'use client';

interface SimpleRiskChartProps {
  data: {
    license: number;
    vulnerability: number;
    poisoning: number;
  };
  width?: number;
  height?: number;
}

export function SimpleRiskChart({ data, width = 240, height = 160 }: SimpleRiskChartProps) {
  // 计算总数值
  const total = data.license + data.vulnerability + data.poisoning;

  // 如果没有数据，显示默认图表
  if (total === 0) {
    return (
      <div className="flex items-center justify-center" style={{ width, height }}>
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <div className="text-sm text-gray-400">暂无数据</div>
        </div>
      </div>
    );
  }

  // 计算每个扇形的角度
  const licenseAngle = (data.license / total) * 360;
  const vulnerabilityAngle = (data.vulnerability / total) * 360;
  const poisoningAngle = (data.poisoning / total) * 360;

  // 使用固定颜色方案：绿色许可证，黄色漏洞，红色投毒
  const licenseColor = '#10b981'; // 绿色
  const vulnerabilityColor = '#f59e0b'; // 黄色
  const poisoningColor = '#ef4444'; // 红色

  // 饼图半径
  const radius = 60;
  const centerX = 120;
  const centerY = 80;

  // 生成饼图路径
  const generateArc = (startAngle: number, endAngle: number, color: string) => {
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  // 计算起始角度
  let currentAngle = 0;
  const licensePath = generateArc(currentAngle, currentAngle + licenseAngle, licenseColor);
  currentAngle += licenseAngle;
  const vulnerabilityPath = generateArc(currentAngle, currentAngle + vulnerabilityAngle, vulnerabilityColor);
  currentAngle += vulnerabilityAngle;
  const poisoningPath = generateArc(currentAngle, currentAngle + poisoningAngle, poisoningColor);

  return (
    <div className="flex flex-col items-center justify-center" style={{ width, height }}>
      <svg width="240" height="140" viewBox="0 0 240 140">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.3)" floodOpacity="0.3"/>
          </filter>
        </defs>

        {/* 饼图 */}
        <g filter="url(#shadow)">
          <path d={licensePath} fill={licenseColor} stroke="var(--card)" strokeWidth="2" />
          <path d={vulnerabilityPath} fill={vulnerabilityColor} stroke="var(--card)" strokeWidth="2" />
          <path d={poisoningPath} fill={poisoningColor} stroke="var(--card)" strokeWidth="2" />
        </g>

        {/* 中心圆 */}
        <circle cx={centerX} cy={centerY} r="20" fill="var(--card)" stroke="var(--border)" strokeWidth="1" />
        <text x={centerX} y={centerY} textAnchor="middle" dy="0.3em" fill="var(--muted-foreground)" fontSize="10" fontWeight="600">
          风险
        </text>
      </svg>

      {/* 图例 */}
      <div className="flex gap-4 mt-2 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: licenseColor }}></div>
          <span className="text-[var(--muted-foreground)]">许可证</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: vulnerabilityColor }}></div>
          <span className="text-[var(--muted-foreground)]">漏洞</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: poisoningColor }}></div>
          <span className="text-[var(--muted-foreground)]">投毒</span>
        </div>
      </div>
    </div>
  );
}