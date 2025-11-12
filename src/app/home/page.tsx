'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RepoInput } from '@/components/RepoInput';
import { ScanButton } from '@/components/ScanButton';
import { OverviewCard } from '@/components/OverviewCard';
import { ModuleEntryCard } from '@/components/ModuleEntryCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getRepositoryId, getRepositoryName } from '@/lib/repo-ids';

// 简单的内存存储（临时解决方案）
interface ScanData {
  repoName?: string;
  // 可以添加其他扫描数据字段
}

interface ScanResult {
  id: string;
  repoUrl: string;
  repoName: string;
  timestamp: number;
  data: ScanData;
}

const scanResults = new Map<string, ScanResult>();

function storeScanResult(repoUrl: string, data: ScanData): string {
  const id = `scan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  scanResults.set(id, {
    id,
    repoUrl,
    repoName: data.repoName || repoUrl,
    timestamp: Date.now(),
    data
  });
  return id;
}

export default function Dashboard() {
  const router = useRouter();
  const [repoUrl, setRepoUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
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
  } | null>(null);
  const [inputError, setInputError] = useState('');

  const handleScan = async () => {
    // 验证输入
    if (!repoUrl.trim()) {
      setInputError('请输入仓库URL或上传压缩包');
      return;
    }

    setInputError('');
    setIsScanning(true);

    // TODO: 替换为真实 API 调用
    // 示例：
    // const result = await api.scan({ repoUrl });
    // setScanResult(result);

    // 模拟扫描过程
    setTimeout(() => {
      const scanData = {
        repoName: getRepositoryName(repoUrl),
        totalComponents: 164,
        licensedComponents: 12,
        vulnerabilities: 5,
        riskLevel: '中清风险',
        overallScore: 82,
        sbomSummary: { total: 123, npm: 80, pip: 30, other: 13 },
        vulnerabilitySummary: { high: 1, medium: 2, low: 2 },
        contributors: 15,
      };

      // 存储扫描结果并获取扫描ID
      const scanId = storeScanResult(repoUrl, scanData);

      setScanResult({
        ...scanData,
        scanId,
        repoId: getRepositoryId(repoUrl)
      });

      setIsScanning(false);

      // 导航到扫描结果页面
      router.push(`/scan/${scanId}`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gradient">软件供应链安全分析平台</h1>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">AI 驱动的全方位安全检测与风险评估</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/scan-history"
              className="px-4 py-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
              扫描历史
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Input Section */}
        <div className="mb-8">
          <RepoInput
            value={repoUrl}
            onChange={setRepoUrl}
            required={true}
            error={inputError}
          />
          <div className="mt-4 flex justify-center">
            <ScanButton onClick={handleScan} isLoading={isScanning} />
          </div>
        </div>

        {/* Results Section */}
        {scanResult && (
          <>
            {/* Overview Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">安全性与可靠性画像</h2>
              <OverviewCard
                totalComponents={scanResult.totalComponents}
                licensedComponents={scanResult.licensedComponents}
                vulnerabilities={scanResult.vulnerabilities}
                riskLevel={scanResult.riskLevel}
                overallScore={scanResult.overallScore}
              />
            </div>

            {/* Module Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              <ModuleEntryCard
                title="SBOM 清单"
                description={`${scanResult.sbomSummary.total} 个组件`}
                icon="📦"
                href={`/sbom/${scanResult.repoId}`}
                data={{
                  npm: scanResult.sbomSummary.npm,
                  pip: scanResult.sbomSummary.pip,
                  other: scanResult.sbomSummary.other,
                }}
                chartType="pie"
              />

              <ModuleEntryCard
                title="代码风险检测"
                description="许可证、漏洞、投毒风险"
                icon="🔍"
                href={`/code-risk/${scanResult.repoId}`}
                data={{
                  license: 12,
                  vulnerability: scanResult.vulnerabilities,
                  poisoning: 8,
                }}
                chartType="risk-radar"
              />

              <ModuleEntryCard
                title="开发者画像"
                description={`${scanResult.contributors} 个贡献者`}
                icon="👥"
                href={`/developer/${scanResult.repoId}`}
                data={{
                  commits: 320,
                  prs: 45,
                  reviews: 12,
                }}
                chartType="bar"
              />
            </div>

            {/* Feature Description Section */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">🔍</span>
                  智能扫描
                </h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                  基于 AI 技术的深度扫描引擎，自动识别项目依赖关系，生成完整的 SBOM 清单，支持多种包管理器（npm、pip、go 等），全面覆盖项目的软件供应链。
                </p>
              </div>

              <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">🛡️</span>
                  漏洞检测
                </h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                  实时对接 CVE 漏洞数据库，精准识别组件中的安全漏洞，提供详细的漏洞描述和修复建议，帮助开发团队快速响应安全威胁。
                </p>
              </div>

              <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">📜</span>
                  许可证合规
                </h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                  自动检测项目中的许可证使用情况，识别许可证冲突和未声明的许可证，确保项目符合开源许可证合规要求，降低法律风险。
                </p>
              </div>

              <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">⚠️</span>
                  投毒风险监测
                </h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                  支持按需扫描和持续监测两种模式，实时监控依赖包的投毒风险，及时发现恶意代码注入，保障软件供应链的安全性。
                </p>
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {!scanResult && !isScanning && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-[var(--muted-foreground)] mb-8">
              输入仓库 URL 或上传压缩包开始安全扫描
            </p>

            {/* Pre-scan module cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr max-w-6xl mx-auto">
              <ModuleEntryCard
                title="SBOM 清单"
                description="查看项目组件清单"
                icon="📦"
                href="/sbom"
                data={{ npm: 0, pip: 0, other: 0 }}
                chartType="pie"
              />

              <ModuleEntryCard
                title="代码风险检测"
                description="许可证、漏洞、投毒风险"
                icon="🔍"
                href="/code-risk"
                data={{ license: 0, vulnerability: 0, poisoning: 0 }}
                chartType="risk-radar"
              />

              <ModuleEntryCard
                title="开发者画像"
                description="开发者活跃度与贡献概览"
                icon="👥"
                href="/developer"
                data={{ commits: 0, prs: 0, reviews: 0 }}
                chartType="bar"
              />
            </div>

            {/* Feature Highlights */}
            <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 text-left">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">🚀</span>
                  快速开始
                </h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                  只需提供 GitHub 或 Gitee 仓库 URL，或上传项目压缩包，即可一键启动全方位的安全扫描分析。
                </p>
              </div>

              <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 text-left">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  可视化报告
                </h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                  直观的图表和数据展示，帮助您快速了解项目的安全状况，支持导出 CSV/JSON 格式的详细报告。
                </p>
              </div>

              <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 text-left">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">🔄</span>
                  持续监测
                </h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                  支持持续监测模式，自动定期扫描项目依赖，及时发现新增的安全风险，确保项目长期安全。
                </p>
              </div>

              <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 text-left">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">👥</span>
                  开发者画像
                </h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                  分析项目贡献者的活跃度和技能分布，生成开发者画像和开源简历，助力团队协作和人才评估。
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isScanning && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[var(--primary)] mb-4"></div>
            <p className="text-xl text-[var(--muted-foreground)]">正在扫描分析中...</p>
            <p className="text-sm text-[var(--muted-foreground)] mt-2">这可能需要几分钟时间，请耐心等待</p>
          </div>
        )}
      </main>
    </div>
  );
}

