'use client';

import { RepoChart } from '@/components/RepoChart';
import { MOCK_REPO_DATA } from '@/data/mockRepoData';

export default function TestRepoChartPage() {
  const testData = MOCK_REPO_DATA['https://github.com/pytorch/pytorch'];

  return (
    <div className="min-h-screen bg-[var(--background)] p-8">
      <h1 className="text-2xl font-bold mb-8">测试仓库图表组件</h1>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">提交趋势</h3>
          <RepoChart metric={testData.metrics.commitTrend} height={300} />
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">增长率</h3>
          <RepoChart metric={testData.metrics.growthRate} height={300} />
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">贡献者活跃度</h3>
          <RepoChart metric={testData.metrics.contributorActivity} height={300} />
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">语言分布</h3>
          <RepoChart metric={testData.metrics.languageDistribution} height={300} />
        </div>
      </div>
    </div>
  );
}