'use client';

import { useEffect, useRef, useState } from 'react';

interface RiskRadarChartProps {
  data: {
    license: number;
    vulnerability: number;
    poisoning: number;
  };
  width?: number;
  height?: number;
}

export function RiskRadarChart({ data, width = 240, height = 160 }: RiskRadarChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!chartRef.current) return;

    const initChart = async () => {
      try {
        setIsLoading(true);
        const echartsLib = await import('echarts');

        const chartInstance = echartsLib.init(chartRef.current);

        // 计算风险评分（数值越小风险越低）
        const licenseScore = Math.max(0, 10 - data.license); // 许可证越多风险越低
        const vulnerabilityScore = data.vulnerability * 2; // 漏洞越多风险越高
        const poisoningScore = data.poisoning * 1.5; // 投毒任务越多风险越高

        const option = {
          radar: {
            indicator: [
              { name: '许可证', max: 10 },
              { name: '漏洞', max: 10 },
              { name: '投毒', max: 10 },
            ],
            shape: 'circle',
            splitNumber: 3,
            axisName: {
              color: 'var(--muted-foreground)',
              fontSize: 10,
              fontWeight: '500',
            },
            splitLine: {
              lineStyle: {
                color: ['var(--border)', 'var(--border)', 'var(--border)'],
                width: 1,
                type: 'dashed'
              }
            },
            splitArea: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: 'var(--border)',
                width: 1
              }
            }
          },
          series: [
            {
              type: 'radar',
              data: [
                {
                  value: [licenseScore, vulnerabilityScore, poisoningScore],
                  name: '风险评分',
                  areaStyle: {
                    color: {
                      type: 'radial',
                      x: 0.5,
                      y: 0.5,
                      r: 0.8,
                      colorStops: [
                        { offset: 0, color: 'rgba(91, 141, 239, 0.4)' },
                        { offset: 1, color: 'rgba(91, 141, 239, 0.1)' }
                      ]
                    }
                  },
                  lineStyle: {
                    color: '#5b8def',
                    width: 3,
                    shadowColor: 'rgba(91, 141, 239, 0.3)',
                    shadowBlur: 8
                  },
                  itemStyle: {
                    color: '#5b8def',
                    borderColor: 'var(--card)',
                    borderWidth: 2,
                    shadowColor: 'rgba(91, 141, 239, 0.5)',
                    shadowBlur: 4
                  }
                }
              ]
            }
          ],
          animation: true,
          animationDuration: 1200,
          animationEasing: 'cubicOut' as const
        };

        chartInstance.setOption(option);
        setIsLoading(false);

        // 响应式处理
        const handleResize = () => {
          chartInstance.resize();
        };

        window.addEventListener('resize', handleResize);

        return () => {
          window.removeEventListener('resize', handleResize);
          chartInstance.dispose();
        };
      } catch (error) {
        console.error('Failed to initialize radar chart:', error);
        setIsLoading(false);
      }
    };

    initChart();
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center" style={{ width, height }}>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  return (
    <div
      ref={chartRef}
      style={{ width: `${width}px`, height: `${height}px` }}
      className="w-full"
    />
  );
}