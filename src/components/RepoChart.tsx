'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { RepoMetric } from '@/data/mockRepoData';

interface RepoChartProps {
  metric: RepoMetric;
  height?: number;
}

export function RepoChart({ metric, height = 400 }: RepoChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // 初始化图表
    chartInstance.current = echarts.init(chartRef.current);

    // 根据图表类型生成配置
    const option = generateChartOption(metric);

    // 设置配置
    chartInstance.current.setOption(option);

    // 响应式处理
    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.current?.dispose();
    };
  }, [metric]);

  // 根据指标数据生成图表配置
  const generateChartOption = (metricData: RepoMetric): echarts.EChartsOption => {
    const { chart, data, projects, meta } = metricData;
    const presentation = meta?.presentation;

    switch (chart) {
      case 'line':
        return generateLineChartOption(metricData);
      case 'bar':
        return generateBarChartOption(metricData);
      case 'pie':
        return generatePieChartOption(metricData);
      default:
        return generateLineChartOption(metricData);
    }
  };

  // 生成折线图配置
  const generateLineChartOption = (metricData: RepoMetric): echarts.EChartsOption => {
    const { data, projects, meta } = metricData;
    const presentation = meta?.presentation;

    const series = projects.map(project => ({
      name: project,
      type: 'line',
      data: data.buckets.map(bucket => ({
        name: bucket.bucket,
        value: bucket[project] || 0
      })),
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: {
        width: 3
      },
      areaStyle: projects.length === 1 ? {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(58, 77, 233, 0.3)' },
          { offset: 1, color: 'rgba(58, 77, 233, 0.1)' }
        ])
      } : undefined
    }));

    return {
      title: {
        text: presentation?.title || '趋势图',
        left: 'center',
        textStyle: {
          color: 'var(--foreground)',
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
        textStyle: {
          color: 'var(--foreground)'
        },
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: 'var(--primary)'
          }
        }
      },
      legend: {
        data: projects,
        top: 'bottom',
        textStyle: {
          color: 'var(--foreground)'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: data.buckets.map(bucket => bucket.bucket),
        axisLine: {
          lineStyle: {
            color: 'var(--border)'
          }
        },
        axisLabel: {
          color: 'var(--muted-foreground)',
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        name: presentation?.y_label || '数值',
        nameTextStyle: {
          color: 'var(--muted-foreground)'
        },
        axisLine: {
          lineStyle: {
            color: 'var(--border)'
          }
        },
        axisLabel: {
          color: 'var(--muted-foreground)'
        },
        splitLine: {
          lineStyle: {
            color: 'var(--border)',
            type: 'dashed'
          }
        }
      },
      series
    };
  };

  // 生成柱状图配置
  const generateBarChartOption = (metricData: RepoMetric): echarts.EChartsOption => {
    const { data, projects, meta } = metricData;
    const presentation = meta?.presentation;

    const series = projects.map(project => ({
      name: project,
      type: 'bar',
      data: data.buckets.map(bucket => bucket[project] || 0),
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#3a4de9' },
          { offset: 1, color: '#1e3a8a' }
        ])
      }
    }));

    return {
      title: {
        text: presentation?.title || '柱状图',
        left: 'center',
        textStyle: {
          color: 'var(--foreground)',
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
        textStyle: {
          color: 'var(--foreground)'
        }
      },
      legend: {
        data: projects,
        top: 'bottom',
        textStyle: {
          color: 'var(--foreground)'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: data.buckets.map(bucket => bucket.bucket),
        axisLine: {
          lineStyle: {
            color: 'var(--border)'
          }
        },
        axisLabel: {
          color: 'var(--muted-foreground)',
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        name: presentation?.y_label || '数值',
        nameTextStyle: {
          color: 'var(--muted-foreground)'
        },
        axisLine: {
          lineStyle: {
            color: 'var(--border)'
          }
        },
        axisLabel: {
          color: 'var(--muted-foreground)'
        },
        splitLine: {
          lineStyle: {
            color: 'var(--border)',
            type: 'dashed'
          }
        }
      },
      series
    };
  };

  // 生成饼图配置
  const generatePieChartOption = (metricData: RepoMetric): echarts.EChartsOption => {
    const { data, projects, meta } = metricData;
    const presentation = meta?.presentation;

    return {
      title: {
        text: presentation?.title || '分布图',
        left: 'center',
        textStyle: {
          color: 'var(--foreground)',
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
        textStyle: {
          color: 'var(--foreground)'
        },
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'middle',
        textStyle: {
          color: 'var(--foreground)'
        }
      },
      series: [
        {
          name: presentation?.title || '分布',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['60%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: 'var(--background)',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 18,
              fontWeight: 'bold',
              color: 'var(--foreground)'
            }
          },
          labelLine: {
            show: false
          },
          data: data.buckets.map(bucket => ({
            name: bucket.bucket,
            value: bucket[projects[0]] || 0
          }))
        }
      ]
    };
  };

  return (
    <div
      ref={chartRef}
      style={{ height: `${height}px` }}
      className="w-full bg-[var(--card)] border border-[var(--border)] rounded-lg p-4"
    />
  );
}