// 扫描结果存储和检索系统

export interface ScanResult {
  id: string;
  repoUrl: string;
  repoName: string;
  timestamp: number;
  data: {
    totalComponents: number;
    licensedComponents: number;
    vulnerabilities: number;
    riskLevel: string;
    overallScore: number;
    sbomSummary: { total: number; npm: number; pip: number; other: number };
    vulnerabilitySummary: { high: number; medium: number; low: number };
    contributors: number;
  };
}

// 内存中的扫描结果存储（生产环境应该使用数据库）
const scanResults = new Map<string, ScanResult>();

// 存储扫描结果
export function storeScanResult(repoUrl: string, data: {
  repoName: string;
  totalComponents: number;
  licensedComponents: number;
  vulnerabilities: number;
  riskLevel: string;
  overallScore: number;
  sbomSummary: { total: number; npm: number; pip: number; other: number };
  vulnerabilitySummary: { high: number; medium: number; low: number };
  contributors: number;
}): string {
  const id = `scan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const scanResult: ScanResult = {
    id,
    repoUrl,
    repoName: data.repoName || repoUrl,
    timestamp: Date.now(),
    data
  };

  scanResults.set(id, scanResult);
  return id;
}

// 根据ID获取扫描结果
export function getScanResult(scanId: string): ScanResult | null {
  return scanResults.get(scanId) || null;
}

// 根据仓库URL获取最新的扫描结果
export function getLatestScanResultByUrl(repoUrl: string): ScanResult | null {
  let latest: ScanResult | null = null;

  for (const result of scanResults.values()) {
    if (result.repoUrl === repoUrl) {
      if (!latest || result.timestamp > latest.timestamp) {
        latest = result;
      }
    }
  }

  return latest;
}

// 获取所有扫描结果
export function getAllScanResults(): ScanResult[] {
  return Array.from(scanResults.values()).sort((a, b) => b.timestamp - a.timestamp);
}

// 删除扫描结果
export function deleteScanResult(scanId: string): boolean {
  return scanResults.delete(scanId);
}

// 获取扫描结果统计
export function getScanStats() {
  const results = getAllScanResults();
  return {
    totalScans: results.length,
    uniqueRepos: new Set(results.map(r => r.repoUrl)).size,
    recentScans: results.slice(0, 10),
    averageScore: results.length > 0
      ? Math.round(results.reduce((sum, r) => sum + r.data.overallScore, 0) / results.length)
      : 0
  };
}