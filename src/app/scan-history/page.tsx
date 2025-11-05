'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getAllScanResults, getScanStats, type ScanResult } from '@/lib/scan-results';

export default function ScanHistoryPage() {
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [stats, setStats] = useState<{
    totalScans: number;
    uniqueRepos: number;
    recentScans: ScanResult[];
    averageScore: number;
  } | null>(null);

  useEffect(() => {
    const results = getAllScanResults();
    setScans(results);
    setStats(getScanStats());
  }, []);

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN');
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getRiskBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 dark:bg-green-900/20';
    if (score >= 60) return 'bg-orange-50 dark:bg-orange-900/20';
    return 'bg-red-50 dark:bg-red-900/20';
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/home" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
              ← 返回首页
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gradient">扫描历史</h1>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">查看所有扫描记录和结果</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        {stats && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-[var(--primary)]">{stats.totalScans}</div>
              <div className="text-sm text-[var(--muted-foreground)]">总扫描次数</div>
            </div>
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-[var(--primary)]">{stats.uniqueRepos}</div>
              <div className="text-sm text-[var(--muted-foreground)]">唯一仓库</div>
            </div>
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-[var(--primary)]">{stats.averageScore}</div>
              <div className="text-sm text-[var(--muted-foreground)]">平均安全分</div>
            </div>
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-[var(--primary)]">{scans.length}</div>
              <div className="text-sm text-[var(--muted-foreground)]">当前记录</div>
            </div>
          </div>
        )}

        {/* Scans List */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border)]">
            <h2 className="text-lg font-semibold">扫描记录</h2>
          </div>

          {scans.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold mb-2">暂无扫描记录</h3>
              <p className="text-[var(--muted-foreground)] mb-6">
                返回首页开始您的第一次扫描
              </p>
              <Link
                href="/home"
                className="px-6 py-3 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
              >
                开始扫描
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {scans.map((scan) => (
                <div key={scan.id} className="p-6 hover:bg-[var(--input)] transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{scan.repoName}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${getRiskBgColor(scan.data.overallScore)} ${getRiskColor(scan.data.overallScore)}`}>
                          安全分: {scan.data.overallScore}
                        </span>
                      </div>
                      <div className="text-sm text-[var(--muted-foreground)] space-y-1">
                        <div>扫描ID: {scan.id}</div>
                        <div>仓库URL: {scan.repoUrl}</div>
                        <div>扫描时间: {formatTimestamp(scan.timestamp)}</div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <span className="text-blue-600">📦</span>
                          <span>{scan.data.totalComponents} 组件</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-orange-600">🛡️</span>
                          <span>{scan.data.vulnerabilities} 漏洞</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-green-600">👥</span>
                          <span>{scan.data.contributors} 贡献者</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/scan/${scan.id}`}
                        className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary)]/90 transition-colors text-sm"
                      >
                        查看详情
                      </Link>
                      <Link
                        href="/home"
                        className="px-4 py-2 border border-[var(--border)] text-[var(--foreground)] rounded-lg hover:bg-[var(--input)] transition-colors text-sm"
                      >
                        重新扫描
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/home"
            className="px-6 py-3 border border-[var(--border)] text-[var(--foreground)] rounded-lg hover:bg-[var(--input)] transition-all duration-200"
          >
            返回首页
          </Link>
        </div>
      </main>
    </div>
  );
}