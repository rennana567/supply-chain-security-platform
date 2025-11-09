'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import PieChart3D from '@/components/PieChart3D';

interface LicenseData {
  name: string;
  version: string;
  license: string;
  compatibility: 'compatible' | 'conflict' | 'undeclared';
  description: string;
}

// 基于检测结果目录的mock数据映射
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
    ],
    summary: { total: 15, compatible: 12, conflict: 2, undeclared: 1 },
  },
  'repo-vue-django': {
    name: 'Vue Django Book Shop',
    licenses: [
      { name: 'MIT', version: '1.0', license: 'MIT', compatibility: 'compatible', description: '宽松的开源许可证' },
      { name: 'BSD-3-Clause', version: '3.0', license: 'BSD-3-Clause', compatibility: 'compatible', description: 'BSD许可证变体' },
    ],
    summary: { total: 8, compatible: 7, conflict: 1, undeclared: 0 },
  },
  'repo-probabilistic-forecasts': {
    name: 'Probabilistic Forecasts Attacks',
    licenses: [
      { name: 'Apache-2.0', version: '2.0', license: 'Apache-2.0', compatibility: 'compatible', description: '开源许可证，允许商业使用' },
      { name: 'LGPL-2.1', version: '2.1', license: 'LGPL-2.1', compatibility: 'compatible', description: '较宽松的GPL许可证' },
    ],
    summary: { total: 22, compatible: 18, conflict: 3, undeclared: 1 },
  },
  'repo-wumei-smart': {
    name: 'Wumei Smart',
    licenses: [
      { name: 'MIT', version: '1.0', license: 'MIT', compatibility: 'compatible', description: '宽松的开源许可证' },
      { name: 'GPL-2.0', version: '2.0', license: 'GPL-2.0', compatibility: 'conflict', description: '与MIT存在冲突' },
    ],
    summary: { total: 11, compatible: 9, conflict: 1, undeclared: 1 },
  },
  'repo-xiangtian-workbench': {
    name: 'Xiangtian Workbench',
    licenses: [
      { name: 'Apache-2.0', version: '2.0', license: 'Apache-2.0', compatibility: 'compatible', description: '开源许可证，允许商业使用' },
      { name: 'BSD-2-Clause', version: '2.0', license: 'BSD-2-Clause', compatibility: 'compatible', description: 'BSD许可证变体' },
    ],
    summary: { total: 18, compatible: 15, conflict: 2, undeclared: 1 },
  },
  'repo-pytorch-002': {
    name: 'PyTorch',
    licenses: [
      { name: 'BSD-3-Clause', version: '3.0', license: 'BSD-3-Clause', compatibility: 'compatible', description: 'BSD许可证变体' },
      { name: 'MIT', version: '1.0', license: 'MIT', compatibility: 'compatible', description: '宽松的开源许可证' },
    ],
    summary: { total: 25, compatible: 22, conflict: 2, undeclared: 1 },
  },
  'repo-llama-001': {
    name: 'Meta Llama',
    licenses: [
      { name: 'Custom', version: '1.0', license: 'Llama Community License', compatibility: 'compatible', description: 'Meta自定义许可证' },
      { name: 'MIT', version: '1.0', license: 'MIT', compatibility: 'compatible', description: '宽松的开源许可证' },
    ],
    summary: { total: 12, compatible: 10, conflict: 1, undeclared: 1 },
  },
  'repo-tensorflow-003': {
    name: 'TensorFlow',
    licenses: [
      { name: 'Apache-2.0', version: '2.0', license: 'Apache-2.0', compatibility: 'compatible', description: '开源许可证，允许商业使用' },
      { name: 'BSD-3-Clause', version: '3.0', license: 'BSD-3-Clause', compatibility: 'compatible', description: 'BSD许可证变体' },
    ],
    summary: { total: 30, compatible: 26, conflict: 3, undeclared: 1 },
  },
  'repo-react-004': {
    name: 'React',
    licenses: [
      { name: 'MIT', version: '1.0', license: 'MIT', compatibility: 'compatible', description: '宽松的开源许可证' },
      { name: 'Apache-2.0', version: '2.0', license: 'Apache-2.0', compatibility: 'compatible', description: '开源许可证，允许商业使用' },
    ],
    summary: { total: 14, compatible: 12, conflict: 1, undeclared: 1 },
  },
  'repo-nodejs-005': {
    name: 'Node.js',
    licenses: [
      { name: 'MIT', version: '1.0', license: 'MIT', compatibility: 'compatible', description: '宽松的开源许可证' },
      { name: 'ISC', version: '1.0', license: 'ISC', compatibility: 'compatible', description: '类似MIT的许可证' },
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

  const resolvedParams = use(params);
  const repo = resolvedParams.repo as string;

  useEffect(() => {
    // 根据repo参数获取数据
    const repoData = repoLicenseDataMap[repo];
    if (repoData) {
      setLicenseData({
        licenses: repoData.licenses,
        summary: repoData.summary,
      });
    } else {
      // 如果没有找到数据，使用默认数据
      const defaultData = repoLicenseDataMap['repo-pytorch-002'];
      setLicenseData({
        licenses: defaultData.licenses,
        summary: defaultData.summary,
      });
    }
  }, [repo]);

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
            <div>
              <h1 className="text-2xl font-bold text-gradient">
                许可证合规性检测 - {repoLicenseDataMap[resolvedParams.repo]?.name || resolvedParams.repo}
              </h1>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">详细的许可证合规性分析</p>
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

        {/* License Details Table */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg overflow-hidden">
          <div className="p-6 border-b border-[var(--border)]">
            <h2 className="text-xl font-semibold">许可证详情</h2>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              项目中使用到的所有许可证及其合规性状态
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
                {licenseData.licenses.map((license, index) => (
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

          {licenseData.licenses.length === 0 && (
            <div className="text-center py-12 text-[var(--muted-foreground)]">没有找到许可证数据</div>
          )}
        </div>

      </main>
    </div>
  );
}