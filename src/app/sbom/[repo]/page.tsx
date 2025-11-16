'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import PieChart3D from '@/components/PieChart3D';
import { getSBOMData, Component, SBOMSummary, PieData } from '@/lib/sbom-parser';

// 模拟数据映射（作为备用）
interface RepoData {
  name: string;
  components: Component[];
  summary: {
    total: number;
    packages: number;
    managers: number;
    licenses: number;
  };
  pieData: { name: string; value: number; color: string }[];
}

const repoDataMap: Record<string, RepoData> = {
  'repo-pytorch': {
    name: 'PyTorch',
    components: [
      {
        name: 'torch',
        version: '2.4.1',
        purl: 'pkg:pypi/torch@2.4.1',
        ecosystem: 'pypi',
        level: 'direct' as const,
        package: 'torch',
        path: '/venv/lib/python3.9/site-packages/torch',
        license: 'BSD',
        manager: 'pip',
      },
      {
        name: 'numpy',
        version: '1.24.0',
        purl: 'pkg:pypi/numpy@1.24.0',
        ecosystem: 'pypi',
        level: 'direct' as const,
        package: 'numpy',
        path: '/venv/lib/python3.9/site-packages/numpy',
        license: 'BSD',
        manager: 'pip',
      },
      {
        name: 'scipy',
        version: '1.10.0',
        purl: 'pkg:pypi/scipy@1.10.0',
        ecosystem: 'pypi',
        level: 'direct' as const,
        package: 'scipy',
        path: '/venv/lib/python3.9/site-packages/scipy',
        license: 'BSD',
        manager: 'pip',
      },
      {
        name: 'transformers',
        version: '4.46.3',
        purl: 'pkg:pypi/transformers@4.46.3',
        ecosystem: 'pypi',
        level: 'transitive' as const,
        package: 'transformers',
        path: '/venv/lib/python3.9/site-packages/transformers',
        license: 'Apache-2.0',
        manager: 'pip',
      },
      {
        name: 'matplotlib',
        version: '3.7.0',
        purl: 'pkg:pypi/matplotlib@3.7.0',
        ecosystem: 'pypi',
        level: 'transitive' as const,
        package: 'matplotlib',
        path: '/venv/lib/python3.9/site-packages/matplotlib',
        license: 'PSF',
        manager: 'pip',
      },
      {
        name: 'pandas',
        version: '2.0.0',
        purl: 'pkg:pypi/pandas@2.0.0',
        ecosystem: 'pypi',
        level: 'transitive' as const,
        package: 'pandas',
        path: '/venv/lib/python3.9/site-packages/pandas',
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
      {
        name: 'pillow',
        version: '10.0.0',
        purl: 'pkg:pypi/pillow@10.0.0',
        ecosystem: 'pypi',
        level: 'transitive' as const,
        package: 'pillow',
        path: '/venv/lib/python3.9/site-packages/pillow',
        license: 'HPND',
        manager: 'pip',
      },
      {
        name: 'opencv-python',
        version: '4.8.0',
        purl: 'pkg:pypi/opencv-python@4.8.0',
        ecosystem: 'pypi',
        level: 'transitive' as const,
        package: 'opencv-python',
        path: '/venv/lib/python3.9/site-packages/opencv-python',
        license: 'Apache-2.0',
        manager: 'pip',
      },
      {
        name: 'tensorboard',
        version: '2.14.0',
        purl: 'pkg:pypi/tensorboard@2.14.0',
        ecosystem: 'pypi',
        level: 'transitive' as const,
        package: 'tensorboard',
        path: '/venv/lib/python3.9/site-packages/tensorboard',
        license: 'Apache-2.0',
        manager: 'pip',
      },
      {
        name: 'protobuf',
        version: '4.24.0',
        purl: 'pkg:pypi/protobuf@4.24.0',
        ecosystem: 'pypi',
        level: 'transitive' as const,
        package: 'protobuf',
        path: '/venv/lib/python3.9/site-packages/protobuf',
        license: 'BSD-3-Clause',
        manager: 'pip',
      },
      {
        name: 'onnx',
        version: '1.14.0',
        purl: 'pkg:pypi/onnx@1.14.0',
        ecosystem: 'pypi',
        level: 'transitive' as const,
        package: 'onnx',
        path: '/venv/lib/python3.9/site-packages/onnx',
        license: 'MIT',
        manager: 'pip',
      },
      {
        name: 'tqdm',
        version: '4.65.0',
        purl: 'pkg:pypi/tqdm@4.65.0',
        ecosystem: 'pypi',
        level: 'transitive' as const,
        package: 'tqdm',
        path: '/venv/lib/python3.9/site-packages/tqdm',
        license: 'MIT',
        manager: 'pip',
      },
      {
        name: 'psutil',
        version: '5.9.0',
        purl: 'pkg:pypi/psutil@5.9.0',
        ecosystem: 'pypi',
        level: 'transitive' as const,
        package: 'psutil',
        path: '/venv/lib/python3.9/site-packages/psutil',
        license: 'BSD-3-Clause',
        manager: 'pip',
      },
      {
        name: 'pyyaml',
        version: '6.0',
        purl: 'pkg:pypi/pyyaml@6.0',
        ecosystem: 'pypi',
        level: 'transitive' as const,
        package: 'pyyaml',
        path: '/venv/lib/python3.9/site-packages/pyyaml',
        license: 'MIT',
        manager: 'pip',
      },
      {
        name: 'h5py',
        version: '3.9.0',
        purl: 'pkg:pypi/h5py@3.9.0',
        ecosystem: 'pypi',
        level: 'transitive' as const,
        package: 'h5py',
        path: '/venv/lib/python3.9/site-packages/h5py',
        license: 'BSD',
        manager: 'pip',
      },
      {
        name: 'networkx',
        version: '3.1',
        purl: 'pkg:pypi/networkx@3.1',
        ecosystem: 'pypi',
        level: 'transitive' as const,
        package: 'networkx',
        path: '/venv/lib/python3.9/site-packages/networkx',
        license: 'BSD',
        manager: 'pip',
      },
      {
        name: 'sympy',
        version: '1.12',
        purl: 'pkg:pypi/sympy@1.12',
        ecosystem: 'pypi',
        level: 'transitive' as const,
        package: 'sympy',
        path: '/venv/lib/python3.9/site-packages/sympy',
        license: 'BSD',
        manager: 'pip',
      },
      {
        name: 'scikit-learn',
        version: '1.3.0',
        purl: 'pkg:pypi/scikit-learn@1.3.0',
        ecosystem: 'pypi',
        level: 'transitive' as const,
        package: 'scikit-learn',
        path: '/venv/lib/python3.9/site-packages/scikit-learn',
        license: 'BSD',
        manager: 'pip',
      },
      {
        name: 'jupyter',
        version: '1.0.0',
        purl: 'pkg:pypi/jupyter@1.0.0',
        ecosystem: 'pypi',
        level: 'transitive' as const,
        package: 'jupyter',
        path: '/venv/lib/python3.9/site-packages/jupyter',
        license: 'BSD',
        manager: 'pip',
      },
    ],
    summary: { total: 718, packages: 718, managers: 3, licenses: 15 },
    pieData: [
      { name: 'npm', value: 150, color: '#5b8def' },
      { name: 'pip', value: 520, color: '#8b5cf6' },
      { name: 'go', value: 48, color: '#10b981' },
    ],
  },
  'repo-llama': {
    name: 'Meta Llama',
    components: [
      {
        name: 'llama',
        version: '3.1',
        purl: 'pkg:pypi/llama@3.1',
        ecosystem: 'pypi',
        level: 'direct' as const,
        package: 'llama',
        path: '/venv/lib/python3.9/site-packages/llama',
        license: 'Custom',
        manager: 'pip',
      },
    ],
    summary: { total: 1, packages: 1, managers: 1, licenses: 1 },
    pieData: [
      { name: 'pip', value: 1, color: '#8b5cf6' },
    ],
  },
  'repo-kafka-python': {
    name: 'Kafka Python',
    components: [
      {
        name: 'kafka-python',
        version: '2.0.2',
        purl: 'pkg:pypi/kafka-python@2.0.2',
        ecosystem: 'pypi',
        level: 'direct' as const,
        package: 'kafka-python',
        path: '/venv/lib/python3.9/site-packages/kafka-python',
        license: 'Apache-2.0',
        manager: 'pip',
      },
      {
        name: 'zope.interface',
        version: '6.0',
        purl: 'pkg:pypi/zope.interface@6.0',
        ecosystem: 'pypi',
        level: 'transitive' as const,
        package: 'zope.interface',
        path: '/venv/lib/python3.9/site-packages/zope/interface',
        license: 'ZPL-2.1',
        manager: 'pip',
      },
      {
        name: 'lxml',
        version: '4.9.0',
        purl: 'pkg:pypi/lxml@4.9.0',
        ecosystem: 'pypi',
        level: 'transitive' as const,
        package: 'lxml',
        path: '/venv/lib/python3.9/site-packages/lxml',
        license: 'BSD',
        manager: 'pip',
      },
      {
        name: 'six',
        version: '1.16.0',
        purl: 'pkg:pypi/six@1.16.0',
        ecosystem: 'pypi',
        level: 'transitive' as const,
        package: 'six',
        path: '/venv/lib/python3.9/site-packages/six',
        license: 'MIT',
        manager: 'pip',
      },
      {
        name: 'python-dateutil',
        version: '2.8.2',
        purl: 'pkg:pypi/python-dateutil@2.8.2',
        ecosystem: 'pypi',
        level: 'transitive' as const,
        package: 'python-dateutil',
        path: '/venv/lib/python3.9/site-packages/dateutil',
        license: 'BSD',
        manager: 'pip',
      },
      {
        name: 'pytz',
        version: '2023.3',
        purl: 'pkg:pypi/pytz@2023.3',
        ecosystem: 'pypi',
        level: 'transitive' as const,
        package: 'pytz',
        path: '/venv/lib/python3.9/site-packages/pytz',
        license: 'MIT',
        manager: 'pip',
      },
      {
        name: 'certifi',
        version: '2023.7.22',
        purl: 'pkg:pypi/certifi@2023.7.22',
        ecosystem: 'pypi',
        level: 'transitive' as const,
        package: 'certifi',
        path: '/venv/lib/python3.9/site-packages/certifi',
        license: 'MPL-2.0',
        manager: 'pip',
      },
      {
        name: 'charset-normalizer',
        version: '3.2.0',
        purl: 'pkg:pypi/charset-normalizer@3.2.0',
        ecosystem: 'pypi',
        level: 'transitive' as const,
        package: 'charset-normalizer',
        path: '/venv/lib/python3.9/site-packages/charset_normalizer',
        license: 'MIT',
        manager: 'pip',
      },
      {
        name: 'idna',
        version: '3.4',
        purl: 'pkg:pypi/idna@3.4',
        ecosystem: 'pypi',
        level: 'transitive' as const,
        package: 'idna',
        path: '/venv/lib/python3.9/site-packages/idna',
        license: 'BSD-3-Clause',
        manager: 'pip',
      },
      {
        name: 'urllib3',
        version: '1.26.16',
        purl: 'pkg:pypi/urllib3@1.26.16',
        ecosystem: 'pypi',
        level: 'transitive' as const,
        package: 'urllib3',
        path: '/venv/lib/python3.9/site-packages/urllib3',
        license: 'MIT',
        manager: 'pip',
      },
    ],
    summary: { total: 12, packages: 12, managers: 1, licenses: 8 },
    pieData: [
      { name: 'pip', value: 12, color: '#8b5cf6' },
    ],
  },
  'repo-probabilistic-forecasts': {
    name: 'Probabilistic Forecasts Attacks',
    components: [
      {
        name: 'numpy',
        version: '1.24.0',
        purl: 'pkg:pypi/numpy@1.24.0',
        ecosystem: 'pypi',
        level: 'direct' as const,
        package: 'numpy',
        path: '/venv/lib/python3.9/site-packages/numpy',
        license: 'BSD',
        manager: 'pip',
      },
      {
        name: 'scipy',
        version: '1.10.0',
        purl: 'pkg:pypi/scipy@1.10.0',
        ecosystem: 'pypi',
        level: 'direct' as const,
        package: 'scipy',
        path: '/venv/lib/python3.9/site-packages/scipy',
        license: 'BSD',
        manager: 'pip',
      },
      {
        name: 'matplotlib',
        version: '3.7.0',
        purl: 'pkg:pypi/matplotlib@3.7.0',
        ecosystem: 'pypi',
        level: 'direct' as const,
        package: 'matplotlib',
        path: '/venv/lib/python3.9/site-packages/matplotlib',
        license: 'PSF',
        manager: 'pip',
      },
      {
        name: 'pandas',
        version: '2.0.0',
        purl: 'pkg:pypi/pandas@2.0.0',
        ecosystem: 'pypi',
        level: 'direct' as const,
        package: 'pandas',
        path: '/venv/lib/python3.9/site-packages/pandas',
        license: 'BSD',
        manager: 'pip',
      },
      {
        name: 'scikit-learn',
        version: '1.3.0',
        purl: 'pkg:pypi/scikit-learn@1.3.0',
        ecosystem: 'pypi',
        level: 'direct' as const,
        package: 'scikit-learn',
        path: '/venv/lib/python3.9/site-packages/scikit-learn',
        license: 'BSD',
        manager: 'pip',
      },
      {
        name: 'tensorflow',
        version: '2.14.0',
        purl: 'pkg:pypi/tensorflow@2.14.0',
        ecosystem: 'pypi',
        level: 'direct' as const,
        package: 'tensorflow',
        path: '/venv/lib/python3.9/site-packages/tensorflow',
        license: 'Apache-2.0',
        manager: 'pip',
      },
      {
        name: 'torch',
        version: '2.4.1',
        purl: 'pkg:pypi/torch@2.4.1',
        ecosystem: 'pypi',
        level: 'direct' as const,
        package: 'torch',
        path: '/venv/lib/python3.9/site-packages/torch',
        license: 'BSD',
        manager: 'pip',
      },
      {
        name: 'jupyter',
        version: '1.0.0',
        purl: 'pkg:pypi/jupyter@1.0.0',
        ecosystem: 'pypi',
        level: 'transitive' as const,
        package: 'jupyter',
        path: '/venv/lib/python3.9/site-packages/jupyter',
        license: 'BSD',
        manager: 'pip',
      },
      {
        name: 'notebook',
        version: '7.0.0',
        purl: 'pkg:pypi/notebook@7.0.0',
        ecosystem: 'pypi',
        level: 'transitive' as const,
        package: 'notebook',
        path: '/venv/lib/python3.9/site-packages/notebook',
        license: 'BSD',
        manager: 'pip',
      },
      {
        name: 'ipykernel',
        version: '6.25.0',
        purl: 'pkg:pypi/ipykernel@6.25.0',
        ecosystem: 'pypi',
        level: 'transitive' as const,
        package: 'ipykernel',
        path: '/venv/lib/python3.9/site-packages/ipykernel',
        license: 'BSD',
        manager: 'pip',
      },
    ],
    summary: { total: 47, packages: 47, managers: 1, licenses: 6 },
    pieData: [
      { name: 'pip', value: 47, color: '#8b5cf6' },
    ],
  },
  // 可以添加更多repo的数据
};

interface Props {
  params: Promise<{
    repo: string;
  }>;
}

export default function SBOMPage({ params }: Props) {
  const router = useRouter();
  const [components, setComponents] = useState<Component[]>([]);
  const [summary, setSummary] = useState({ total: 0, packages: 0, managers: 0, licenses: 0 });
  const [pieData, setPieData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [filterManager, setFilterManager] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [repoName, setRepoName] = useState<string>('');
  const itemsPerPage = 20;

  const resolvedParams = use(params);
  const repo = resolvedParams.repo as string;

  useEffect(() => {
    const loadSBOMData = async () => {
      try {
        // 首先尝试加载真实的SBOM数据
        const sbomData = await getSBOMData(repo);
        if (sbomData) {
          setComponents(sbomData.components);
          setSummary(sbomData.summary);
          setPieData(sbomData.pieData);
          setRepoName(sbomData.name);
        } else {
          // 如果真实数据加载失败，使用模拟数据作为备用
          const repoData = repoDataMap[repo];
          if (repoData) {
            setComponents(repoData.components);
            setSummary(repoData.summary);
            setPieData(repoData.pieData);
            setRepoName(repoData.name);
          } else {
            // 如果没有找到数据，使用空数据
            setComponents([]);
            setSummary({ total: 0, packages: 0, managers: 0, licenses: 0 });
            setPieData([]);
            setRepoName(repo);
          }
        }
      } catch (error) {
        console.error('Error loading SBOM data:', error);
        // 出错时使用空数据
        setComponents([]);
        setSummary({ total: 0, packages: 0, managers: 0, licenses: 0 });
        setPieData([]);
        setRepoName(repo);
      }
    };

    loadSBOMData();
  }, [repo]);

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

  // 计算要展示的分页页码（主流风格：首尾页 + 当前页附近 + 省略号）
  const getPageNumbers = () => {
    const maxVisible = 7; // 最多展示的按钮数量（包含首尾页和省略号）
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | 'dots-left' | 'dots-right')[] = [];
    const showLeft = currentPage - 1;
    const showRight = currentPage + 1;

    pages.push(1);

    if (showLeft <= 2) {
      // 当前页靠近左边，直接展示前几页
      for (let p = 2; p <= 4; p++) {
        pages.push(p);
      }
      pages.push('dots-right');
    } else if (showRight >= totalPages - 1) {
      // 当前页靠近右边，展示后几页
      pages.push('dots-left');
      for (let p = totalPages - 4; p <= totalPages - 1; p++) {
        pages.push(p);
      }
    } else {
      // 当前页在中间，左右各展示一页
      pages.push('dots-left');
      pages.push(currentPage - 1);
      pages.push(currentPage);
      pages.push(currentPage + 1);
      pages.push('dots-right');
    }

    pages.push(totalPages);
    return pages;
  };

  const exportData = (format: 'csv' | 'json') => {
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
      a.download = `sbom-${repo.replace('/', '-')}.csv`;
      a.click();
    } else {
      const json = JSON.stringify(components, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sbom-${repo.replace('/', '-')}.json`;
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
            <h1 className="text-2xl font-bold text-gradient">
              SBOM 清单 - {repoName || repoDataMap[repo]?.name || repo}
            </h1>
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
                  <span className="text-sm text-gray-400">{item.name} ({item.value})</span>
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
              {['all', ...new Set(components.map(c => c.manager))].map((manager) => (
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
                            : component.manager === 'go'
                            ? 'bg-green-600/20 text-green-400'
                            : component.manager === 'maven'
                            ? 'bg-yellow-600/20 text-yellow-400'
                            : component.manager === 'nuget'
                            ? 'bg-red-600/20 text-red-400'
                            : component.manager === 'cargo'
                            ? 'bg-orange-600/20 text-orange-400'
                            : component.manager === 'composer'
                            ? 'bg-cyan-600/20 text-cyan-400'
                            : component.manager === 'gem'
                            ? 'bg-pink-600/20 text-pink-400'
                            : 'bg-gray-600/20 text-gray-400'
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
              {/* 首页 */}
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-[#0a0e1a] text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                首页
              </button>

              {/* 上一页 */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-[#0a0e1a] text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>

              {/* 中间页码 + 省略号 */}
              {getPageNumbers().map((item, index) => {
                if (item === 'dots-left' || item === 'dots-right') {
                  return (
                    <span key={`${item}-${index}`} className="px-2 text-gray-500">
                      ...
                    </span>
                  );
                }

                const page = item as number;
                return (
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
                );
              })}

              {/* 下一页 */}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-[#0a0e1a] text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
              </button>

              {/* 末页 */}
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-[#0a0e1a] text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                末页
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