'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { loadPoisonData } from '@/lib/data-loader';

interface PoisoningData {
  id: string;
  package: string;
  version: string;
  riskLevel: 'high' | 'medium' | 'low' | 'safe';
  detection: string;
  description: string;
  suspiciousPatterns: string[];
  confidence: number;
}

// 基于检测结果目录的mock数据映射
const repoPoisoningDataMap: Record<string, {
  name: string;
  poisonings: PoisoningData[];
  summary: {
    tasks: number;
    malicious: number;
    benign: number;
    suspicious: number;
  };
}> = {
  'repo-kafka-python': {
    name: 'Kafka Python',
    poisonings: [
      {
        id: 'POI-001',
        package: 'kafka-python-helper',
        version: '1.2.3',
        riskLevel: 'high',
        detection: '恶意代码注入',
        description: '检测到可疑的网络连接代码',
        suspiciousPatterns: ['base64编码', '动态加载', '网络连接'],
        confidence: 95
      },
      {
        id: 'POI-002',
        package: 'py-kafka-utils',
        version: '0.8.1',
        riskLevel: 'medium',
        detection: '可疑文件操作',
        description: '检测到异常的文件读写操作',
        suspiciousPatterns: ['文件系统访问', '环境变量读取'],
        confidence: 75
      },
    ],
    summary: { tasks: 8, malicious: 2, benign: 5, suspicious: 1 },
  },
  'repo-vue-django': {
    name: 'Vue Django Book Shop',
    poisonings: [
      {
        id: 'POI-003',
        package: 'django-auth-utils',
        version: '2.1.0',
        riskLevel: 'high',
        detection: '凭证窃取代码',
        description: '检测到可疑的凭证收集代码',
        suspiciousPatterns: ['环境变量读取', '配置文件访问'],
        confidence: 90
      },
    ],
    summary: { tasks: 6, malicious: 1, benign: 4, suspicious: 1 },
  },
  'repo-probabilistic-forecasts': {
    name: 'Probabilistic Forecasts Attacks',
    poisonings: [
      {
        id: 'POI-004',
        package: 'forecast-helper',
        version: '0.5.2',
        riskLevel: 'safe',
        detection: '正常代码',
        description: '未发现恶意行为 - forecast-helper',
        suspiciousPatterns: [],
        confidence: 5
      },
      {
        id: 'POI-005',
        package: 'ml-utils',
        version: '1.0.1',
        riskLevel: 'safe',
        detection: '正常代码',
        description: '未发现恶意行为 - ml-utils',
        suspiciousPatterns: [],
        confidence: 8
      },
      {
        id: 'POI-006',
        package: 'numpy',
        version: '1.24.0',
        riskLevel: 'safe',
        detection: '正常代码',
        description: '未发现恶意行为 - numpy',
        suspiciousPatterns: [],
        confidence: 12
      },
      {
        id: 'POI-007',
        package: 'pandas',
        version: '1.5.0',
        riskLevel: 'safe',
        detection: '正常代码',
        description: '未发现恶意行为 - pandas',
        suspiciousPatterns: [],
        confidence: 15
      },
      {
        id: 'POI-008',
        package: 'tensorflow',
        version: '2.11.0',
        riskLevel: 'safe',
        detection: '正常代码',
        description: '未发现恶意行为 - tensorflow',
        suspiciousPatterns: [],
        confidence: 10
      },
      {
        id: 'POI-009',
        package: 'matplotlib',
        version: '3.6.0',
        riskLevel: 'safe',
        detection: '正常代码',
        description: '未发现恶意行为 - matplotlib',
        suspiciousPatterns: [],
        confidence: 7
      },
      {
        id: 'POI-010',
        package: 'torch',
        version: '1.13.0',
        riskLevel: 'safe',
        detection: '正常代码',
        description: '未发现恶意行为 - torch',
        suspiciousPatterns: [],
        confidence: 9
      },
      {
        id: 'POI-011',
        package: 'scikit-learn',
        version: '1.2.0',
        riskLevel: 'safe',
        detection: '正常代码',
        description: '未发现恶意行为 - scikit-learn',
        suspiciousPatterns: [],
        confidence: 11
      },
      {
        id: 'POI-012',
        package: 'requests',
        version: '2.28.0',
        riskLevel: 'safe',
        detection: '正常代码',
        description: '未发现恶意行为 - requests',
        suspiciousPatterns: [],
        confidence: 6
      },
      {
        id: 'POI-013',
        package: 'urllib3',
        version: '1.26.0',
        riskLevel: 'safe',
        detection: '正常代码',
        description: '未发现恶意行为 - urllib3',
        suspiciousPatterns: [],
        confidence: 8
      },
      {
        id: 'POI-014',
        package: 'cryptography',
        version: '3.4.0',
        riskLevel: 'safe',
        detection: '正常代码',
        description: '未发现恶意行为 - cryptography',
        suspiciousPatterns: [],
        confidence: 13
      },
      {
        id: 'POI-015',
        package: 'Django',
        version: '4.1.0',
        riskLevel: 'safe',
        detection: '正常代码',
        description: '未发现恶意行为 - Django',
        suspiciousPatterns: [],
        confidence: 10
      },
      {
        id: 'POI-016',
        package: 'Vue',
        version: '3.2.0',
        riskLevel: 'safe',
        detection: '正常代码',
        description: '未发现恶意行为 - Vue',
        suspiciousPatterns: [],
        confidence: 7
      },
      {
        id: 'POI-017',
        package: 'flask',
        version: '2.2.0',
        riskLevel: 'safe',
        detection: '正常代码',
        description: '未发现恶意行为 - flask',
        suspiciousPatterns: [],
        confidence: 9
      },
      {
        id: 'POI-018',
        package: 'transformers',
        version: '4.25.0',
        riskLevel: 'safe',
        detection: '正常代码',
        description: '未发现恶意行为 - transformers',
        suspiciousPatterns: [],
        confidence: 11
      },
      {
        id: 'POI-019',
        package: 'keras',
        version: '2.12.0',
        riskLevel: 'safe',
        detection: '正常代码',
        description: '未发现恶意行为 - keras',
        suspiciousPatterns: [],
        confidence: 8
      },
    ],
    summary: { tasks: 16, malicious: 0, benign: 16, suspicious: 0 },
  },
  'repo-wumei-smart': {
    name: 'Wumei Smart',
    poisonings: [
      {
        id: 'POI-006',
        package: 'smart-device-utils',
        version: '1.3.0',
        riskLevel: 'medium',
        detection: '可疑网络通信',
        description: '检测到异常的网络通信模式',
        suspiciousPatterns: ['HTTP请求', '端口扫描'],
        confidence: 80
      },
    ],
    summary: { tasks: 5, malicious: 1, benign: 3, suspicious: 1 },
  },
  'repo-xiangtian-workbench': {
    name: 'Xiangtian Workbench',
    poisonings: [
      {
        id: 'POI-007',
        package: 'workbench-tools',
        version: '2.0.1',
        riskLevel: 'high',
        detection: '后门代码',
        description: '检测到隐藏的后门功能',
        suspiciousPatterns: ['隐藏功能', '远程控制'],
        confidence: 92
      },
      {
        id: 'POI-008',
        package: 'data-processor',
        version: '1.1.0',
        riskLevel: 'safe',
        detection: '正常代码',
        description: '未发现恶意行为',
        suspiciousPatterns: [],
        confidence: 5
      },
    ],
    summary: { tasks: 10, malicious: 2, benign: 7, suspicious: 1 },
  },
  'repo-pytorch': {
    name: 'PyTorch',
    poisonings: [
      {
        id: 'POI-009',
        package: 'torch-extensions',
        version: '0.3.1',
        riskLevel: 'medium',
        detection: '可疑模型操作',
        description: '检测到异常的模型操作',
        suspiciousPatterns: ['模型导出', '权重修改'],
        confidence: 70
      },
      {
        id: 'POI-010',
        package: 'nn-utils',
        version: '1.2.0',
        riskLevel: 'safe',
        detection: '正常代码',
        description: '未发现恶意行为',
        suspiciousPatterns: [],
        confidence: 8
      },
    ],
    summary: { tasks: 15, malicious: 4, benign: 10, suspicious: 1 },
  },
  'repo-llama': {
    name: 'Meta Llama',
    poisonings: [
      {
        id: 'POI-011',
        package: 'llama-helper',
        version: '0.9.2',
        riskLevel: 'high',
        detection: '模型投毒',
        description: '检测到模型权重篡改',
        suspiciousPatterns: ['权重修改', '模型注入'],
        confidence: 88
      },
    ],
    summary: { tasks: 8, malicious: 2, benign: 5, suspicious: 1 },
  },
  'repo-tensorflow': {
    name: 'TensorFlow',
    poisonings: [
      {
        id: 'POI-012',
        package: 'tf-extensions',
        version: '1.1.3',
        riskLevel: 'medium',
        detection: '可疑图操作',
        description: '检测到异常的图操作',
        suspiciousPatterns: ['图修改', '节点注入'],
        confidence: 65
      },
      {
        id: 'POI-013',
        package: 'keras-utils',
        version: '2.0.1',
        riskLevel: 'safe',
        detection: '正常代码',
        description: '未发现恶意行为',
        suspiciousPatterns: [],
        confidence: 12
      },
    ],
    summary: { tasks: 20, malicious: 5, benign: 14, suspicious: 1 },
  },
  'repo-deepseek-v3': {
    name: 'DeepSeek V3',
    poisonings: [
      {
        id: 'POI-014',
        package: 'deepseek-utils',
        version: '3.1.0',
        riskLevel: 'low',
        detection: '可疑组件行为',
        description: '检测到异常的组件操作',
        suspiciousPatterns: ['DOM操作', '事件监听'],
        confidence: 55
      },
    ],
    summary: { tasks: 7, malicious: 1, benign: 5, suspicious: 1 },
  },
  'repo-mistral-inference': {
    name: 'Mistral Inference',
    poisonings: [
      {
        id: 'POI-015',
        package: 'mistral-utils',
        version: '2.2.1',
        riskLevel: 'high',
        detection: '恶意脚本注入',
        description: '检测到脚本注入代码',
        suspiciousPatterns: ['eval执行', '动态导入'],
        confidence: 85
      },
    ],
    summary: { tasks: 18, malicious: 3, benign: 14, suspicious: 1 },
  },
};

