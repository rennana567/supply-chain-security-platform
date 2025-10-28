'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface Developer {
  id: string;
  name: string;
  avatar: string;
  org: string;
  location: string;
  profileUrl: string;
  commits: number;
  prs: number;
  reviews: number;
  rank: number;
}

interface ActivityData {
  date: string;
  commits: number;
}

export default function DeveloperPage() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [selectedDev, setSelectedDev] = useState<Developer | null>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);

  useEffect(() => {
    // 模拟 API 调用
    const mockDevelopers = [
      {
        id: 'dev1',
        name: 'Zhang San',
        avatar: '👨‍💻',
        org: 'TechCorp',
        location: 'Beijing, China',
        profileUrl: 'https://github.com/zhangsan',
        commits: 320,
        prs: 45,
        reviews: 12,
        rank: 1,
      },
      {
        id: 'dev2',
        name: 'Li Si',
        avatar: '👩‍💻',
        org: 'DevStudio',
        location: 'Shanghai, China',
        profileUrl: 'https://github.com/lisi',
        commits: 280,
        prs: 38,
        reviews: 15,
        rank: 2,
      },
      {
        id: 'dev3',
        name: 'Wang Wu',
        avatar: '🧑‍💻',
        org: 'CodeLab',
        location: 'Shenzhen, China',
        profileUrl: 'https://github.com/wangwu',
        commits: 245,
        prs: 32,
        reviews: 10,
        rank: 3,
      },
    ];
    setDevelopers(mockDevelopers);

    const mockSkills = [
      { name: 'JavaScript', value: 60, color: '#f7df1e' },
      { name: 'Python', value: 30, color: '#3776ab' },
      { name: 'Go', value: 10, color: '#00add8' },
    ];
    setSkills(mockSkills);

    const mockActivity = [
      { date: '01-01', commits: 5 },
      { date: '01-02', commits: 8 },
      { date: '01-03', commits: 3 },
      { date: '01-04', commits: 12 },
      { date: '01-05', commits: 7 },
      { date: '01-06', commits: 15 },
      { date: '01-07', commits: 10 },
    ];
    setActivityData(mockActivity);
  }, []);

  const analyzeDeveloper = () => {
    if (userId && developers.length > 0) {
      setSelectedDev(developers[0]);
    }
  };

  const exportResume = () => {
    alert('导出 PDF 功能开发中...');
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      {/* Header */}
      <header className="border-b border-[#1e293b] bg-[#151b2e]/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="text-[#5b8def] hover:text-[#7ba5f5] transition-colors"
            >
              ← 返回
            </button>
            <button
              onClick={() => router.push('/home')}
              className="text-[#10b981] hover:text-[#34d399] transition-colors"
            >
              🏠 返回首页
            </button>
            <h1 className="text-2xl font-bold text-gradient">开发者画像</h1>
          </div>
          {selectedDev && (
            <button
              onClick={exportResume}
              className="px-4 py-2 bg-[#5b8def] hover:bg-[#7ba5f5] rounded-lg transition-all glow-hover"
            >
              导出开源简历
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Input Section */}
        <div className="bg-[#151b2e] border border-[#1e293b] rounded-lg p-6 mb-8 card-gradient">
          <h2 className="text-lg font-semibold mb-4">分析开发者</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="输入 GitHub / Gitee 用户 ID"
              className="flex-1 px-4 py-2 bg-[#0a0e1a] border border-[#1e293b] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5b8def]"
            />
            <button
              onClick={analyzeDeveloper}
              className="px-6 py-2 bg-[#5b8def] hover:bg-[#7ba5f5] rounded-lg transition-all glow-hover"
            >
              开始分析
            </button>
          </div>
        </div>

        {selectedDev && (
          <>
            {/* Developer Profile Card */}
            <div className="bg-[#151b2e] border border-[#1e293b] rounded-lg p-8 mb-8 card-gradient">
              <div className="flex items-start gap-6">
                <div className="text-6xl">{selectedDev.avatar}</div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">{selectedDev.name}</h2>
                  <div className="flex items-center gap-4 text-gray-400 mb-4">
                    <span>🏢 {selectedDev.org}</span>
                    <span>📍 {selectedDev.location}</span>
                  </div>
                  <a
                    href={selectedDev.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#5b8def] hover:text-[#7ba5f5] hover:underline"
                  >
                    {selectedDev.profileUrl}
                  </a>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#5b8def]">#{selectedDev.rank}</div>
                  <div className="text-sm text-gray-400 mt-1">贡献排名</div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-[#151b2e] border border-[#1e293b] rounded-lg p-6 card-gradient">
                <div className="text-4xl font-bold text-[#5b8def] mb-2">{selectedDev.commits}</div>
                <div className="text-sm text-gray-400">总提交数</div>
              </div>
              <div className="bg-[#151b2e] border border-[#1e293b] rounded-lg p-6 card-gradient">
                <div className="text-4xl font-bold text-green-400 mb-2">{selectedDev.prs}</div>
                <div className="text-sm text-gray-400">Pull Requests</div>
              </div>
              <div className="bg-[#151b2e] border border-[#1e293b] rounded-lg p-6 card-gradient">
                <div className="text-4xl font-bold text-purple-400 mb-2">{selectedDev.reviews}</div>
                <div className="text-sm text-gray-400">代码评审</div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Skills Chart */}
              <div className="bg-[#151b2e] border border-[#1e293b] rounded-lg p-6 card-gradient">
                <h2 className="text-lg font-semibold mb-4">技能分布</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={skills}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#151b2e',
                        border: '1px solid #1e293b',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {skills.map((entry, index) => (
                        <Bar key={`bar-${index}`} dataKey="value" fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-6 mt-4">
                  {skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: skill.color }}
                      ></div>
                      <span className="text-sm text-gray-400">{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Chart */}
              <div className="bg-[#151b2e] border border-[#1e293b] rounded-lg p-6 card-gradient">
                <h2 className="text-lg font-semibold mb-4">活跃度趋势</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#151b2e',
                        border: '1px solid #1e293b',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="commits"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Activity Heatmap */}
            <div className="bg-[#151b2e] border border-[#1e293b] rounded-lg p-6 card-gradient">
              <h2 className="text-lg font-semibold mb-4">活跃度热力图</h2>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }).map((_, index) => {
                  const intensity = Math.floor(Math.random() * 5);
                  const colors = [
                    'bg-[#0a0e1a]',
                    'bg-blue-900/30',
                    'bg-[#7ba5f5]/50',
                    'bg-[#5b8def]/70',
                    'bg-[#5b8def]',
                  ];
                  return (
                    <div
                      key={index}
                      className={`aspect-square rounded ${colors[intensity]} hover:ring-2 hover:ring-[#5b8def] transition-all cursor-pointer`}
                      title={`${intensity} commits`}
                    ></div>
                  );
                })}
              </div>
              <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-400">
                <span>少</span>
                <div className="w-3 h-3 rounded bg-[#0a0e1a]"></div>
                <div className="w-3 h-3 rounded bg-blue-900/30"></div>
                <div className="w-3 h-3 rounded bg-[#7ba5f5]/50"></div>
                <div className="w-3 h-3 rounded bg-[#5b8def]/70"></div>
                <div className="w-3 h-3 rounded bg-[#5b8def]"></div>
                <span>多</span>
              </div>
            </div>
          </>
        )}

        {/* Developers Ranking Table */}
        <div className="bg-[#151b2e] border border-[#1e293b] rounded-lg p-6 mt-8 card-gradient">
          <h2 className="text-lg font-semibold mb-4">贡献者排行榜</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0a0e1a]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">排名</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">开发者</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">组织</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">提交数</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">PR 数</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">评审数</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]">
                {developers.map((dev) => (
                  <tr
                    key={dev.id}
                    className="hover:bg-[#1e293b]/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedDev(dev)}
                  >
                    <td className="px-6 py-4 text-sm">
                      <span className="text-2xl font-bold text-[#5b8def]">#{dev.rank}</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{dev.avatar}</span>
                        <div>
                          <div className="font-medium text-white">{dev.name}</div>
                          <div className="text-xs text-gray-400">{dev.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{dev.org}</td>
                    <td className="px-6 py-4 text-sm text-[#5b8def] font-semibold">{dev.commits}</td>
                    <td className="px-6 py-4 text-sm text-green-400 font-semibold">{dev.prs}</td>
                    <td className="px-6 py-4 text-sm text-purple-400 font-semibold">{dev.reviews}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {!selectedDev && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">👨‍💻</div>
            <p className="text-xl text-muted-foreground">输入开发者 ID 开始分析</p>
          </div>
        )}
      </main>
    </div>
  );
}

