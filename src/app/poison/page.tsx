'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Task {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'failed';
  progress: number;
  riskLevel: 'high' | 'medium' | 'low' | 'none';
  startTime: string;
  malicious: number;
  benign: number;
}

export default function PoisonPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [summary, setSummary] = useState({ malicious: 0, benign: 0, avgTime: 0 });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [scanMode, setScanMode] = useState<'ondemand' | 'continuous'>('ondemand');

  useEffect(() => {
    // TODO: 替换为真实 API 调用
    // 示例：
    // const fetchData = async () => {
    //   const result = await api.poison.getResult(scanId);
    //   setTasks(result.tasks);
    //   setSummary(result.summary);
    // };
    // fetchData();
    
    // 模拟 API 调用
    const mockData = {
      tasks: [
        {
          id: '1',
          name: '依赖包扫描 #1',
          status: 'completed' as const,
          progress: 100,
          riskLevel: 'medium' as const,
          startTime: '2024-01-15 10:30:00',
          malicious: 3,
          benign: 97,
        },
        {
          id: '2',
          name: '依赖包扫描 #2',
          status: 'running' as const,
          progress: 65,
          riskLevel: 'low' as const,
          startTime: '2024-01-15 14:20:00',
          malicious: 1,
          benign: 64,
        },
        {
          id: '3',
          name: '依赖包扫描 #3',
          status: 'completed' as const,
          progress: 100,
          riskLevel: 'high' as const,
          startTime: '2024-01-14 09:15:00',
          malicious: 8,
          benign: 92,
        },
      ],
      summary: { malicious: 6, benign: 119, avgTime: 1.2 },
    };
    setTasks(mockData.tasks);
    setSummary(mockData.summary);
  }, []);

  const trendData = [
    { date: '01-10', malicious: 2, benign: 98 },
    { date: '01-11', malicious: 4, benign: 96 },
    { date: '01-12', malicious: 3, benign: 97 },
    { date: '01-13', malicious: 5, benign: 95 },
    { date: '01-14', malicious: 8, benign: 92 },
    { date: '01-15', malicious: 6, benign: 94 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-blue-600/20 text-blue-400';
      case 'completed':
        return 'bg-green-600/20 text-green-400';
      case 'failed':
        return 'bg-red-600/20 text-red-400';
      default:
        return 'bg-gray-600/20 text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'running':
        return '运行中';
      case 'completed':
        return '已完成';
      case 'failed':
        return '失败';
      default:
        return '未知';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-orange-400';
      case 'low':
        return 'text-yellow-400';
      case 'none':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case 'high':
        return '高风险';
      case 'medium':
        return '中风险';
      case 'low':
        return '低风险';
      case 'none':
        return '无风险';
      default:
        return '未知';
    }
  };

  const startNewScan = () => {
    // TODO: 实现真实的扫描启动功能
    // 示例：
    // const newTask = await api.poison.startScan({ mode: scanMode });
    // setTasks([newTask, ...tasks]);
    
    const newTask: Task = {
      id: String(tasks.length + 1),
      name: `依赖包扫描 #${tasks.length + 1}`,
      status: 'running',
      progress: 0,
      riskLevel: 'none',
      startTime: new Date().toLocaleString('zh-CN'),
      malicious: 0,
      benign: 0,
    };
    setTasks([newTask, ...tasks]);
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
            <h1 className="text-2xl font-bold text-gradient">投毒风险检测</h1>
          </div>
          <button
            onClick={startNewScan}
            className="px-4 py-2 bg-[#5b8def] hover:bg-[#7ba5f5] rounded-lg transition-all"
          >
            启动新扫描
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Scan Mode Selector */}
        <div className="bg-[#151b2e] border border-[#1e293b] rounded-lg p-6 mb-6 card-gradient">
          <h2 className="text-lg font-semibold mb-4">扫描模式</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setScanMode('ondemand')}
              className={`flex-1 px-6 py-4 rounded-lg border-2 transition-all ${
                scanMode === 'ondemand'
                  ? 'border-[#5b8def] bg-[#5b8def]/20'
                  : 'border-[#1e293b] bg-[#0a0e1a] hover:border-[#5b8def]/50'
              }`}
            >
              <div className="text-xl mb-2">🔍</div>
              <div className="font-semibold">按需扫描</div>
              <div className="text-sm text-gray-400 mt-1">手动触发单次扫描</div>
            </button>
            <button
              onClick={() => setScanMode('continuous')}
              className={`flex-1 px-6 py-4 rounded-lg border-2 transition-all ${
                scanMode === 'continuous'
                  ? 'border-[#5b8def] bg-[#5b8def]/20'
                  : 'border-[#1e293b] bg-[#0a0e1a] hover:border-[#5b8def]/50'
              }`}
            >
              <div className="text-xl mb-2">🔄</div>
              <div className="font-semibold">持续监测</div>
              <div className="text-sm text-gray-400 mt-1">自动定期扫描监控</div>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Stats Card */}
          <div className="bg-[#151b2e] border border-[#1e293b] rounded-lg p-6 card-gradient">
            <h2 className="text-lg font-semibold mb-4">检测统计</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-3xl font-bold text-red-400">{summary.malicious}</div>
                <div className="text-sm text-gray-400">恶意包</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400">{summary.benign}</div>
                <div className="text-sm text-gray-400">正常包</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#5b8def]">{summary.avgTime}s</div>
                <div className="text-sm text-gray-400">平均耗时</div>
              </div>
            </div>
          </div>

          {/* Trend Chart Card */}
          <div className="bg-[#151b2e] border border-[#1e293b] rounded-lg p-6 card-gradient">
            <h2 className="text-lg font-semibold mb-4">风险趋势</h2>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={trendData}>
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
                <Line type="monotone" dataKey="malicious" stroke="#ef4444" strokeWidth={2} name="恶意包" />
                <Line type="monotone" dataKey="benign" stroke="#10b981" strokeWidth={2} name="正常包" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-[#151b2e] border border-[#1e293b] rounded-lg p-6 card-gradient">
          <h2 className="text-lg font-semibold mb-4">扫描任务</h2>
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-[#0a0e1a] border border-[#1e293b] rounded-lg p-4 hover:border-[#5b8def]/50 transition-all cursor-pointer"
                onClick={() => setSelectedTask(task)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-semibold">{task.name}</div>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(task.status)}`}>
                      {getStatusLabel(task.status)}
                    </span>
                  </div>
                  <div className={`font-semibold ${getRiskColor(task.riskLevel)}`}>
                    {getRiskLabel(task.riskLevel)}
                  </div>
                </div>

                {/* Progress Bar */}
                {task.status === 'running' && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-1">
                      <span>扫描进度</span>
                      <span>{task.progress}%</span>
                    </div>
                    <div className="w-full bg-[#1e293b] rounded-full h-2">
                      <div
                        className="bg-[#5b8def] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <div className="text-gray-400">开始时间: {task.startTime}</div>
                  <div className="flex gap-4">
                    <span className="text-red-400">恶意: {task.malicious}</span>
                    <span className="text-green-400">正常: {task.benign}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setSelectedTask(null)}
        >
          <div
            className="bg-[#151b2e] border border-[#1e293b] rounded-lg p-8 max-w-2xl w-full mx-4 card-gradient"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{selectedTask.name}</h2>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded text-sm ${getStatusColor(selectedTask.status)}`}>
                    {getStatusLabel(selectedTask.status)}
                  </span>
                  <span className={`font-semibold ${getRiskColor(selectedTask.riskLevel)}`}>
                    {getRiskLabel(selectedTask.riskLevel)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">任务 ID</div>
                <div className="text-white">{selectedTask.id}</div>
              </div>

              <div>
                <div className="text-sm text-gray-400 mb-1">开始时间</div>
                <div className="text-white">{selectedTask.startTime}</div>
              </div>

              <div>
                <div className="text-sm text-gray-400 mb-1">扫描进度</div>
                <div className="text-white">{selectedTask.progress}%</div>
              </div>

              <div>
                <div className="text-sm text-gray-400 mb-1">检测结果</div>
                <div className="flex gap-4">
                  <span className="text-red-400">恶意包: {selectedTask.malicious}</span>
                  <span className="text-green-400">正常包: {selectedTask.benign}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#1e293b]">
                <div className="text-sm text-gray-400 mb-2">风险等级</div>
                <div className={`text-lg font-semibold ${getRiskColor(selectedTask.riskLevel)}`}>
                  {getRiskLabel(selectedTask.riskLevel)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

