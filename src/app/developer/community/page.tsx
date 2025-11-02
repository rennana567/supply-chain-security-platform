'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RepoInput } from '@/components/RepoInput';
import { ScanButton } from '@/components/ScanButton';
import { GitHubLineChart } from '@/components/GitHubLineChart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
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
            <h1 className="text-2xl font-bold text-gradient">社区与生态治理页面</h1>
          </div>
          <div className="flex items-center gap-2">
            {profile && (
              <button
                onClick={handleExportReport}
                className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary)]/90 rounded-lg transition-all glow-hover"
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
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 mb-8 card-gradient">
          <h2 className="text-lg font-semibold mb-4">社区与生态治理页面，选择输入来源：</h2>
          
          <div className="mb-4">
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setInputSource('url')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  inputSource === 'url'
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-[var(--input)] border border-[var(--border)]'
                }`}
              >
                提供url (repo/社区/...)
              </button>
              <button
                onClick={() => setInputSource('library')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  inputSource === 'library'
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-[var(--input)] border border-[var(--border)]'
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
              <div className="text-center py-8 border-2 border-dashed border-[var(--border)] rounded-lg">
                <p className="text-[var(--muted-foreground)]">内部库选择功能开发中...</p>
              </div>
            )}
          </div>

          <div className="flex gap-4 items-center">
            <ScanButton onClick={handleAnalyze} isLoading={isAnalyzing} />
            {profile && (
              <span className="text-sm text-[var(--muted-foreground)]">
                可导出[治理报告.pdf]
              </span>
            )}
          </div>
        </div>

        {isAnalyzing && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[var(--primary)] mb-4"></div>
            <p className="text-xl text-[var(--muted-foreground)]">正在分析中...</p>
          </div>
        )}

        {profile && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel */}
            <div className="space-y-6">
              {/* Logo */}
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 card-gradient">
                <div className="w-full h-32 bg-[var(--input)] rounded-lg flex items-center justify-center">
                  <span className="text-[var(--muted-foreground)]">Logo</span>
                </div>
              </div>

              {/* Basic Info Card */}
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 card-gradient">
                <h3 className="text-lg font-semibold mb-4">基础信息卡</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--muted-foreground)]">仓库数:</span>
                    <span className="font-semibold">{profile.basicInfo.repoCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted-foreground)]">开发者数:</span>
                    <span className="font-semibold">{profile.basicInfo.developerCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted-foreground)]">活跃周期:</span>
                    <span className="font-semibold">{profile.basicInfo.activeCycle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted-foreground)]">Star/Fork总量:</span>
                    <span className="font-semibold">{profile.basicInfo.totalStars} / {profile.basicInfo.totalForks}</span>
                  </div>
                  <div className="mt-4">
                    <div className="text-[var(--muted-foreground)] mb-2">语言分布:</div>
                    <ResponsiveContainer width="100%" height={150}>
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
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - OVA Model */}
            <div className="lg:col-span-2 space-y-6">
              {/* Community GitHub Charts */}
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 card-gradient">
                <h3 className="text-lg font-semibold mb-4">社区 GitHub 数据趋势分析</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-md font-semibold mb-3">提交趋势对比</h4>
                    <GitHubLineChart data={MOCK_COMMUNITY_CHART_DATA.commitTrend} height={250} />
                  </div>
                  <div>
                    <h4 className="text-md font-semibold mb-3">增长率对比</h4>
                    <GitHubLineChart data={MOCK_COMMUNITY_CHART_DATA.growthRate} height={250} />
                  </div>
                </div>
              </div>

              {/* OVA Overview */}
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 card-gradient">
                <h3 className="text-lg font-semibold mb-4">OVA总体概览情况</h3>
                <div className="flex flex-col items-center py-8">
                  {/* Concentric Circles representing OVA Model */}
                  <div className="relative w-80 h-80 flex items-center justify-center mb-8">
                    {/* Observation Circle (Outermost) */}
                    <div 
                      className="absolute rounded-full border-4 flex flex-col items-center justify-center bg-[var(--primary)]/10"
                      style={{
                        width: '320px',
                        height: '320px',
                        borderColor: '#5b8def',
                      }}
                    >
                      <span className="text-sm font-semibold text-[var(--primary)]">Observation</span>
                      <span className="text-lg font-bold text-[var(--primary)]">{profile.ovaOverview.observation}</span>
                    </div>
                    
                    {/* Value Circle (Middle) */}
                    <div 
                      className="absolute rounded-full border-4 flex flex-col items-center justify-center bg-green-500/10"
                      style={{
                        width: '240px',
                        height: '240px',
                        borderColor: '#10b981',
                      }}
                    >
                      <span className="text-sm font-semibold text-green-400">Value</span>
                      <span className="text-lg font-bold text-green-400">{profile.ovaOverview.value}</span>
                    </div>
                    
                    {/* Action Circle (Inner) */}
                    <div 
                      className="absolute rounded-full border-4 flex flex-col items-center justify-center bg-yellow-500/10"
                      style={{
                        width: '160px',
                        height: '160px',
                        borderColor: '#f59e0b',
                      }}
                    >
                      <span className="text-sm font-semibold text-yellow-400">Action</span>
                      <span className="text-lg font-bold text-yellow-400">{profile.ovaOverview.action}</span>
                    </div>
                    
                    {/* System Health Index (Center) */}
                    <div 
                      className="absolute rounded-full bg-gradient-to-br from-[var(--primary)] to-green-400 flex flex-col items-center justify-center shadow-lg z-10"
                      style={{
                        width: '80px',
                        height: '80px',
                      }}
                    >
                      <div className="text-center text-white">
                        <div className="text-xl font-bold">{profile.ovaOverview.systemHealthIndex}</div>
                        <div className="text-xs">健康指数</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="grid grid-cols-3 gap-6 w-full max-w-2xl">
                    <div className="text-center p-3 bg-[var(--input)] rounded-lg">
                      <div className="text-sm text-[var(--muted-foreground)] mb-1">观察</div>
                      <div className="text-lg font-bold text-[var(--primary)]">{profile.ovaOverview.observation}</div>
                    </div>
                    <div className="text-center p-3 bg-[var(--input)] rounded-lg">
                      <div className="text-sm text-[var(--muted-foreground)] mb-1">价值</div>
                      <div className="text-lg font-bold text-green-400">{profile.ovaOverview.value}</div>
                    </div>
                    <div className="text-center p-3 bg-[var(--input)] rounded-lg">
                      <div className="text-sm text-[var(--muted-foreground)] mb-1">行动</div>
                      <div className="text-lg font-bold text-yellow-400">{profile.ovaOverview.action}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* OVA Indicators Display */}
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 card-gradient">
                <h3 className="text-lg font-semibold mb-4">OVA具体模型分块 ——— 指标展示</h3>
                
                {/* Radar Chart */}
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={profile.indicators}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} />
                    <Radar
                      name="指标值"
                      dataKey="value"
                      stroke="var(--primary)"
                      fill="var(--primary)"
                      fillOpacity={0.6}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>

                {/* Indicator Details */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {profile.indicators.map((indicator, index) => (
                    <div key={index} className="p-4 bg-[var(--input)] rounded-lg">
                      <div className="text-sm text-[var(--muted-foreground)] mb-2">{indicator.name}</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-[var(--background)] rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-[var(--primary)]"
                            style={{ width: `${(indicator.value / indicator.max) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold">{indicator.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {!profile && !isAnalyzing && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">👥</div>
            <p className="text-xl text-[var(--muted-foreground)]">输入社区URL或上传文件开始分析</p>
          </div>
        )}
      </main>
    </div>
  );
}

