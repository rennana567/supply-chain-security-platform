'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ModuleEntryCard } from '@/components/ModuleEntryCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { loadLicenseData, loadVulnerabilityData, loadPoisonData } from '@/lib/data-loader';

interface LicenseSummary {
  total: number;
  compatible: number;
  conflict: number;
  undeclared: number;
}

interface VulnerabilitySummary {
  total: number;
  high: number;
  medium: number;
  low: number;
}

interface PoisoningSummary {
  tasks: number;
  malicious: number;
  benign: number;
  suspicious: number;
}

// 基于检测结果目录的mock数据映射
const repoDataMap: Record<string, {
  name: string;
  licenseSummary: LicenseSummary;
  vulnerabilitySummary: VulnerabilitySummary;
  poisoningSummary: PoisoningSummary;
}> = {
  'repo-kafka-python': {
    name: 'Kafka Python',
    licenseSummary: {
      total: 15,
      compatible: 12,
      conflict: 2,
      undeclared: 1,
    },
    vulnerabilitySummary: {
      total: 3,
      high: 0,
      medium: 1,
      low: 2,
    },
    poisoningSummary: {
      tasks: 5,
      malicious: 1,
      benign: 4,
      suspicious: 0,
    },
  },
  'repo-vue-django-bookshop': {
    name: 'Vue Django Book Shop',
    licenseSummary: {
      total: 8,
      compatible: 7,
      conflict: 1,
      undeclared: 0,
    },
    vulnerabilitySummary: {
      total: 6,
      high: 1,
      medium: 2,
      low: 3,
    },
    poisoningSummary: {
      tasks: 12,
      malicious: 2,
      benign: 10,
      suspicious: 0,
    },
  },
  'repo-probabilistic-forecasts': {
    name: 'Probabilistic Forecasts Attacks',
    licenseSummary: {
      total: 22,
      compatible: 18,
      conflict: 3,
      undeclared: 1,
    },
    vulnerabilitySummary: {
      total: 17,
      high: 4,
      medium: 9,
      low: 4,
    },
    poisoningSummary: {
      tasks: 16,
      malicious: 0,
      benign: 16,
      suspicious: 0,
    },
  },
  'repo-wumei-smart': {
    name: 'Wumei Smart',
    licenseSummary: {
      total: 11,
      compatible: 9,
      conflict: 1,
      undeclared: 1,
    },
    vulnerabilitySummary: {
      total: 7,
      high: 2,
      medium: 3,
      low: 2,
    },
    poisoningSummary: {
      tasks: 15,
      malicious: 3,
      benign: 12,
      suspicious: 0,
    },
  },
  'repo-xiangtian-workbench': {
    name: 'Xiangtian Workbench',
    licenseSummary: {
      total: 18,
      compatible: 15,
      conflict: 2,
      undeclared: 1,
    },
    vulnerabilitySummary: {
      total: 5,
      high: 1,
      medium: 2,
      low: 2,
    },
    poisoningSummary: {
      tasks: 10,
      malicious: 1,
      benign: 9,
      suspicious: 0,
    },
  },
  // 补充其他5个repo的数据
  'repo-pytorch': {
    name: 'PyTorch',
    licenseSummary: {
      total: 25,
      compatible: 22,
      conflict: 2,
      undeclared: 1,
    },
    vulnerabilitySummary: {
      total: 8,
      high: 1,
      medium: 3,
      low: 4,
    },
    poisoningSummary: {
      tasks: 20,
      malicious: 2,
      benign: 18,
      suspicious: 0,
    },
  },
  'repo-llama': {
    name: 'Meta Llama',
    licenseSummary: {
      total: 12,
      compatible: 10,
      conflict: 1,
      undeclared: 1,
    },
    vulnerabilitySummary: {
      total: 4,
      high: 0,
      medium: 2,
      low: 2,
    },
    poisoningSummary: {
      tasks: 8,
      malicious: 1,
      benign: 7,
      suspicious: 0,
    },
  },
  'repo-tensorflow': {
    name: 'TensorFlow',
    licenseSummary: {
      total: 30,
      compatible: 26,
      conflict: 3,
      undeclared: 1,
    },
    vulnerabilitySummary: {
      total: 10,
      high: 2,
      medium: 4,
      low: 4,
    },
    poisoningSummary: {
      tasks: 25,
      malicious: 3,
      benign: 22,
      suspicious: 0,
    },
  },
  'repo-deepseek-v3': {
    name: 'DeepSeek V3',
    licenseSummary: {
      total: 14,
      compatible: 12,
      conflict: 1,
      undeclared: 1,
    },
    vulnerabilitySummary: {
      total: 6,
      high: 1,
      medium: 2,
      low: 3,
    },
    poisoningSummary: {
      tasks: 12,
      malicious: 1,
      benign: 11,
      suspicious: 0,
    },
  },
  'repo-mistral-inference': {
    name: 'Mistral Inference',
    licenseSummary: {
      total: 20,
      compatible: 17,
      conflict: 2,
      undeclared: 1,
    },
    vulnerabilitySummary: {
      total: 9,
      high: 2,
      medium: 3,
      low: 4,
    },
    poisoningSummary: {
      tasks: 18,
      malicious: 2,
      benign: 16,
      suspicious: 0,
    },
  },
};

interface Props {
  params: {
    repo: string;
  };
}

