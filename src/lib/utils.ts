import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Tailwind CSS 类名合并工具
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 格式化日期
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// 获取严重程度颜色
export function getSeverityColor(severity: string): string {
  const colors: Record<string, string> = {
    high: 'bg-red-600/20 text-red-400',
    medium: 'bg-orange-600/20 text-orange-400',
    low: 'bg-yellow-600/20 text-yellow-400',
  };
  return colors[severity] || 'bg-gray-600/20 text-gray-400';
}

// 获取严重程度标签
export function getSeverityLabel(severity: string): string {
  const labels: Record<string, string> = {
    high: '高危',
    medium: '中危',
    low: '低危',
  };
  return labels[severity] || '未知';
}

// 获取状态颜色
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    running: 'bg-blue-600/20 text-blue-400',
    completed: 'bg-green-600/20 text-green-400',
    failed: 'bg-red-600/20 text-red-400',
  };
  return colors[status] || 'bg-gray-600/20 text-gray-400';
}

// 获取状态标签
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    running: '运行中',
    completed: '已完成',
    failed: '失败',
  };
  return labels[status] || '未知';
}

// 获取风险等级颜色
export function getRiskColor(risk: string): string {
  const colors: Record<string, string> = {
    high: 'text-red-400',
    medium: 'text-orange-400',
    low: 'text-yellow-400',
    none: 'text-green-400',
  };
  return colors[risk] || 'text-gray-400';
}

// 获取风险等级标签
export function getRiskLabel(risk: string): string {
  const labels: Record<string, string> = {
    high: '高风险',
    medium: '中风险',
    low: '低风险',
    none: '无风险',
  };
  return labels[risk] || '未知';
}

// 导出 CSV
export function exportToCSV(data: any[], filename: string): void {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((header) => JSON.stringify(row[header] || '')).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

// 导出 JSON
export function exportToJSON(data: any, filename: string): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

// 计算百分比
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

// 延迟函数
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 生成随机 ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

