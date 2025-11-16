// 扫描结果存储 - 在首页和扫描结果页面之间共享
import { getRepositoryId } from './repo-ids';

interface ScanData {
  repoName?: string;
  // 可以添加其他扫描数据字段
}

export interface ScanResult {
  id: string;
  repoUrl: string;
  repoName: string;
  repoId: string;
  timestamp: number;
  data: ScanData;
}

// 全局存储
const scanResults = new Map<string, ScanResult>();

// 存储扫描结果
export function storeScanResult(repoUrl: string, data: ScanData, repoId?: string): string {
  const id = `scan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  scanResults.set(id, {
    id,
    repoUrl,
    repoName: data.repoName || repoUrl,
    repoId: repoId || getRepositoryId(repoUrl),
    timestamp: Date.now(),
    data
  });
  return id;
}

// 获取扫描结果
export function getScanResult(scanId: string): ScanResult | undefined {
  return scanResults.get(scanId);
}

// 获取所有扫描结果
export function getAllScanResults(): ScanResult[] {
  return Array.from(scanResults.values());
}

// 删除扫描结果
export function deleteScanResult(scanId: string): boolean {
  return scanResults.delete(scanId);
}