export default function CodeRiskDetailPage({ params }: Props) {
  const router = useRouter();
  const [scanResult, setScanResult] = useState({
    licenseSummary: {
      total: 0,
      compatible: 0,
      conflict: 0,
      undeclared: 0,
    },
    vulnerabilitySummary: {
      total: 0,
      high: 0,
      medium: 0,
      low: 0,
    },
    poisoningSummary: {
      tasks: 0,
      malicious: 0,
      benign: 0,
      suspicious: 0,
    },
  });

  const repo = params.repo as string;

  useEffect(() => {
    async function fetchData() {
      try {
        // 使用真实数据加载器获取数据
        const [licenseData, vulnerabilityData, poisonData] = await Promise.all([
          loadLicenseData(repo),
          loadVulnerabilityData(repo),
          loadPoisonData(repo)
        ]);

        // 设置扫描结果
        setScanResult({
          licenseSummary: licenseData?.summary || { total: 0, compatible: 0, conflict: 0, undeclared: 0 },
          vulnerabilitySummary: vulnerabilityData?.summary ? {
            total: vulnerabilityData.summary.total_vulnerabilities,
            high: vulnerabilityData.summary.high,
            medium: vulnerabilityData.summary.medium,
            low: vulnerabilityData.summary.low
          } : { total: 0, high: 0, medium: 0, low: 0 },
          poisoningSummary: poisonData?.summary ? {
            tasks: poisonData.summary.total,
            malicious: poisonData.summary.malicious,
            benign: poisonData.summary.benign,
            suspicious: poisonData.summary.suspicious
          } : { tasks: 0, malicious: 0, benign: 0, suspicious: 0 },
        });
      } catch (error) {
        console.error('Error loading data:', error);
        // 如果加载失败，使用空数据作为备用
        setScanResult({
          licenseSummary: { total: 0, compatible: 0, conflict: 0, undeclared: 0 },
          vulnerabilitySummary: { total: 0, high: 0, medium: 0, low: 0 },
          poisoningSummary: { tasks: 0, malicious: 0, benign: 0, suspicious: 0 },
        });
      }
    }

    fetchData();
  }, [repo]);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
              ← 返回
            </button>
            <button
              onClick={() => router.push('/home')}
              className="text-[var(--primary)] hover:text-[var(--primary)]/80 transition-colors"
            >
              🏠 返回首页
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gradient">
                代码风险检测 - {repoDataMap[repo]?.name || repo}
              </h1>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">全面的代码安全风险评估</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Overview Section */}
        <div className="mb-8">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">风险概览</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{scanResult.licenseSummary.total}</div>
                <div className="text-sm text-[var(--muted-foreground)]">许可证总数</div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{scanResult.vulnerabilitySummary.total}</div>
                <div className="text-sm text-[var(--muted-foreground)]">安全漏洞</div>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{scanResult.poisoningSummary.tasks}</div>
                <div className="text-sm text-[var(--muted-foreground)]">投毒风险</div>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Detection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
          <ModuleEntryCard
            title="许可证合规性检测"
            description={`${scanResult.licenseSummary.total} 个许可证`}
            icon="📜"
            href={`/license/${repo}`}
            data={{
              compatible: scanResult.licenseSummary.compatible,
              conflict: scanResult.licenseSummary.conflict,
              undeclared: scanResult.licenseSummary.undeclared,
            }}
            chartType="donut"
          />

          <ModuleEntryCard
            title="漏洞检测"
            description={`${scanResult.vulnerabilitySummary.total} 个漏洞`}
            icon="🛡️"
            href={`/vulnerability/${repo}`}
            data={{
              high: scanResult.vulnerabilitySummary.high,
              medium: scanResult.vulnerabilitySummary.medium,
              low: scanResult.vulnerabilitySummary.low,
            }}
            chartType="radar"
          />

          <ModuleEntryCard
            title="投毒风险检测"
            description={`${scanResult.poisoningSummary.tasks} 个任务`}
            icon="⚠️"
            href={`/poison/${repo}`}
            data={{
              tasks: scanResult.poisoningSummary.tasks,
              malicious: scanResult.poisoningSummary.malicious,
              benign: scanResult.poisoningSummary.benign,
            }}
            chartType="line"
          />
        </div>

        {/* Detailed Analysis Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="text-2xl">📜</span>
              许可证合规性检测
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-4">
              自动检测项目中的许可证使用情况，识别许可证冲突和未声明的许可证，确保项目符合开源许可证合规要求。
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>兼容许可证</span>
                <span className="text-green-600">{scanResult.licenseSummary.compatible}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>冲突许可证</span>
                <span className="text-orange-600">{scanResult.licenseSummary.conflict}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>未声明许可证</span>
                <span className="text-red-600">{scanResult.licenseSummary.undeclared}</span>
              </div>
            </div>
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="text-2xl">🛡️</span>
              漏洞检测
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-4">
              实时对接 CVE 漏洞数据库，精准识别组件中的安全漏洞，提供详细的漏洞描述和修复建议。
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>高危漏洞</span>
                <span className="text-red-600">{scanResult.vulnerabilitySummary.high}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>中危漏洞</span>
                <span className="text-orange-600">{scanResult.vulnerabilitySummary.medium}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>低危漏洞</span>
                <span className="text-yellow-600">{scanResult.vulnerabilitySummary.low}</span>
              </div>
            </div>
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              投毒风险监测
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-4">
              监控依赖包的投毒风险，及时发现恶意代码注入，保障软件供应链的安全性。
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>检测任务</span>
                <span>{scanResult.poisoningSummary.tasks}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>恶意包</span>
                <span className="text-red-600">{scanResult.poisoningSummary.malicious}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>安全包</span>
                <span className="text-green-600">{scanResult.poisoningSummary.benign}</span>
              </div>
            </div>
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="text-2xl">📊</span>
              风险分析报告
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-4">
              生成全面的代码风险分析报告，包含详细的检测结果、风险评估和建议措施。
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>总体风险等级</span>
                <span className="text-orange-600">中风险</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>检测完成时间</span>
                <span>2024-01-01 12:00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>报告生成</span>
                <button className="text-blue-600 hover:text-blue-700">下载报告</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}