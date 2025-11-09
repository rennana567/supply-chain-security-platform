'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';

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
        [key: string]: number | string | null | undefined;
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

const SERIES_COLORS = [
  '#5b8def',
  '#38bdf8',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#f472b6',
];

export function GitHubLineChart({ data, height = 320 }: GitHubLineChartProps) {
  const buckets = data?.data?.buckets ?? [];

  const numericKeys = new Set<string>();
  for (const row of buckets) {
    for (const key of Object.keys(row)) {
      if (key === 'bucket') continue;
      const value = row[key];
      if (typeof value === 'number' && Number.isFinite(value)) {
        numericKeys.add(key);
      }
    }
  }

  if (numericKeys.size === 0 || buckets.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-[#1e293b] bg-[#0a0e1a] text-[#94a3b8]" style={{ height }}>
        暂无可展示的数据
      </div>
    );
  }

  const keys = Array.from(numericKeys);
  const chartData = buckets.map((bucket) => {
    const point: Record<string, number | string | null> = { bucket: bucket.bucket as string };
    for (const key of keys) {
      const value = bucket[key];
      point[key] = typeof value === 'number' && Number.isFinite(value) ? value : null;
    }
    return point;
  });

  const yLabel = data.meta?.presentation?.y_label;

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 24, right: 32, left: 0, bottom: 24 }}
        >
          <defs>
            {keys.map((key, index) => (
              <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={SERIES_COLORS[index % SERIES_COLORS.length]} stopOpacity={0.4} />
                <stop offset="95%" stopColor={SERIES_COLORS[index % SERIES_COLORS.length]} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="bucket"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            axisLine={{ stroke: '#334155' }}
            tickLine={{ stroke: '#334155' }}
            height={36}
          />
          <YAxis
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            axisLine={{ stroke: '#334155' }}
            tickLine={{ stroke: '#334155' }}
            label={yLabel ? { value: yLabel, angle: -90, position: 'insideLeft', fill: '#94a3b8' } : undefined}
          />
          <RechartsTooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              color: '#e2e8f0',
            }}
            cursor={{ stroke: '#1e293b' }}
          />
          {keys.length > 1 && (
            <Legend
              verticalAlign="top"
              height={36}
              wrapperStyle={{ color: '#e2e8f0' }}
            />
          )}
          {keys.map((key, index) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stroke={SERIES_COLORS[index % SERIES_COLORS.length]}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#gradient-${key})`}
              activeDot={{ r: 5 }}
              connectNulls
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}