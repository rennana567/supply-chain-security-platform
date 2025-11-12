'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import PieChart3D from '@/components/PieChart3D';
import { loadLicenseData } from '@/lib/data-loader';

interface LicenseData {
  name: string;
  version: string;
  license: string;
  compatibility: 'compatible' | 'conflict' | 'undeclared';
  description: string;
}

// 模拟数据映射（作为备用）
const repoLicenseDataMap: Record<string, {
  name: string;
  licenses: LicenseData[];
  summary: {
    total: number;
    compatible: number;
    conflict: number;
    undeclared: number;
  };
}> = {
  'repo-kafka-python': {
    name: 'Kafka Python',
    licenses: [
      { name: 'Apache-2.0', version: '2.0', license: 'Apache-2.0', compatibility: 'compatible', description: '开源许可证，允许商业使用' },
      { name: 'MIT', version: '1.0', license: 'MIT', compatibility: 'compatible', description: '宽松的开源许可证' },
      { name: 'GPL-3.0', version: '3.0', license: 'GPL-3.0', compatibility: 'conflict', description: '与Apache-2.0存在冲突' },
      { name: 'BSD-3-Clause', version: '3.0', license: 'BSD-3-Clause', compatibility: 'compatible', description: 'BSD许可证变体' },
      { name: 'LGPL-2.1', version: '2.1', license: 'LGPL-2.1', compatibility: 'compatible', description: '较宽松的GPL许可证' },
      { name: 'MPL-2.0', version: '2.0', license: 'MPL-2.0', compatibility: 'compatible', description: 'Mozilla公共许可证' },
      { name: 'EPL-2.0', version: '2.0', license: 'EPL-2.0', compatibility: 'conflict', description: 'Eclipse公共许可证' },
      { name: 'CDDL-1.1', version: '1.1', license: 'CDDL-1.1', compatibility: 'compatible', description: '通用开发和分发许可证' },
      { name: 'AGPL-3.0', version: '3.0', license: 'AGPL-3.0', compatibility: 'conflict', description: 'Affero GPL许可证' },
      { name: 'Artistic-2.0', version: '2.0', license: 'Artistic-2.0', compatibility: 'compatible', description: '艺术许可证' },
    ],
    summary: { total: 15, compatible: 12, conflict: 2, undeclared: 1 },
  },
  'repo-vue-django-bookshop': {
    name: 'Vue Django BookShop',
    licenses: [
      { name: 'MIT', version: '1.0', license: 'MIT', compatibility: 'compatible', description: '宽松的开源许可证' },
      { name: 'BSD-3-Clause', version: '3.0', license: 'BSD-3-Clause', compatibility: 'compatible', description: 'BSD许可证变体' },
      { name: 'Apache-2.0', version: '2.0', license: 'Apache-2.0', compatibility: 'compatible', description: '开源许可证，允许商业使用' },
      { name: 'GPL-2.0', version: '2.0', license: 'GPL-2.0', compatibility: 'conflict', description: '与MIT存在冲突' },
    ],
    summary: { total: 8, compatible: 7, conflict: 1, undeclared: 0 },
  },
  'repo-probabilistic-forecasts': {
    name: 'Probabilistic Forecasts Attacks',
    licenses: [
      { name: 'Apache-2.0', version: '2.0', license: 'Apache-2.0', compatibility: 'compatible', description: '开源许可证，允许商业使用' },
      { name: 'LGPL-2.1', version: '2.1', license: 'LGPL-2.1', compatibility: 'compatible', description: '较宽松的GPL许可证' },
      { name: 'MIT', version: '1.0', license: 'MIT', compatibility: 'compatible', description: '宽松的开源许可证' },
      { name: 'BSD-2-Clause', version: '2.0', license: 'BSD-2-Clause', compatibility: 'compatible', description: 'BSD许可证变体' },
      { name: 'GPL-3.0', version: '3.0', license: 'GPL-3.0', compatibility: 'conflict', description: '与Apache-2.0存在冲突' },
    ],
    summary: { total: 22, compatible: 18, conflict: 3, undeclared: 1 },
  },
  'repo-wumei-smart': {
    name: 'Wumei Smart',
    licenses: [
      { name: 'MIT', version: '1.0', license: 'MIT', compatibility: 'compatible', description: '宽松的开源许可证' },
      { name: 'GPL-2.0', version: '2.0', license: 'GPL-2.0', compatibility: 'conflict', description: '与MIT存在冲突' },
      { name: 'Apache-2.0', version: '2.0', license: 'Apache-2.0', compatibility: 'compatible', description: '开源许可证，允许商业使用' },
      { name: 'BSD-3-Clause', version: '3.0', license: 'BSD-3-Clause', compatibility: 'compatible', description: 'BSD许可证变体' },
    ],
    summary: { total: 11, compatible: 9, conflict: 1, undeclared: 1 },
  },
  'repo-xiangtian-workbench': {
    name: 'Xiangtian Workbench',
    licenses: [
      { name: 'Apache-2.0', version: '2.0', license: 'Apache-2.0', compatibility: 'compatible', description: '开源许可证，允许商业使用' },
      { name: 'BSD-2-Clause', version: '2.0', license: 'BSD-2-Clause', compatibility: 'compatible', description: 'BSD许可证变体' },
      { name: 'MIT', version: '1.0', license: 'MIT', compatibility: 'compatible', description: '宽松的开源许可证' },
      { name: 'LGPL-3.0', version: '3.0', license: 'LGPL-3.0', compatibility: 'compatible', description: '较宽松的GPL许可证' },
      { name: 'GPL-3.0', version: '3.0', license: 'GPL-3.0', compatibility: 'conflict', description: '与Apache-2.0存在冲突' },
    ],
    summary: { total: 18, compatible: 15, conflict: 2, undeclared: 1 },
  },
  'repo-pytorch': {
    name: 'PyTorch',
    licenses: [
      { name: 'BSD-3-Clause', version: '3.0', license: 'BSD-3-Clause', compatibility: 'compatible', description: 'BSD许可证变体' },
      { name: 'MIT', version: '1.0', license: 'MIT', compatibility: 'compatible', description: '宽松的开源许可证' },
      { name: 'Apache-2.0', version: '2.0', license: 'Apache-2.0', compatibility: 'compatible', description: '开源许可证，允许商业使用' },
      { name: 'GPL-2.0', version: '2.0', license: 'GPL-2.0', compatibility: 'conflict', description: '与MIT存在冲突' },
      { name: 'LGPL-2.1', version: '2.1', license: 'LGPL-2.1', compatibility: 'compatible', description: '较宽松的GPL许可证' },
    ],
    summary: { total: 25, compatible: 22, conflict: 2, undeclared: 1 },
  },
  'repo-llama': {
    name: 'Meta Llama',
    licenses: [
      { name: 'Custom', version: '1.0', license: 'Llama Community License', compatibility: 'compatible', description: 'Meta自定义许可证' },
      { name: 'MIT', version: '1.0', license: 'MIT', compatibility: 'compatible', description: '宽松的开源许可证' },
      { name: 'Apache-2.0', version: '2.0', license: 'Apache-2.0', compatibility: 'compatible', description: '开源许可证，允许商业使用' },
    ],
    summary: { total: 12, compatible: 10, conflict: 1, undeclared: 1 },
  },
  'repo-tensorflow': {
    name: 'TensorFlow',
    licenses: [
      { name: 'Apache-2.0', version: '2.0', license: 'Apache-2.0', compatibility: 'compatible', description: '开源许可证，允许商业使用' },
      { name: 'BSD-3-Clause', version: '3.0', license: 'BSD-3-Clause', compatibility: 'compatible', description: 'BSD许可证变体' },
      { name: 'MIT', version: '1.0', license: 'MIT', compatibility: 'compatible', description: '宽松的开源许可证' },
      { name: 'GPL-3.0', version: '3.0', license: 'GPL-3.0', compatibility: 'conflict', description: '与Apache-2.0存在冲突' },
      { name: 'LGPL-2.1', version: '2.1', license: 'LGPL-2.1', compatibility: 'compatible', description: '较宽松的GPL许可证' },
    ],
    summary: { total: 30, compatible: 26, conflict: 3, undeclared: 1 },
  },
  'repo-deepseek-v3': {
    name: 'DeepSeek V3',
    licenses: [
      { name: 'Apache-2.0', version: '2.0', license: 'Apache-2.0', compatibility: 'compatible', description: '开源许可证，允许商业使用' },
      { name: 'MIT', version: '1.0', license: 'MIT', compatibility: 'compatible', description: '宽松的开源许可证' },
    ],
    summary: { total: 14, compatible: 12, conflict: 1, undeclared: 1 },
  },
  'repo-mistral-inference': {
    name: 'Mistral Inference',
    licenses: [
      { name: 'Apache-2.0', version: '2.0', license: 'Apache-2.0', compatibility: 'compatible', description: '开源许可证，允许商业使用' },
      { name: 'MIT', version: '1.0', license: 'MIT', compatibility: 'compatible', description: '宽松的开源许可证' },
      { name: 'BSD-3-Clause', version: '3.0', license: 'BSD-3-Clause', compatibility: 'compatible', description: 'BSD许可证变体' },
    ],
    summary: { total: 20, compatible: 17, conflict: 2, undeclared: 1 },
  },
};

