'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ModuleEntryCard } from '@/components/ModuleEntryCard';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function CodeRiskPage() {
  const [scanResult] = useState({
    licenseSummary: {
      total: 12,
      compatible: 10,
      conflict: 2,
      undeclared: 0,
    },
    vulnerabilitySummary: {
      total: 5,
      high: 1,
      medium: 2,
      low: 2,
    },
    poisoningSummary: {
      tasks: 8,
      malicious: 6,
      benign: 119,
    },
  });

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
              <h1 className="text-2xl font-bold text-gradient">代码风险检测</h1>
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
            href="/license"
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
            href="/vulnerability"
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
            href="/poison"
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