interface Props {
  params: Promise<{
    repo: string;
  }>;
}

export default function PoisoningDetailPage({ params }: Props) {
  const router = useRouter();
  const [poisoningData, setPoisoningData] = useState<{
    poisonings: PoisoningData[];
    summary: {
      tasks: number;
      malicious: number;
      benign: number;
      suspicious: number;
    };
  }>({
    poisonings: [],
    summary: { tasks: 0, malicious: 0, benign: 0, suspicious: 0 },
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [repoName, setRepoName] = useState<string>('');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>('all');
  const itemsPerPage = 20;

  const resolvedParams = use(params);
  const repo = resolvedParams.repo as string;

  useEffect(() => {
    async function fetchPoisonData() {
      try {
        const data = await loadPoisonData(repo);
        if (data && data.poisonings) {
          // 使用真实数据中的投毒信息和统计信息
          const poisonings: PoisoningData[] = data.poisonings;

          const summary = {
            tasks: data.summary.total,
            malicious: data.summary.malicious,
            benign: data.summary.benign,
            suspicious: data.summary.suspicious
          };

          setPoisoningData({
            poisonings,
            summary,
          });

          // 设置仓库名称
          const repoNameMap: Record<string, string> = {
            'repo-kafka-python': 'Kafka Python',
            'repo-xiangtian-workbench': 'Xiangtian Workbench',
            'repo-wumei-smart': 'Wumei Smart',
            'repo-probabilistic-forecasts': 'Probabilistic Forecasts Attacks',
            'repo-vue-django-bookshop': 'Vue Django BookShop',
            'repo-pytorch': 'PyTorch',
            'repo-tensorflow': 'TensorFlow',
            'repo-deepseek-v3': 'DeepSeek V3',
            'repo-llama': 'Meta Llama',
            'repo-mistral-inference': 'Mistral Inference'
          };
          setRepoName(repoNameMap[repo] || repo);
        } else {
          // 如果加载失败，使用空数据作为备用
          setPoisoningData({
            poisonings: [],
            summary: { tasks: 0, malicious: 0, benign: 0, suspicious: 0 },
          });
          setRepoName(repo);
        }
      } catch (error) {
        console.error('Error loading poison data:', error);
        // 出错时使用空数据
        setPoisoningData({
          poisonings: [],
          summary: { tasks: 0, malicious: 0, benign: 0, suspicious: 0 },
        });
        setRepoName(repo);
      }
    }

    fetchPoisonData();
  }, [repo]);

  const filteredPoisonings = poisoningData.poisonings.filter((poison) => {
    const matchesSearch = poison.package.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         poison.detection.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedRiskLevel === 'all') return matchesSearch;
    return matchesSearch && poison.riskLevel === selectedRiskLevel;
  });

  const totalPages = Math.ceil(filteredPoisonings.length / itemsPerPage);
  const paginatedPoisonings = filteredPoisonings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 统一的分页页码计算（首尾页 + 当前页附近 + 省略号）
  const getPageNumbers = () => {
    const maxVisible = 7;
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | 'dots-left' | 'dots-right')[] = [];
    const showLeft = currentPage - 1;
    const showRight = currentPage + 1;

    pages.push(1);

    if (showLeft <= 2) {
      for (let p = 2; p <= 4; p++) {
        pages.push(p);
      }
      pages.push('dots-right');
    } else if (showRight >= totalPages - 1) {
      pages.push('dots-left');
      for (let p = totalPages - 4; p <= totalPages - 1; p++) {
        pages.push(p);
      }
    } else {
      pages.push('dots-left');
      pages.push(currentPage - 1);
      pages.push(currentPage);
      pages.push(currentPage + 1);
      pages.push('dots-right');
    }

    pages.push(totalPages);
    return pages;
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return 'bg-red-600/20 text-red-400';
      case 'medium':
        return 'bg-orange-600/20 text-orange-400';
      case 'low':
        return 'bg-yellow-600/20 text-yellow-400';
      case 'safe':
        return 'bg-green-600/20 text-green-400';
      default:
        return 'bg-gray-600/20 text-gray-400';
    }
  };

  const getRiskText = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return '高风险';
      case 'medium':
        return '中风险';
      case 'low':
        return '低风险';
      case 'safe':
        return '安全';
      default:
        return '未知';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-red-600';
    if (confidence >= 60) return 'text-orange-600';
    if (confidence >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

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
                投毒风险检测 - {repoName || repoPoisoningDataMap[repo]?.name || repo}
              </h1>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">详细的投毒风险分析</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Summary Section */}
        <div className="mb-8">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">投毒风险概览</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{poisoningData.summary.tasks}</div>
                <div className="text-sm text-[var(--muted-foreground)]">检测任务</div>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{poisoningData.summary.malicious}</div>
                <div className="text-sm text-[var(--muted-foreground)]">恶意包</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{poisoningData.summary.benign}</div>
                <div className="text-sm text-[var(--muted-foreground)]">安全包</div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{poisoningData.summary.suspicious}</div>
                <div className="text-sm text-[var(--muted-foreground)]">可疑包</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="搜索包名或检测结果..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-[var(--input)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedRiskLevel}
                onChange={(e) => setSelectedRiskLevel(e.target.value)}
                className="px-4 py-2 bg-[var(--input)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                <option value="all">所有风险等级</option>
                <option value="high">高风险</option>
                <option value="medium">中风险</option>
                <option value="low">低风险</option>
                <option value="safe">安全</option>
              </select>
            </div>
          </div>
        </div>

        {/* Poisoning Details Table */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg overflow-hidden">
          <div className="p-6 border-b border-[var(--border)]">
            <h2 className="text-xl font-semibold">投毒风险详情</h2>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              项目中发现的所有投毒风险包及其详细信息
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--input)]">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--muted-foreground)]">包名</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--muted-foreground)]">版本</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--muted-foreground)]">风险等级</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--muted-foreground)]">检测结果</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--muted-foreground)]">描述</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--muted-foreground)]">可疑模式</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--muted-foreground)]">置信度</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {paginatedPoisonings.map((poison, index) => (
                  <tr key={index} className="hover:bg-[var(--input)] transition-colors">
                    <td className="px-4 py-3 text-sm font-medium">{poison.package}</td>
                    <td className="px-4 py-3 text-sm text-[var(--muted-foreground)]">{poison.version}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${getRiskColor(poison.riskLevel)}`}>
                        {getRiskText(poison.riskLevel)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{poison.detection}</td>
                    <td className="px-4 py-3 text-sm text-[var(--muted-foreground)]">{poison.description}</td>
                    <td className="px-4 py-3 text-sm">
                      {poison.suspiciousPatterns.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {poison.suspiciousPatterns.map((pattern, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-600/20 text-gray-400 rounded text-xs"
                            >
                              {pattern}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">无</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`font-medium ${getConfidenceColor(poison.confidence)}`}>
                        {poison.confidence}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPoisonings.length === 0 && (
            <div className="text-center py-12 text-[var(--muted-foreground)]">
              {searchQuery ? '没有找到匹配的投毒风险数据' : '没有找到投毒风险数据'}
            </div>
          )}

          {/* Pagination */}
          {filteredPoisonings.length > 0 && (
            <div className="p-4 border-t border-[var(--border)] flex justify-between items-center">
              <div className="text-sm text-[var(--muted-foreground)]">
                显示 {Math.min((currentPage - 1) * itemsPerPage + 1, filteredPoisonings.length)} - {Math.min(currentPage * itemsPerPage, filteredPoisonings.length)} 条，共 {filteredPoisonings.length} 条
              </div>
              <div className="flex items-center gap-2">
                {/* 首页 */}
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-[var(--border)] rounded hover:bg-[var(--input)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  首页
                </button>

                {/* 上一页 */}
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-[var(--border)] rounded hover:bg-[var(--input)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  上一页
                </button>

                {/* 中间页码 + 省略号 */}
                {getPageNumbers().map((item, index) => {
                  if (item === 'dots-left' || item === 'dots-right') {
                    return (
                      <span key={`${item}-${index}`} className="px-2 text-sm text-[var(--muted-foreground)]">
                        ...
                      </span>
                    );
                  }

                  const page = item as number;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 text-sm border border-[var(--border)] rounded ${
                        currentPage === page ? 'bg-[var(--primary)] text-white' : 'hover:bg-[var(--input)]'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                {/* 下一页 */}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-[var(--border)] rounded hover:bg-[var(--input)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  下一页
                </button>

                {/* 末页 */}
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-[var(--border)] rounded hover:bg-[var(--input)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  末页
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Security Analysis */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="text-2xl">🛡️</span>
              防护建议
            </h3>
            <ul className="text-sm text-[var(--muted-foreground)] space-y-2">
              <li>• 立即移除所有高风险恶意包</li>
              <li>• 审查所有可疑包的源代码</li>
              <li>• 使用可信的包管理源</li>
              <li>• 实施包签名验证机制</li>
            </ul>
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="text-2xl">📊</span>
              风险分析
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>总体风险等级</span>
                <span className={poisoningData.summary.malicious > 3 ? 'text-red-600' :
                               poisoningData.summary.malicious > 1 ? 'text-orange-600' : 'text-green-600'}>
                  {poisoningData.summary.malicious > 3 ? '高风险' :
                   poisoningData.summary.malicious > 1 ? '中风险' : '低风险'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>恶意包占比</span>
                <span className="text-red-600">
                  {poisoningData.summary.tasks > 0
                    ? Math.round((poisoningData.summary.malicious / poisoningData.summary.tasks) * 100)
                    : 0}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>安全包占比</span>
                <span className="text-green-600">
                  {poisoningData.summary.tasks > 0
                    ? Math.round((poisoningData.summary.benign / poisoningData.summary.tasks) * 100)
                    : 0}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>可疑包占比</span>
                <span className="text-orange-600">
                  {poisoningData.summary.tasks > 0
                    ? Math.round((poisoningData.summary.suspicious / poisoningData.summary.tasks) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}