interface Props {
  params: Promise<{
    repo: string;
  }>;
}

export default function LicenseDetailPage({ params }: Props) {
  const router = useRouter();
  const [licenseData, setLicenseData] = useState<{
    licenses: LicenseData[];
    summary: {
      total: number;
      compatible: number;
      conflict: number;
      undeclared: number;
    };
  }>({
    licenses: [],
    summary: { total: 0, compatible: 0, conflict: 0, undeclared: 0 },
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [repoName, setRepoName] = useState<string>('');
  const itemsPerPage = 20;

  const resolvedParams = use(params);
  const repo = resolvedParams.repo as string;

  useEffect(() => {
    async function fetchLicenseData() {
      try {
        const data = await loadLicenseData(repo);
        if (data) {
          setLicenseData({
            licenses: data.licenses,
            summary: data.summary,
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
          // 如果加载失败，使用默认数据作为备用
          const defaultData = repoLicenseDataMap['repo-pytorch'];
          setLicenseData({
            licenses: defaultData.licenses,
            summary: defaultData.summary,
          });
          setRepoName(defaultData.name);
        }
      } catch (error) {
        console.error('Error loading license data:', error);
        // 出错时使用默认数据
        const defaultData = repoLicenseDataMap['repo-pytorch'];
        setLicenseData({
          licenses: defaultData.licenses,
          summary: defaultData.summary,
        });
        setRepoName(defaultData.name);
      }
    }

    fetchLicenseData();
  }, [repo]);

  const filteredLicenses = licenseData.licenses.filter((license) =>
    license.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    license.license.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredLicenses.length / itemsPerPage);
  const paginatedLicenses = filteredLicenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getCompatibilityColor = (compatibility: string) => {
    switch (compatibility) {
      case 'compatible':
        return 'bg-green-600/20 text-green-400';
      case 'conflict':
        return 'bg-orange-600/20 text-orange-400';
      case 'undeclared':
        return 'bg-red-600/20 text-red-400';
      default:
        return 'bg-gray-600/20 text-gray-400';
    }
  };

  const getCompatibilityText = (compatibility: string) => {
    switch (compatibility) {
      case 'compatible':
        return '兼容';
      case 'conflict':
        return '冲突';
      case 'undeclared':
        return '未声明';
      default:
        return '未知';
    }
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
            <h1 className="text-2xl font-bold text-gradient">
              许可证合规性检测 - {repoName || repoLicenseDataMap[repo]?.name || repo}
            </h1>
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
            <h2 className="text-xl font-semibold mb-4">许可证概览</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 统计卡片 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{licenseData.summary.total}</div>
                  <div className="text-sm text-[var(--muted-foreground)]">许可证总数</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{licenseData.summary.compatible}</div>
                  <div className="text-sm text-[var(--muted-foreground)]">兼容许可证</div>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{licenseData.summary.conflict}</div>
                  <div className="text-sm text-[var(--muted-foreground)]">冲突许可证</div>
                </div>
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{licenseData.summary.undeclared}</div>
                  <div className="text-sm text-[var(--muted-foreground)]">未声明许可证</div>
                </div>
              </div>

              {/* Three.js 饼图 */}
              <div className="flex flex-col items-center justify-center">
                <h3 className="text-lg font-semibold mb-4">许可证分布</h3>
                <PieChart3D
                  data={[
                    { name: '兼容', value: licenseData.summary.compatible || 1, color: '#10b981' },
                    { name: '冲突', value: licenseData.summary.conflict || 1, color: '#f59e0b' },
                    { name: '未声明', value: licenseData.summary.undeclared || 1, color: '#ef4444' },
                  ]}
                  width={300}
                  height={300}
                />
                <div className="flex gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>兼容</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span>冲突</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>未声明</span>
                  </div>
                </div>
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
                placeholder="搜索许可证名称或类型..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-[var(--input)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
          </div>
        </div>

        {/* License Details Table */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg overflow-hidden">
          <div className="p-6 border-b border-[var(--border)]">
            <h2 className="text-xl font-semibold">许可证详情</h2>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              项目中使用到的所有许可证及其合规性状态 ({filteredLicenses.length} 个许可证)
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--input)]">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--muted-foreground)]">许可证名称</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--muted-foreground)]">版本</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--muted-foreground)]">许可证类型</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--muted-foreground)]">合规性状态</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--muted-foreground)]">描述</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {paginatedLicenses.map((license, index) => (
                  <tr key={index} className="hover:bg-[var(--input)] transition-colors">
                    <td className="px-4 py-3 text-sm font-medium">{license.name}</td>
                    <td className="px-4 py-3 text-sm text-[var(--muted-foreground)]">{license.version}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs">
                        {license.license}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${getCompatibilityColor(license.compatibility)}`}>
                        {getCompatibilityText(license.compatibility)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--muted-foreground)]">{license.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 p-4 border-t border-[var(--border)]">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-[var(--input)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded ${
                    currentPage === page
                      ? 'bg-[var(--primary)] text-white'
                      : 'bg-[var(--input)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-[var(--input)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
              </button>
            </div>
          )}

          {filteredLicenses.length === 0 && (
            <div className="text-center py-12 text-[var(--muted-foreground)]">没有找到匹配的许可证</div>
          )}
        </div>

      </main>
    </div>
  );
}