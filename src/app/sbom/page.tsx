'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const PieChart3D = dynamic(() => import('@/components/PieChart3D'), { ssr: false });

interface Component {
  name: string;
  version: string;
  purl: string;
  ecosystem: string;
  level: 'direct' | 'transitive';
  package: string;
  path: string;
  license: string;
  manager: string;
}

export default function SBOMPage() {
  const router = useRouter();
  const [components, setComponents] = useState<Component[]>([]);
  const [summary, setSummary] = useState({ total: 0, packages: 0, managers: 0, licenses: 0 });
  const [filterManager, setFilterManager] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // TODO: 替换为真实 API 调用
    // 示例：
    // const fetchData = async () => {
    //   const result = await api.sbom.getResult(scanId);
    //   setComponents(result.components);
    //   setSummary(result.summary);
    // };
    // fetchData();
    
    // 模拟 API 调用
    const mockData = {
      components: [
        {
          name: 'react',
          version: '18.2.0',
          purl: 'pkg:npm/react@18.2.0',
          ecosystem: 'npm',
          level: 'direct' as const,
          package: 'react',
          path: '/node_modules/react',
          license: 'MIT',
          manager: 'npm',
        },
        {
          name: 'next',
          version: '14.0.0',
          purl: 'pkg:npm/next@14.0.0',
          ecosystem: 'npm',
          level: 'direct' as const,
          package: 'next',
          path: '/node_modules/next',
          license: 'MIT',
          manager: 'npm',
        },
        {
          name: 'lodash',
          version: '4.17.21',
          purl: 'pkg:npm/lodash@4.17.21',
          ecosystem: 'npm',
          level: 'transitive' as const,
          package: 'lodash',
          path: '/node_modules/next/node_modules/lodash',
          license: 'MIT',
          manager: 'npm',
        },
        {
          name: 'django',
          version: '4.2.0',
          purl: 'pkg:pypi/django@4.2.0',
          ecosystem: 'pypi',
          level: 'direct' as const,
          package: 'django',
          path: '/venv/lib/python3.9/site-packages/django',
          license: 'BSD',
          manager: 'pip',
        },
        {
          name: 'requests',
          version: '2.31.0',
          purl: 'pkg:pypi/requests@2.31.0',
          ecosystem: 'pypi',
          level: 'transitive' as const,
          package: 'requests',
          path: '/venv/lib/python3.9/site-packages/requests',
          license: 'Apache-2.0',
          manager: 'pip',
        },
      ],
      summary: { total: 123, packages: 123, managers: 3, licenses: 12 },
    };
    setComponents(mockData.components);
    setSummary(mockData.summary);
  }, []);

  const filteredComponents = components.filter((comp) => {
    const matchesManager = filterManager === 'all' || comp.manager === filterManager;
    const matchesSearch = comp.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesManager && matchesSearch;
  });

  const totalPages = Math.ceil(filteredComponents.length / itemsPerPage);
  const paginatedComponents = filteredComponents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const pieData = [
    { name: 'npm', value: 80, color: '#5b8def' },
    { name: 'pip', value: 30, color: '#8b5cf6' },
    { name: 'go', value: 10, color: '#10b981' },
    { name: 'other', value: 3, color: '#f59e0b' },
  ];

  const exportData = (format: 'csv' | 'json') => {
    // TODO: 实现真实的导出功能
    // 示例：
    // if (format === 'csv') {
    //   exportToCSV(components, 'sbom.csv');
    // } else {
    //   exportToJSON(components, 'sbom.json');
    // }
    
    if (format === 'csv') {
      const csv = [
        ['组件名', '版本', 'PURL', '生态系统', '层级', '包', '路径', '许可证', '包管理器'].join(','),
        ...components.map((c) =>
          [c.name, c.version, c.purl, c.ecosystem, c.level, c.package, c.path, c.license, c.manager].join(',')
        ),
      ].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sbom.csv';
      a.click();
    } else {
      const json = JSON.stringify(components, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sbom.json';
      a.click();
    }
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
            <h1 className="text-2xl font-bold text-gradient">SBOM 清单</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => exportData('csv')}
              className="px-4 py-2 bg-[#5b8def] hover:bg-[#7ba5f5] rounded-lg transition-all"
            >
              导出 CSV
            </button>
            <button
              onClick={() => exportData('json')}
              className="px-4 py-2 bg-[#5b8def] hover:bg-[#7ba5f5] rounded-lg transition-all"
            >
              导出 JSON
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Stats Card */}
          <div className="bg-[#151b2e] border border-[#1e293b] rounded-lg p-6 card-gradient">
            <h2 className="text-lg font-semibold mb-4">组件统计</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-3xl font-bold text-white">{summary.total}</div>
                <div className="text-sm text-gray-400">组件数量</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#5b8def]">{summary.packages}</div>
                <div className="text-sm text-gray-400">包数量</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400">{summary.managers}</div>
                <div className="text-sm text-gray-400">包管理器数量</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400">{summary.licenses}</div>
                <div className="text-sm text-gray-400">许可证数量</div>
              </div>
            </div>
          </div>

          {/* Pie Chart Card */}
          <div className="bg-[#151b2e] border border-[#1e293b] rounded-lg p-6 card-gradient">
            <h2 className="text-lg font-semibold mb-4">包管理器占比</h2>
            <div className="flex justify-center items-center">
              <PieChart3D data={pieData} width={350} height={250} />
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-400">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-[#151b2e] border border-[#1e293b] rounded-lg p-6 mb-6 card-gradient">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="搜索组件名称..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-[#0a0e1a] border border-[#1e293b] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5b8def]"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'npm', 'pip', 'go'].map((manager) => (
                <button
                  key={manager}
                  onClick={() => setFilterManager(manager)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    filterManager === manager
                      ? 'bg-[#5b8def] text-white'
                      : 'bg-[#0a0e1a] text-gray-400 hover:text-white'
                  }`}
                >
                  {manager === 'all' ? '全部' : manager.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Components Table */}
        <div className="bg-[#151b2e] border border-[#1e293b] rounded-lg overflow-hidden card-gradient">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0a0e1a]">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">组件名</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">版本</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">PURL</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">生态系统</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">层级</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">包</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">包管理器</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">许可证</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">路径</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]">
                {paginatedComponents.map((component, index) => (
                  <tr key={index} className="hover:bg-[#1e293b]/30 transition-colors">
                    <td className="px-4 py-3 text-sm text-white font-medium">{component.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{component.version}</td>
                    <td className="px-4 py-3 text-sm text-gray-400 max-w-xs truncate" title={component.purl}>
                      {component.purl}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 bg-[#5b8def]/20 text-[#5b8def] rounded text-xs">
                        {component.ecosystem}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          component.level === 'direct'
                            ? 'bg-green-600/20 text-green-400'
                            : 'bg-yellow-600/20 text-yellow-400'
                        }`}
                      >
                        {component.level}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{component.package}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          component.manager === 'npm'
                            ? 'bg-[#5b8def]/20 text-[#5b8def]'
                            : component.manager === 'pip'
                            ? 'bg-purple-600/20 text-purple-400'
                            : 'bg-green-600/20 text-green-400'
                        }`}
                      >
                        {component.manager}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs">
                        {component.license}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400 max-w-xs truncate" title={component.path}>
                      {component.path}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 p-4 border-t border-[#1e293b]">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-[#0a0e1a] text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded ${
                    currentPage === page
                      ? 'bg-[#5b8def] text-white'
                      : 'bg-[#0a0e1a] text-gray-400 hover:text-white'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-[#0a0e1a] text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
              </button>
            </div>
          )}
        </div>

        {filteredComponents.length === 0 && (
          <div className="text-center py-12 text-gray-400">没有找到匹配的组件</div>
        )}
      </main>
    </div>
  );
}

