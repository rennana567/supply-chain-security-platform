'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RepoInput } from '@/components/RepoInput';
import { ScanButton } from '@/components/ScanButton';
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

export default function CommunityDeveloperPage() {
  const router = useRouter();
  const [repoUrl, setRepoUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [inputSource, setInputSource] = useState<'url' | 'library'>('url');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [profile, setProfile] = useState<CommunityProfile | null>(null);

  const handleAnalyze = async () => {
    if (!repoUrl && !selectedFile && inputSource === 'url') {
      alert('请提供URL或上传文件');
      return;
    }

    setIsAnalyzing(true);
    
    // TODO: 替换为真实 API 调用
    setTimeout(() => {
      const mockProfile: CommunityProfile = {
        repoUrl: repoUrl || 'https://github.com/example/community',
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
      };
      setProfile(mockProfile);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleExportReport = () => {
    alert('导出治理报告PDF功能开发中...');
  };

  const languageData = profile ? Object.entries(profile.basicInfo.languageDistribution).map(([name, value]) => ({
    name,
    value,
  })) : [];

  return (
    <div className="min-h-screen bg-[#151b2e] text-white">
      {/* Header */}
      <header className="border-b border-[#1e293b] bg-[#151b2e]/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/developer')}
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
            <h1 className="text-2xl font-bold text-gradient">社区与生态治理页面</h1>
          </div>
          <div className="flex items-center gap-2">
            {profile && (
              <button
                onClick={handleExportReport}
                className="px-4 py-2 bg-[#5b8def] hover:bg-[#5b8def]/90 rounded-lg transition-all glow-hover"
              >
                可导出[治理报告.pdf]
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Input Section */}
        <div className="bg-[#151b2e] border border-[#1e293b] rounded-lg p-6 mb-8 card-gradient">
          <h2 className="text-lg font-semibold mb-4">社区与生态治理页面，选择输入来源：</h2>
          
          <div className="mb-4">
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setInputSource('url')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  inputSource === 'url'
                    ? 'bg-[#5b8def] text-white'
                    : 'bg-[#0a0e1a] border border-[#1e293b]'
                }`}
              >
                提供url (repo/社区/...)
              </button>
              <button
                onClick={() => setInputSource('library')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  inputSource === 'library'
                    ? 'bg-[#5b8def] text-white'
                    : 'bg-[#0a0e1a] border border-[#1e293b]'
                }`}
              >
                内部库选择
              </button>
            </div>

            {inputSource === 'url' && (
              <RepoInput
                value={repoUrl}
                onChange={setRepoUrl}
                onFileSelect={setSelectedFile}
                placeholder="提供url (repo/社区/...)"
                showFileUpload={true}
              />
            )}

            {inputSource === 'library' && (
              <div className="text-center py-8 border-2 border-dashed border-[#1e293b] rounded-lg">
                <p className="text-[#94a3b8]">内部库选择功能开发中...</p>
              </div>
            )}
          </div>

          <div className="flex gap-4 items-center">
            <ScanButton onClick={handleAnalyze} isLoading={isAnalyzing} />
            {profile && (
              <span className="text-sm text-[#94a3b8]">
                可导出[治理报告.pdf]
              </span>
            )}
          </div>
        </div>

        {isAnalyzing && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#5b8def] mb-4"></div>
            <p className="text-xl text-[#94a3b8]">正在分析中...</p>
          </div>
        )}

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

        {!profile && !isAnalyzing && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">👥</div>
            <p className="text-xl text-[#94a3b8]">输入社区URL或上传文件开始分析</p>
          </div>
        )}
      </main>
    </div>
  );
}

