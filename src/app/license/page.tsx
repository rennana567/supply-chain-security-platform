'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const PieChart3D = dynamic(() => import('@/components/PieChart3D'), { ssr: false });

interface LicenseCompatible {
  license1: string;
  license1Path: string;
  license2: string;
  license2Path: string;
  conflictStatus: string;
  compatibilityExplanation: string;
}

interface LicenseUndeclared {
  name: string;
  version: string;
  purl: string;
  ecosystem: string;
  level: 'direct' | 'transitive';
  package: string;
  manager: string;
  path: string;
  license: string;
}

export default function LicensePage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'compatible' | 'undeclared'>('compatible');
  const [compatibleLicenses, setCompatibleLicenses] = useState<LicenseCompatible[]>([]);
  const [undeclaredLicenses, setUndeclaredLicenses] = useState<LicenseUndeclared[]>([]);
  const [summary, setSummary] = useState({ compatible: 0, conflict: 0, undeclared: 0 });
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    // TODO: 替换为真实 API 调用
    // 示例：
    // const fetchData = async () => {
    //   const result = await api.license.getResult(scanId);
    //   setCompatibleLicenses(result.compatible);
    //   setUndeclaredLicenses(result.undeclared);
    //   setSummary(result.summary);
    // };
    // fetchData();
    
    // 模拟 API 调用
    const mockCompatible = [
      {
        license1: 'MIT',
        license1Path: '/node_modules/react/LICENSE',
        license2: 'Apache-2.0',
        license2Path: '/node_modules/axios/LICENSE',
        conflictStatus: '兼容',
        compatibilityExplanation: 'MIT 和 Apache-2.0 许可证可以共存，无冲突',
      },
      {
        license1: 'GPL-3.0',
        license1Path: '/node_modules/some-gpl-package/LICENSE',
        license2: 'MIT',
        license2Path: '/node_modules/react/LICENSE',
        conflictStatus: '冲突',
        compatibilityExplanation: 'GPL-3.0 要求衍生作品也使用 GPL，与 MIT 存在兼容性问题',
      },
    ];

    const mockUndeclared = [
      {
        name: 'unknown-package',
        version: '1.0.0',
        purl: 'pkg:npm/unknown-package@1.0.0',
        ecosystem: 'npm',
        level: 'direct' as const,
        package: 'unknown-package',
        manager: 'npm',
        path: '/node_modules/unknown-package',
        license: 'Unknown',
      },
      {
        name: 'no-license-pkg',
        version: '2.1.0',
        purl: 'pkg:pypi/no-license-pkg@2.1.0',
        ecosystem: 'pypi',
        level: 'transitive' as const,
        package: 'no-license-pkg',
        manager: 'pip',
        path: '/venv/lib/python3.9/site-packages/no-license-pkg',
        license: 'Unknown',
      },
    ];

    setCompatibleLicenses(mockCompatible);
    setUndeclaredLicenses(mockUndeclared);
    setSummary({ compatible: 98, conflict: 13, undeclared: 12 });
  }, []);

  const pieData = [
    { name: '兼容', value: summary.compatible, color: '#10b981' },
    { name: '冲突', value: summary.conflict, color: '#ef4444' },
    { name: '未声明', value: summary.undeclared, color: '#94a3b8' },
  ];

  const exportReport = () => {
    // TODO: 实现真实的导出功能
    const data = viewMode === 'compatible' ? compatibleLicenses : undeclaredLicenses;
    const csv =
      viewMode === 'compatible'
        ? [
            ['许可证1', '许可证1路径', '许可证2', '许可证2路径', '冲突情况', '兼容性解释'].join(','),
            ...compatibleLicenses.map((l) =>
              [
                l.license1,
                l.license1Path,
                l.license2,
                l.license2Path,
                l.conflictStatus,
                l.compatibilityExplanation,
              ].join(',')
            ),
          ].join('\n')
        : [
            ['组件名', '版本', 'PURL', '生态系统', '层级', '包', '包管理器', '路径', '许可证'].join(','),
            ...undeclaredLicenses.map((l) =>
              [l.name, l.version, l.purl, l.ecosystem, l.level, l.package, l.manager, l.path, l.license].join(',')
            ),
          ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'license-report.csv';
    a.click();
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
            <h1 className="text-2xl font-bold text-gradient">许可证合规性检测</h1>
          </div>
          <button
            onClick={exportReport}
            className="px-4 py-2 bg-[#5b8def] hover:bg-[#7ba5f5] rounded-lg transition-all"
          >
            导出报告
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Stats Card */}
          <div className="bg-[#151b2e] border border-[#1e293b] rounded-lg p-6 card-gradient">
            <h2 className="text-lg font-semibold mb-4">合规性统计</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-3xl font-bold text-green-400">{summary.compatible}</div>
                <div className="text-sm text-gray-400">兼容</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-400">{summary.conflict}</div>
                <div className="text-sm text-gray-400">冲突</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-400">{summary.undeclared}</div>
                <div className="text-sm text-gray-400">未声明</div>
              </div>
            </div>
          </div>

          {/* Pie Chart Card */}
          <div className="bg-[#151b2e] border border-[#1e293b] rounded-lg p-6 card-gradient">
            <h2 className="text-lg font-semibold mb-4">许可证分布</h2>
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

        {/* View Mode Tabs */}
        <div className="bg-[#151b2e] border border-[#1e293b] rounded-lg p-6 mb-6 card-gradient">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('compatible')}
              className={`px-6 py-3 rounded-lg transition-all ${
                viewMode === 'compatible' ? 'bg-[#5b8def] text-white' : 'bg-[#0a0e1a] text-gray-400 hover:text-white'
              }`}
            >
              许可证兼容
            </button>
            <button
              onClick={() => setViewMode('undeclared')}
              className={`px-6 py-3 rounded-lg transition-all ${
                viewMode === 'undeclared' ? 'bg-[#5b8def] text-white' : 'bg-[#0a0e1a] text-gray-400 hover:text-white'
              }`}
            >
              许可证未声明
            </button>
          </div>
        </div>

        {/* Compatible Licenses Table */}
        {viewMode === 'compatible' && (
          <div className="bg-[#151b2e] border border-[#1e293b] rounded-lg overflow-hidden card-gradient">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0a0e1a]">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">许可证1</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">许可证1路径</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">许可证2</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">许可证2路径</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">冲突情况</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">兼容性解释</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e293b]">
                  {compatibleLicenses.map((license, index) => (
                    <tr key={index} className="hover:bg-[#1e293b]/30 transition-colors">
                      <td className="px-4 py-3 text-sm text-white font-medium">{license.license1}</td>
                      <td className="px-4 py-3 text-sm text-gray-400 max-w-xs truncate" title={license.license1Path}>
                        {license.license1Path}
                      </td>
                      <td className="px-4 py-3 text-sm text-white font-medium">{license.license2}</td>
                      <td className="px-4 py-3 text-sm text-gray-400 max-w-xs truncate" title={license.license2Path}>
                        {license.license2Path}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {license.conflictStatus === '兼容' ? (
                          <span className="px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs flex items-center gap-1 w-fit">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            兼容
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-red-600/20 text-red-400 rounded text-xs flex items-center gap-1 w-fit">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                            冲突
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400">{license.compatibilityExplanation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Undeclared Licenses Table */}
        {viewMode === 'undeclared' && (
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
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">路径</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">许可证</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e293b]">
                  {undeclaredLicenses.map((license, index) => (
                    <tr key={index} className="hover:bg-[#1e293b]/30 transition-colors">
                      <td className="px-4 py-3 text-sm text-white font-medium">{license.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-400">{license.version}</td>
                      <td className="px-4 py-3 text-sm text-gray-400 max-w-xs truncate" title={license.purl}>
                        {license.purl}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 bg-[#5b8def]/20 text-[#5b8def] rounded text-xs">
                          {license.ecosystem}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            license.level === 'direct'
                              ? 'bg-green-600/20 text-green-400'
                              : 'bg-yellow-600/20 text-yellow-400'
                          }`}
                        >
                          {license.level}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400">{license.package}</td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            license.manager === 'npm'
                              ? 'bg-[#5b8def]/20 text-[#5b8def]'
                              : license.manager === 'pip'
                              ? 'bg-purple-600/20 text-purple-400'
                              : 'bg-green-600/20 text-green-400'
                          }`}
                        >
                          {license.manager}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400 max-w-xs truncate" title={license.path}>
                        {license.path}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 bg-gray-600/20 text-gray-400 rounded text-xs">
                          {license.license}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {compatibleLicenses.length === 0 && viewMode === 'compatible' && (
          <div className="text-center py-12 text-gray-400">没有找到许可证兼容性数据</div>
        )}

        {undeclaredLicenses.length === 0 && viewMode === 'undeclared' && (
          <div className="text-center py-12 text-gray-400">没有找到未声明许可证的组件</div>
        )}
      </main>
    </div>
  );
}

