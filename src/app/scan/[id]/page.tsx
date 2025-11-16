'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { OverviewCard } from '@/components/OverviewCard';
import { ModuleEntryCard } from '@/components/ModuleEntryCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getRepositoryId } from '@/lib/repo-ids';
import { getScanResult } from '@/lib/scan-storage';

export default function ScanResultPage() {
  const params = useParams();
  const router = useRouter();
  const [scanResult, setScanResult] = useState<{
    repoName: string;
    totalComponents: number;
    licensedComponents: number;
    vulnerabilities: number;
    riskLevel: string;
    overallScore: number;
    sbomSummary: { total: number; npm: number; pip: number; other: number };
    vulnerabilitySummary: { high: number; medium: number; low: number };
    contributors: number;
    scanId: string;
    repoId: string;
    timestamp: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const scanId = params.id as string;

  useEffect(() => {
    if (scanId) {
      // 从存储中获取实际的扫描数据
      const storedResult = getScanResult(scanId);

      if (storedResult) {
        // 使用存储的实际数据
        const actualData = {
          repoName: storedResult.repoName,
          totalComponents: storedResult.data.totalComponents || 0,
          licensedComponents: storedResult.data.licensedComponents || 0,
          vulnerabilities: storedResult.data.vulnerabilities || 0,
          riskLevel: storedResult.data.riskLevel || '未知',
          overallScore: storedResult.data.overallScore || 0,
          sbomSummary: storedResult.data.sbomSummary || { total: 0, npm: 0, pip: 0, other: 0 },
          vulnerabilitySummary: storedResult.data.vulnerabilitySummary || { high: 0, medium: 0, low: 0 },
          contributors: storedResult.data.contributors || 0,
          scanId: scanId,
          repoId: storedResult.repoId,
          timestamp: storedResult.timestamp
        };

        setScanResult(actualData);
      } else {
        // 如果没有找到存储的数据，显示错误
        setError('扫描结果不存在或已过期');
      }

      setLoading(false);
    }
  }, [scanId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[var(--primary)] mb-4"></div>
          <p className="text-xl text-[var(--muted-foreground)]">加载扫描结果中...</p>
        </div>
      </div>
    );
  }

  if (error || !scanResult) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <header className="border-b border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/home" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                ← 返回首页
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gradient">扫描结果</h1>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main className="container mx-auto px-6 py-20 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-4">{error}</h2>
          <p className="text-[var(--muted-foreground)] mb-8">
            请返回首页重新扫描
          </p>
          <Link
            href="/home"
            className="px-6 py-3 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
          >
            返回首页
          </Link>
        </main>
      </div>
    );
  }

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
              <h1 className="text-2xl font-bold text-gradient">扫描结果</h1>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                {scanResult?.repoName} • 扫描ID: {scanResult?.scanId}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Scan Info */}
        <div className="mb-6 bg-[var(--card)] border border-[var(--border)] rounded-lg p-4">
          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--muted-foreground)]">
            <div>
              <span className="font-medium">扫描ID:</span> {scanResult?.scanId}
            </div>
            <div>
              <span className="font-medium">仓库:</span> {scanResult?.repoName}
            </div>
            <div>
              <span className="font-medium">扫描时间:</span> {scanResult?.timestamp ? new Date(scanResult.timestamp).toLocaleString() : 'N/A'}
            </div>
            <div>
              <span className="font-medium">仓库ID:</span> {scanResult?.repoId}
            </div>
          </div>
        </div>

        {/* Overview Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">安全性与可靠性画像</h2>
          <OverviewCard
            totalComponents={scanResult?.totalComponents || 0}
            licensedComponents={scanResult?.licensedComponents || 0}
            vulnerabilities={scanResult?.vulnerabilities || 0}
            riskLevel={scanResult?.riskLevel || '未知'}
            overallScore={scanResult?.overallScore || 0}
          />
        </div>

        {/* Module Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          <ModuleEntryCard
            title="SBOM 清单"
            description={`${scanResult?.sbomSummary?.total || 0} 个组件`}
            icon="📦"
            href={`/sbom/${scanResult?.repoId || ''}`}
            data={{
              npm: scanResult?.sbomSummary?.npm || 0,
              pip: scanResult?.sbomSummary?.pip || 0,
              other: scanResult?.sbomSummary?.other || 0,
            }}
            chartType="pie"
          />

          <ModuleEntryCard
            title="代码风险检测"
            description="许可证、漏洞、投毒风险"
            icon="🔍"
            href={`/code-risk/${scanResult?.repoId || ''}`}
            data={{
              license: 12,
              vulnerability: scanResult?.vulnerabilities || 0,
              poisoning: 8,
            }}
            chartType="risk-radar"
          />

          <ModuleEntryCard
            title="开发者画像"
            description={`${scanResult?.contributors || 0} 个贡献者`}
            icon="👥"
            href={`/developer/${scanResult?.repoId || ''}`}
            data={{
              commits: 320,
              prs: 45,
              reviews: 12,
            }}
            chartType="bar"
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex gap-4 justify-center">
          <Link
            href="/home"
            className="px-6 py-3 border border-[var(--border)] text-[var(--foreground)] rounded-lg hover:bg-[var(--input)] transition-all duration-200"
          >
            返回首页
          </Link>
          <button
            onClick={() => router.push(`/home`)}
            className="px-6 py-3 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
          >
            重新扫描
          </button>
        </div>
      </main>
    </div>
  );
}