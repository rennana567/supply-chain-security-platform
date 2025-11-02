'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RepoSearchInput } from '@/components/RepoSearchInput';
import { RepoChart } from '@/components/RepoChart';
import { getRepoData, type RepoAnalysisData } from '@/data/mockRepoData';

export default function RepoAnalysisPage() {
  const router = useRouter();
  const [repoUrl, setRepoUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [repoData, setRepoData] = useState<RepoAnalysisData | null>(null);
  const [error, setError] = useState<string>('');

  const handleAnalyze = async () => {
    if (!repoUrl.trim()) {
      setError('请输入仓库URL');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    // TODO: 后续需要替换为真实的后端API调用
    // 目前使用模拟数据
    setTimeout(() => {
      const data = getRepoData(repoUrl);
      if (data) {
        setRepoData(data);
      } else {
        setError('未找到该仓库的数据，请检查URL是否正确');
      }
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleRepoSelect = (selectedRepoUrl: string) => {
    setRepoUrl(selectedRepoUrl);
    // 自动开始分析
    setTimeout(() => {
      handleAnalyze();
    }, 100);
  };

  const handleExportReport = () => {
    alert('导出分析报告功能开发中...');
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/developer')}
              className="text-[var(--primary)] hover:text-[var(--primary)]/80 transition-colors"
            >
              ← 返回
            </button>
            <button
              onClick={() => router.push('/home')}
              className="text-[#10b981] hover:text-[#34d399] transition-colors"
            >
              🏠 返回首页
            </button>
            <h1 className="text-2xl font-bold text-gradient">仓库数据分析</h1>
          </div>
          <div className="flex items-center gap-2">
            {repoData && (
              <button
                onClick={handleExportReport}
                className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white rounded-lg transition-all glow-hover"
              >
                导出分析报告
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Input Section */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 mb-8 card-gradient">
          <h2 className="text-lg font-semibold mb-4">GitHub 仓库数据分析</h2>

          <div className="mb-4">
            <RepoSearchInput
              value={repoUrl}
              onChange={setRepoUrl}
              onSelect={handleRepoSelect}
              placeholder="输入仓库名称或 URL (例如: llama)"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-4 items-center">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !repoUrl.trim()}
              className="px-6 py-3 bg-[var(--primary)] hover:bg-[var(--primary)]/90 disabled:bg-[var(--muted-foreground)]/50 text-white rounded-lg font-semibold transition-all glow-hover disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  分析中...
                </span>
              ) : (
                '开始分析'
              )}
            </button>

            {repoData && (
              <span className="text-sm text-[var(--muted-foreground)]">
                可导出分析报告
              </span>
            )}
          </div>
        </div>

        {isAnalyzing && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[var(--primary)] mb-4"></div>
            <p className="text-xl text-[var(--muted-foreground)]">正在分析仓库数据...</p>
          </div>
        )}

        {repoData && (
          <div className="space-y-8">
            {/* Summary Card */}
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 card-gradient">
              <h2 className="text-2xl font-bold mb-6">{repoData.repoName} - 仓库概览</h2>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                <div className="text-center p-4 bg-[var(--input)] rounded-lg">
                  <div className="text-sm text-[var(--muted-foreground)] mb-2">总提交数</div>
                  <div className="text-2xl font-bold text-[var(--primary)]">
                    {repoData.summary.totalCommits.toLocaleString()}
                  </div>
                </div>

                <div className="text-center p-4 bg-[var(--input)] rounded-lg">
                  <div className="text-sm text-[var(--muted-foreground)] mb-2">贡献者数</div>
                  <div className="text-2xl font-bold text-green-400">
                    {repoData.summary.totalContributors.toLocaleString()}
                  </div>
                </div>

                <div className="text-center p-4 bg-[var(--input)] rounded-lg">
                  <div className="text-sm text-[var(--muted-foreground)] mb-2">主要语言</div>
                  <div className="text-2xl font-bold text-yellow-400">
                    {repoData.summary.mainLanguage}
                  </div>
                </div>

                <div className="text-center p-4 bg-[var(--input)] rounded-lg">
                  <div className="text-sm text-[var(--muted-foreground)] mb-2">最后更新</div>
                  <div className="text-xl font-bold text-purple-400">
                    {repoData.summary.lastUpdated}
                  </div>
                </div>

                <div className="text-center p-4 bg-[var(--input)] rounded-lg">
                  <div className="text-sm text-[var(--muted-foreground)] mb-2">健康指数</div>
                  <div className="text-2xl font-bold text-cyan-400">
                    {repoData.summary.healthScore}
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Commit Trend Chart */}
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">提交趋势</h3>
                <RepoChart metric={repoData.metrics.commitTrend} height={300} />
              </div>

              {/* Growth Rate Chart */}
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">增长率趋势</h3>
                <RepoChart metric={repoData.metrics.growthRate} height={300} />
              </div>

              {/* Contributor Activity Chart */}
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">贡献者活跃度</h3>
                <RepoChart metric={repoData.metrics.contributorActivity} height={300} />
              </div>

              {/* Language Distribution Chart */}
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">语言分布</h3>
                <RepoChart metric={repoData.metrics.languageDistribution} height={300} />
              </div>
            </div>

            {/* Data Source Notice */}
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-yellow-400 text-xl">ℹ️</div>
                <div>
                  <h4 className="font-semibold text-yellow-400 mb-2">数据来源说明</h4>
                  <p className="text-sm text-yellow-300/80">
                    当前展示的是模拟数据。后续需要集成真实的后端API来获取GitHub仓库的实际数据。
                    真实数据将包括：提交历史、贡献者信息、语言统计、PR活动等详细指标。
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!repoData && !isAnalyzing && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-bold mb-4">GitHub 仓库数据分析</h3>
            <p className="text-lg text-[var(--muted-foreground)] mb-8">
              输入GitHub仓库URL或名称，查看详细的开发活动数据可视化分析
            </p>

            <div className="max-w-2xl mx-auto bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
              <h4 className="font-semibold mb-3">支持分析的指标：</h4>
              <div className="grid grid-cols-2 gap-4 text-sm text-[var(--muted-foreground)]">
                <div className="flex items-center gap-2">
                  <span className="text-[var(--primary)]">✓</span>
                  <span>提交趋势分析</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[var(--primary)]">✓</span>
                  <span>增长率统计</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[var(--primary)]">✓</span>
                  <span>贡献者活跃度</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[var(--primary)]">✓</span>
                  <span>语言分布</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[var(--primary)]">✓</span>
                  <span>仓库健康度</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[var(--primary)]">✓</span>
                  <span>开发周期分析</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}