'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RepoInput } from '@/components/RepoInput';
import { ScanButton } from '@/components/ScanButton';
import { GitHubLineChart } from '@/components/GitHubLineChart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { MOCK_DEVELOPER_CHART_DATA } from '@/data/mockDeveloperData';

interface DeveloperProfile {
  id: string;
  name: string;
  avatar: string;
  platform: string;
  org: string;
  location: string;
  profileUrl: string;
  badges: string[];
  portfolio: Array<{
    title: string;
    url: string;
    summary: string;
  }>;
  skills: Array<{
    name: string;
    percentage: number;
    color: string;
  }>;
  roleTendency: string;
  activityHeatmap: Array<{
    date: string;
    intensity: number;
  }>;
  activityTrend: Array<{
    date: string;
    commits: number;
  }>;
  influence: {
    prMergeRate: number;
    mentions: number;
    reviewRequests: number;
  };
}

const COLORS = ['#5b8def', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function IndividualDeveloperPage() {
  const router = useRouter();
  const [inputId, setInputId] = useState('');
  const [platform, setPlatform] = useState('Github');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [inputSource, setInputSource] = useState<'id' | 'library'>('id');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [profile, setProfile] = useState<DeveloperProfile | null>(null);

  const handleAnalyze = async () => {
    if (!inputId && !selectedFile && inputSource === 'id') {
      alert('请输入开发者ID或上传文件');
      return;
    }

    setIsAnalyzing(true);
    
    // TODO: 替换为真实 API 调用
    setTimeout(() => {
      const mockProfile: DeveloperProfile = {
        id: 'dev1',
        name: 'Zhang San',
        avatar: '👨‍💻',
        platform: 'Github',
        org: 'TechCorp',
        location: 'Beijing, China',
        profileUrl: 'https://github.com/zhangsan',
        badges: ['🏆 Top Contributor', '⭐ Star Maker', '🤝 Community Builder'],
        portfolio: [
          {
            title: 'React Component Library',
            url: 'https://github.com/zhangsan/react-lib',
            summary: '高性能的React组件库，支持多种主题和自定义配置'
          },
          {
            title: 'Node.js Microservices Framework',
            url: 'https://github.com/zhangsan/node-ms',
            summary: '轻量级微服务框架，支持服务发现和负载均衡'
          },
        ],
        skills: [
          { name: 'JavaScript', percentage: 45, color: '#f7df1e' },
          { name: 'TypeScript', percentage: 25, color: '#3178c6' },
          { name: 'Python', percentage: 20, color: '#3776ab' },
          { name: 'Go', percentage: 10, color: '#00add8' },
        ],
        roleTendency: '全栈开发工程师',
        activityHeatmap: Array.from({ length: 365 }, (_, i) => ({
          date: new Date(2024, 0, i + 1).toISOString().split('T')[0],
          intensity: Math.floor(Math.random() * 5),
        })),
        activityTrend: Array.from({ length: 30 }, (_, i) => ({
          date: `01-${String(i + 1).padStart(2, '0')}`,
          commits: Math.floor(Math.random() * 20) + 5,
        })),
        influence: {
          prMergeRate: 85,
          mentions: 120,
          reviewRequests: 45,
        },
      };
      setProfile(mockProfile);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleExportResume = () => {
    alert('导出开源简历PDF功能开发中...');
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
            <h1 className="text-2xl font-bold text-gradient">个人开发者画像</h1>
          </div>
          {profile && (
            <button
              onClick={handleExportResume}
              className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary)]/90 rounded-lg transition-all glow-hover"
            >
              导出开源简历.pdf
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Input Section */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 mb-8 card-gradient">
          <h2 className="text-lg font-semibold mb-4">开发者个人页面深度画像，选择输入来源：</h2>
          
          <div className="mb-4">
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setInputSource('id')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  inputSource === 'id'
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-[var(--input)] border border-[var(--border)]'
                }`}
              >
                输入ID (平台: Github\Gitee\....)
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

            {inputSource === 'id' && (
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="px-4 py-2 bg-[var(--input)] border border-[var(--border)] rounded-lg"
                  >
                    <option value="Github">Github</option>
                    <option value="Gitee">Gitee</option>
                    <option value="GitLab">GitLab</option>
                  </select>
                  <div className="flex-1">
                    <RepoInput
                      value={inputId}
                      onChange={setInputId}
                      onFileSelect={setSelectedFile}
                      placeholder="输入开发者ID或仓库URL"
                      showFileUpload={true}
                    />
                  </div>
                </div>
              </div>
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
                可导出[开源简历.pdf]
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
            {/* Left Panel - Basic Info & Influence */}
            <div className="space-y-6">
              {/* Avatar & Basic Info */}
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 card-gradient">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-[var(--primary)]/20 rounded-full flex items-center justify-center text-5xl mx-auto mb-4">
                    {profile.avatar}
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{profile.name}</h2>
                  <div className="space-y-2 text-sm text-[var(--muted-foreground)]">
                    <div>昵称/ID ({profile.platform}: {profile.platform}\Gitee\...)</div>
                    <div>组织: {profile.org}</div>
                    <div>地区: {profile.location}</div>
                    <div>
                      主页链接: <a href={profile.profileUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">{profile.profileUrl}</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 card-gradient">
                <h3 className="text-lg font-semibold mb-4">徽章/成就</h3>
                <div className="space-y-2">
                  {profile.badges.map((badge, index) => (
                    <div key={index} className="px-4 py-2 bg-[var(--input)] rounded-lg text-sm">
                      {badge}
                    </div>
                  ))}
                </div>
              </div>

              {/* Personal Influence - Moved to left */}
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 card-gradient">
                <h3 className="text-lg font-semibold mb-4">个人影响力</h3>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-[var(--input)] rounded-lg">
                    <div className="text-3xl font-bold text-[var(--primary)] mb-2">{profile.influence.prMergeRate}%</div>
                    <div className="text-sm text-[var(--muted-foreground)]">PR合并率</div>
                  </div>
                  <div className="text-center p-4 bg-[var(--input)] rounded-lg">
                    <div className="text-3xl font-bold text-green-400 mb-2">{profile.influence.mentions}</div>
                    <div className="text-sm text-[var(--muted-foreground)]">被@次数</div>
                  </div>
                  <div className="text-center p-4 bg-[var(--input)] rounded-lg">
                    <div className="text-3xl font-bold text-purple-400 mb-2">{profile.influence.reviewRequests}</div>
                    <div className="text-sm text-[var(--muted-foreground)]">被请求Review次数</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Data Display */}
            <div className="lg:col-span-2 space-y-6">
              {/* Portfolio */}
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 card-gradient">
                <h3 className="text-lg font-semibold mb-4">作品集: 代表性贡献（带有链接与摘要）</h3>
                <div className="space-y-4">
                  {profile.portfolio.map((item, index) => (
                    <div key={index} className="p-4 bg-[var(--input)] rounded-lg">
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline font-semibold block mb-2">
                        {item.title}
                      </a>
                      <p className="text-sm text-[var(--muted-foreground)]">{item.summary}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Heatmap & Trend */}
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 card-gradient">
                <h3 className="text-lg font-semibold mb-4">提交节律热力图、近30天趋势</h3>
                
                {/* Heatmap */}
                <div className="mb-6">
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {profile.activityHeatmap.slice(-35).map((item, index) => {
                      const colors = [
                        'bg-[var(--background)]',
                        'bg-blue-900/30',
                        'bg-[var(--primary)]/30',
                        'bg-[var(--primary)]/60',
                        'bg-[var(--primary)]',
                      ];
                      return (
                        <div
                          key={index}
                          className={`aspect-square rounded ${colors[item.intensity]} hover:ring-2 hover:ring-[var(--primary)] transition-all cursor-pointer`}
                          title={`${item.date}: ${item.intensity} commits`}
                        ></div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-end gap-2 text-xs text-[var(--muted-foreground)]">
                    <span>少</span>
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div key={i} className={`w-3 h-3 rounded ${['bg-[var(--background)]', 'bg-blue-900/30', 'bg-[var(--primary)]/30', 'bg-[var(--primary)]/60', 'bg-[var(--primary)]'][i]}`}></div>
                    ))}
                    <span>多</span>
                  </div>
                </div>

                {/* Trend Chart */}
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={profile.activityTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="date" tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                    <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="commits"
                      stroke="var(--primary)"
                      strokeWidth={2}
                      dot={{ fill: 'var(--primary)', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Skills Profile */}
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 card-gradient">
                <h3 className="text-lg font-semibold mb-4">技能画像: 语言占比、角色倾向</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={profile.skills}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percentage }) => `${name}: ${percentage}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="percentage"
                        >
                          {profile.skills.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[var(--primary)] mb-2">角色倾向</div>
                      <div className="text-xl">{profile.roleTendency}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* GitHub Activity Charts */}
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 card-gradient">
                <h3 className="text-lg font-semibold mb-4">GitHub 活动趋势分析</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-md font-semibold mb-3">提交趋势</h4>
                    <GitHubLineChart data={MOCK_DEVELOPER_CHART_DATA.commitTrend} height={300} />
                  </div>
                  <div>
                    <h4 className="text-md font-semibold mb-3">PR活动趋势</h4>
                    <GitHubLineChart data={MOCK_DEVELOPER_CHART_DATA.prActivity} height={300} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!profile && !isAnalyzing && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">👨‍💻</div>
            <p className="text-xl text-[var(--muted-foreground)]">输入开发者信息开始分析</p>
          </div>
        )}
      </main>
    </div>
  );
}

