'use client';

import { useEffect, useRef, useState } from 'react';
import SkeletonLoader from './SkeletonLoader';

interface GitHubLineChartProps {
  data: {
    metric: string;
    projects: string[];
    chart: 'line';
    time_unit: string;
    data: {
      totals?: Record<string, number>;
      buckets: Array<{
        bucket: string;
        [key: string]: number | string | null;
      }>;
    };
    meta?: {
      presentation: {
        title: string;
        description: string;
        y_label: string;
        unit: string;
      };
    };
  };
  height?: number;
}

/** ============== 工具：从 buckets 自动提取 series（≤2 线有面积） ============== */
function buildSeriesFromBuckets(buckets: any[], options = {}) {
  const { areaOpacitySingle = 0.25, areaOpacityDual = 0.18 } = options as any;

  // 收集数值键（排除 bucket）
  const numericKeys = new Set<string>();
  for (const row of buckets) {
    for (const k of Object.keys(row)) {
      if (k === 'bucket') continue;
      const v = row[k];
      if (typeof v === 'number' && Number.isFinite(v)) numericKeys.add(k);
    }
  }
  // 兜底：没有发现数值键时尝试 count/value/total/y
  if (numericKeys.size === 0) {
    for (const c of ['count', 'value', 'total', 'y']) {
      if (buckets.some((r: any) => typeof r[c] === 'number' && Number.isFinite(r[c]))) {
        numericKeys.add(c);
        break;
      }
    }
  }

  const keys = Array.from(numericKeys);
  const x = buckets.map((b: any) => b.bucket);

  // 是否给系列加面积：仅当总系列数 ≤ 2
  const withArea = keys.length <= 2;
  const areaOpacity = (keys.length === 1) ? areaOpacitySingle : areaOpacityDual;

  const series = keys.map(k => {
    const base = {
      name: k,
      type: 'line' as const,
      smooth: true,
      showSymbol: false,
      connectNulls: true,
      lineStyle: { width: 2 },
      data: buckets.map((b: any) => {
        const v = b[k];
        return (typeof v === 'number' && Number.isFinite(v)) ? v : null;
      })
    };
    return withArea ? { ...base, areaStyle: { opacity: areaOpacity } } : base;
  });

  return { x, series, keys };
}

export function GitHubLineChart({ data, height = 400 }: GitHubLineChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!chartRef.current) return;

    const initChart = async () => {
      try {
        setIsLoading(true);
        // 动态导入ECharts
        const echartsLib = await import('echarts');

        // 初始化图表
        chartInstance.current = echartsLib.init(chartRef.current);

        const { buckets } = data.data;
        const pres = data.meta?.presentation;
        const unitLabel = pres?.unit || '';
        const yAxisName = pres?.y_label || '';

        const { x, series } = buildSeriesFromBuckets(buckets);

        if (x.length === 0 || series.length === 0) {
          console.error('no numeric series detected (check your buckets data)');
          setIsLoading(false);
          return;
        }

        const start = x[0], end = x[x.length - 1];

        // 保持原有默认值，仅新增 extraClearance 控制底部整体留白
        const GRID_LEFT = 72;
        const GRID_RIGHT = 56;
        const GRID_TOP = 48;

        const FONT_SIZE = 12;
        const ROTATE_DEG = 45;
        const SLIDER_H = 18;

        const GAP_AXIS_TO_SLIDER = 4;   // 轴线↔slider 的间距（保持原版默认）
        const GAP_SLIDER_TO_LABEL = 10;  // slider↔标签 的间距（保持原版默认）
        const EXTRA_PAD = 8;   // 标签高度估算冗余（保持原版默认）
        const EXTRA_CLEARANCE = 12;  // 新增：底部整体留白，不改变相对位置

        const kLabel = ROTATE_DEG >= 80 ? 4.3
                    : ROTATE_DEG >= 60 ? 3.7
                    : ROTATE_DEG >= 45 ? 3.6
                    : ROTATE_DEG >= 30 ? 3.0
                    : 2.2;
        const LABEL_SPACE = Math.round(FONT_SIZE * kLabel);

        // 统一基线：保证"标签-轴线-slider"的相对位置稳定
        const AXIS_MARGIN = GAP_AXIS_TO_SLIDER + SLIDER_H + GAP_SLIDER_TO_LABEL;
        const BASE_BOTTOM = LABEL_SPACE + EXTRA_PAD + GAP_SLIDER_TO_LABEL;
        const SLIDER_BOTTOM = BASE_BOTTOM + EXTRA_CLEARANCE;
        const GRID_BOTTOM = BASE_BOTTOM + SLIDER_H + GAP_AXIS_TO_SLIDER + EXTRA_CLEARANCE;

        const AXIS_LINE_W = 1;
        const PIX_ALIGN = (AXIS_LINE_W % 2 ? 0.5 : 0);
        const SLIDER_SHIFT_X = 0;

        const option: echarts.EChartsOption = {
          tooltip: {
            trigger: 'axis',
            confine: true,
            // 多线：每条都列出来；单线：保持你原来的展示
            formatter: (params: any) => {
              const lines = [];
              lines.push(params[0].axisValue);
              for (const d of params) {
                const val = (d.data == null) ? '—' : d.data;
                lines.push(`${d.marker} ${d.seriesName}: ${val}${unitLabel ? ' ' + unitLabel : ''}`);
              }
              return lines.join('<br/>');
            }
          },
          grid: { left: GRID_LEFT, right: GRID_RIGHT, top: GRID_TOP, bottom: GRID_BOTTOM },
          dataZoom: [
            { type: 'inside', xAxisIndex: 0, startValue: start, endValue: end, minValueSpan: 1 },
            {
              type: 'slider',
              xAxisIndex: 0,
              left: GRID_LEFT - 5 * PIX_ALIGN + SLIDER_SHIFT_X,
              right: GRID_RIGHT + PIX_ALIGN,
              bottom: SLIDER_BOTTOM,
              height: SLIDER_H,
              startValue: start,
              endValue: end,
              minValueSpan: 1,
              brushSelect: false,
              showDetail: false,
              handleSize: 12,
              borderColor: 'transparent',
              dataBackground: { lineStyle: { opacity: 0 }, areaStyle: { opacity: 0.08 } },
              selectedDataBackground: { lineStyle: { opacity: 0 }, areaStyle: { opacity: 0.18 } }
            }
          ],
          // 多线时显示 legend，单线时隐藏
          legend: (series.length > 1) ? {
            top: 8,
            icon: 'roundRect',
            itemWidth: 14,
            itemHeight: 8,
            textStyle: { fontSize: 12 },
          } : undefined,
          xAxis: {
            type: 'category',
            data: x,
            boundaryGap: false,
            axisLine: { lineStyle: { width: AXIS_LINE_W } },
            axisTick: { alignWithLabel: true },
            axisLabel: {
              fontSize: FONT_SIZE,
              rotate: ROTATE_DEG,
              margin: AXIS_MARGIN,
              hideOverlap: true,
              color: 'var(--muted-foreground)'
            }
          },
          yAxis: {
            type: 'value',
            name: yAxisName,
            nameTextStyle: {
              padding: [0, 6, 0, 0],
              color: 'var(--muted-foreground)'
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

        chartInstance.current.setOption(option);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize chart:', error);
        setIsLoading(false);
      }
    };

    initChart();

    // 响应式处理
    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.current?.dispose();
    };
  }, [data]);

  if (isLoading) {
    return <SkeletonLoader type="chart" />;
  }

  return (
    <div
      ref={chartRef}
      style={{ height: `${height}px` }}
      className="w-full"
    />
  );
}