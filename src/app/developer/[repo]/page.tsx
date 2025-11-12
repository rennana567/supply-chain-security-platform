'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { GitHubLineChart } from '@/components/GitHubLineChart';
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { MOCK_COMMUNITY_CHART_DATA } from '@/data/mockDeveloperData';

interface CommunityProfile {
  repoUrl: string;
  logo?: string;
  basicInfo: {
    repoCount: number;
    developerCount: number;
    activeCycle: string;
    languageDistribution: Record<string, number>;
    totalStars: number;
    totalForks: number;
  };
  ovaOverview: {
    observation: number;
    value: number;
    action: number;
    systemHealthIndex: number;
  };
  indicators: Array<{
    name: string;
    value: number;
    max: number;
  }>;
}

const COLORS = ['#5b8def', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

// 模拟数据映射 - 基于10个确定的repo
interface RepoDeveloperData {
  name: string;
  profile: CommunityProfile;
}

const repoDataMap: Record<string, RepoDeveloperData> = {
  'repo-pytorch': {
    name: 'PyTorch',
    profile: {
      repoUrl: 'https://github.com/pytorch/pytorch',
      basicInfo: {
        repoCount: 45,
        developerCount: 128,
        activeCycle: '2020-2024',
        languageDistribution: {
          'JavaScript': 35,
          'TypeScript': 25,
          'Python': 20,
          'Go': 15,
          'Other': 5,
        },
        totalStars: 12500,
        totalForks: 3200,
      },
      ovaOverview: {
        observation: 85,
        value: 78,
        action: 82,
        systemHealthIndex: 82,
      },
      indicators: [
        { name: '代码质量', value: 85, max: 100 },
        { name: '社区活跃度', value: 78, max: 100 },
        { name: '文档完整性', value: 72, max: 100 },
        { name: '响应速度', value: 88, max: 100 },
        { name: '安全性', value: 90, max: 100 },
        { name: '可维护性', value: 80, max: 100 },
      ],
    }
  },
  'repo-llama': {
    name: 'Meta Llama',
    profile: {
      repoUrl: 'https://github.com/meta-llama/llama',
      basicInfo: {
        repoCount: 32,
        developerCount: 95,
        activeCycle: '2021-2024',
        languageDistribution: {
          'Python': 40,
          'JavaScript': 25,
          'TypeScript': 20,
          'C++': 10,
          'Other': 5,
        },
        totalStars: 8900,
        totalForks: 2100,
      },
      ovaOverview: {
        observation: 88,
        value: 85,
        action: 79,
        systemHealthIndex: 84,
      },
      indicators: [
        { name: '代码质量', value: 88, max: 100 },
        { name: '社区活跃度', value: 85, max: 100 },
        { name: '文档完整性', value: 75, max: 100 },
        { name: '响应速度', value: 82, max: 100 },
        { name: '安全性', value: 92, max: 100 },
        { name: '可维护性', value: 78, max: 100 },
      ],
    }
  },
  'repo-tensorflow': {
    name: 'TensorFlow',
    profile: {
      repoUrl: 'https://github.com/tensorflow/tensorflow',
      basicInfo: {
        repoCount: 68,
        developerCount: 156,
        activeCycle: '2019-2024',
        languageDistribution: {
          'Python': 45,
          'C++': 25,
          'JavaScript': 15,
          'Go': 10,
          'Other': 5,
        },
        totalStars: 17800,
        totalForks: 4500,
      },
      ovaOverview: {
        observation: 82,
        value: 80,
        action: 85,
        systemHealthIndex: 82,
      },
      indicators: [
        { name: '代码质量', value: 82, max: 100 },
        { name: '社区活跃度', value: 80, max: 100 },
        { name: '文档完整性', value: 78, max: 100 },
        { name: '响应速度', value: 85, max: 100 },
        { name: '安全性', value: 88, max: 100 },
        { name: '可维护性', value: 76, max: 100 },
      ],
    }
  },
  'repo-deepseek-v3': {
    name: 'DeepSeek V3',
    profile: {
      repoUrl: 'https://github.com/deepseek-ai/DeepSeek-V3',
      basicInfo: {
        repoCount: 28,
        developerCount: 82,
        activeCycle: '2022-2024',
        languageDistribution: {
          'Python': 50,
          'JavaScript': 20,
          'TypeScript': 15,
          'C++': 10,
          'Other': 5,
        },
        totalStars: 7500,
        totalForks: 1800,
      },
      ovaOverview: {
        observation: 90,
        value: 88,
        action: 84,
        systemHealthIndex: 87,
      },
      indicators: [
        { name: '代码质量', value: 90, max: 100 },
        { name: '社区活跃度', value: 88, max: 100 },
        { name: '文档完整性', value: 80, max: 100 },
        { name: '响应速度', value: 86, max: 100 },
        { name: '安全性', value: 94, max: 100 },
        { name: '可维护性', value: 82, max: 100 },
      ],
    }
  },
  'repo-mistral-inference': {
    name: 'Mistral Inference',
    profile: {
      repoUrl: 'https://github.com/mistralai/mistral-inference',
      basicInfo: {
        repoCount: 22,
        developerCount: 65,
        activeCycle: '2023-2024',
        languageDistribution: {
          'Python': 55,
          'JavaScript': 18,
          'TypeScript': 12,
          'Rust': 10,
          'Other': 5,
        },
        totalStars: 5200,
        totalForks: 1200,
      },
      ovaOverview: {
        observation: 87,
        value: 83,
        action: 81,
        systemHealthIndex: 84,
      },
      indicators: [
        { name: '代码质量', value: 87, max: 100 },
        { name: '社区活跃度', value: 83, max: 100 },
        { name: '文档完整性', value: 78, max: 100 },
        { name: '响应速度', value: 85, max: 100 },
        { name: '安全性', value: 91, max: 100 },
        { name: '可维护性', value: 80, max: 100 },
      ],
    }
  },
};

interface Props {
  params: Promise<{
    repo: string;
  }>;
}

export default function DeveloperCommunityPage({ params }: Props) {
  const router = useRouter();
  const [profile, setProfile] = useState<CommunityProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const resolvedParams = use(params);
  const repo = resolvedParams.repo;

  useEffect(() => {
    // 根据repo参数获取数据
    const repoData = repoDataMap[repo];

    if (repoData) {
      setProfile(repoData.profile);
    } else {
      // 如果没有找到数据，使用默认数据
      const defaultData = repoDataMap['repo-pytorch'];
      setProfile(defaultData.profile);
    }

    setLoading(false);
  }, [repo]);

  const languageData = profile ? Object.entries(profile.basicInfo.languageDistribution).map(([name, value]) => ({
    name,
    value,
  })) : [];

  const handleExportReport = () => {
    alert('导出治理报告PDF功能开发中...');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#151b2e] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#5b8def] mb-4"></div>
          <p className="text-xl text-[#94a3b8]">加载开发者数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#151b2e] text-white">
      {/* Header */}
      <header className="border-b border-[#1e293b] bg-[#151b2e]/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="text-[#5b8def] hover:text-[#5b8def]/80 transition-colors"
            >
              ← 返回
            </button>
            <button
              onClick={() => router.push('/home')}
              className="text-[#10b981] hover:text-[#34d399] transition-colors"
            >
              🏠 返回首页
            </button>
            <h1 className="text-2xl font-bold text-gradient">
              社区与生态治理 - {repoDataMap[repo]?.name || repo}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportReport}
              className="px-4 py-2 bg-[#5b8def] hover:bg-[#5b8def]/90 rounded-lg transition-all glow-hover"
            >
              可导出[治理报告.pdf]
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="bg-[#151b2e] border border-[#1e293b] rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="搜索开发者或指标..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-[#0a0e1a] border border-[#1e293b] rounded-lg text-white placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#5b8def]"
              />
            </div>
          </div>
        </div>

        {profile && (
          <div className="space-y-6">
            {/* Top Overview Row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Basic Info Card */}
              <div className="bg-[#151b2e] border border-[#1e293b] rounded-2xl p-6 card-gradient flex flex-col gap-6">
                <div className="h-32 rounded-xl bg-[#0a0e1a] flex items-center justify-center border border-[#1e293b]/60">
                  <span className="text-[#94a3b8]">Logo</span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#94a3b8]">仓库数</span>
                    <span className="font-semibold text-white">{profile.basicInfo.repoCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94a3b8]">开发者数</span>
                    <span className="font-semibold text-white">{profile.basicInfo.developerCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94a3b8]">活跃周期</span>
                    <span className="font-semibold text-white">{profile.basicInfo.activeCycle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94a3b8]">Star / Fork</span>
                    <span className="font-semibold text-white">{profile.basicInfo.totalStars} / {profile.basicInfo.totalForks}</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#94a3b8] mb-2">语言分布</div>
                  <div className="bg-[#0a0e1a] rounded-xl border border-[#1e293b] p-4">
                    <ResponsiveContainer width="100%" height={160}>
                      <PieChart>
                        <Pie
                          data={languageData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}%`}
                          outerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {languageData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#0a0e1a',
                            borderRadius: '8px',
                            border: '1px solid #1e293b',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* OVA Overview */}
              <div className="xl:col-span-2 bg-[#151b2e] border border-[#1e293b] rounded-2xl p-8 card-gradient flex flex-col">
                <h3 className="text-lg font-semibold mb-2">OVA总体概览情况</h3>
                <p className="text-xs text-[#94a3b8] mb-6">Observation · Value · Action · 综合健康指数</p>
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="relative w-full max-w-[360px] h-[360px] mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-[#5b8def] bg-[#20315b]/30 flex flex-col items-center justify-center">
                      <span className="text-sm font-semibold text-[#5b8def]">Observation</span>
                      <span className="text-2xl font-bold text-[#5b8def]">{profile.ovaOverview.observation}</span>
                    </div>
                    <div className="absolute inset-[40px] rounded-full border-4 border-[#10b981] bg-[#133a2e] flex flex-col items-center justify-center">
                      <span className="text-sm font-semibold text-green-400">Value</span>
                      <span className="text-2xl font-bold text-green-400">{profile.ovaOverview.value}</span>
                    </div>
                    <div className="absolute inset-[80px] rounded-full border-4 border-[#f59e0b] bg-[#3e2d15] flex flex-col items-center justify-center">
                      <span className="text-sm font-semibold text-yellow-400">Action</span>
                      <span className="text-2xl font-bold text-yellow-400">{profile.ovaOverview.action}</span>
                    </div>
                    <div className="absolute inset-[125px] rounded-full bg-gradient-to-br from-[#5b8def] via-[#38bdf8] to-[#10b981] shadow-xl flex flex-col items-center justify-center">
                      <div className="text-sm text-white/70">健康指数</div>
                      <div className="text-3xl font-bold text-white">{profile.ovaOverview.systemHealthIndex}</div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="bg-[#0a0e1a] rounded-lg p-4 text-center border border-[#1e293b]/60">
                    <div className="text-xs text-[#94a3b8] mb-1">观察</div>
                    <div className="text-xl font-bold text-[#5b8def]">{profile.ovaOverview.observation}</div>
                  </div>
                  <div className="bg-[#0a0e1a] rounded-lg p-4 text-center border border-[#1e293b]/60">
                    <div className="text-xs text-[#94a3b8] mb-1">价值</div>
                    <div className="text-xl font-bold text-green-400">{profile.ovaOverview.value}</div>
                  </div>
                  <div className="bg-[#0a0e1a] rounded-lg p-4 text-center border border-[#1e293b]/60">
                    <div className="text-xs text-[#94a3b8] mb-1">行动</div>
                    <div className="text-xl font-bold text-yellow-400">{profile.ovaOverview.action}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Radar & Indicator Detail Row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-[#151b2e] border border-[#1e293b] rounded-2xl p-6 card-gradient">
                <h3 className="text-lg font-semibold mb-4">OVA具体模型分块 ——— 指标展示</h3>
                <ResponsiveContainer width="100%" height={380}>
                  <RadarChart data={profile.indicators}>
                    <PolarGrid stroke="#ffffff" />
                    <PolarAngleAxis dataKey="name" tick={{ fill: '#ffffff', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#ffffff', fontSize: 10 }} stroke="#ffffff" />
                    <Radar
                      name="指标值"
                      dataKey="value"
                      stroke="#5b8def"
                      fill="#5b8def"
                      fillOpacity={0.5}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0a0e1a',
                        border: '1px solid #1e293b',
                        borderRadius: '8px',
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-[#151b2e] border border-[#1e293b] rounded-2xl p-6 card-gradient">
                <h3 className="text-lg font-semibold mb-4">详细指标</h3>
                <div className="space-y-4">
                  {profile.indicators.map((indicator, index) => (
                    <div key={index} className="bg-[#0a0e1a] rounded-xl border border-[#1e293b]/60 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm font-semibold text-white">{indicator.name}</div>
                        <div className="text-sm font-bold text-[#5b8def]">{indicator.value} / {indicator.max}</div>
                      </div>
                      <div className="relative h-2 rounded-full bg-[#151b2e] overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#5b8def] via-[#60a5fa] to-[#38bdf8]"
                          style={{ width: `${(indicator.value / indicator.max) * 100}%` }}
                        ></div>
                      </div>
                      <div className="mt-2 text-right text-xs text-[#94a3b8]">
                        {Math.round((indicator.value / indicator.max) * 100)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Activity & Collaboration Models */}
            <div className="space-y-6">
              <div className="bg-[#151b2e] border border-[#1e293b] rounded-2xl p-6 card-gradient">
                <h3 className="text-lg font-semibold mb-4">活跃度模型</h3>
                <p className="text-xs text-[#94a3b8] mb-4">年度提交量趋势（Commit Trend per Month）</p>
                <GitHubLineChart data={MOCK_COMMUNITY_CHART_DATA.commitTrend} height={260} />
              </div>
              <div className="bg-[#151b2e] border border-[#1e293b] rounded-2xl p-6 card-gradient">
                <h3 className="text-lg font-semibold mb-4">协作性模型</h3>
                <p className="text-xs text-[#94a3b8] mb-4">贡献者交互趋势（Commit Trend per Month）</p>
                <GitHubLineChart data={MOCK_COMMUNITY_CHART_DATA.growthRate} height={260} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}