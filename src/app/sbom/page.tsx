'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RepoInput } from '@/components/RepoInput';
import { ScanButton } from '@/components/ScanButton';
import { getRepositoryId } from '@/lib/repo-ids';

export default function SBOMPage() {
  const router = useRouter();
  const [repoUrl, setRepoUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [inputError, setInputError] = useState('');

  const handleScan = async () => {
    // 验证输入
    if (!repoUrl.trim()) {
      setInputError('请输入仓库URL或上传压缩包');
      return;
    }

    setInputError('');
    setIsScanning(true);

    // 模拟扫描过程
    setTimeout(() => {
      setIsScanning(false);

      // 提取repo标识符并导航到对应的SBOM页面
      const repoId = getRepositoryId(repoUrl);
      router.push(`/sbom/${repoId}`);
    }, 1500);
  };


  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      {/* Header */}
      <header className="border-b border-[#1e293b] bg-[#151b2e]/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/home')}
              className="text-[#10b981] hover:text-[#34d399] transition-colors"
            >
              🏠 返回首页
            </button>
            <h1 className="text-2xl font-bold text-gradient">SBOM 清单分析</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Input Section */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-xl text-[var(--muted-foreground)] mb-8">
            输入仓库 URL 开始 SBOM 分析
          </p>

          <div className="max-w-2xl mx-auto">
            <RepoInput
              value={repoUrl}
              onChange={setRepoUrl}
              required={true}
              error={inputError}
            />
            <div className="mt-4 flex justify-center">
              <ScanButton onClick={handleScan} isLoading={isScanning} />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isScanning && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[var(--primary)] mb-4"></div>
            <p className="text-xl text-[var(--muted-foreground)]">正在分析 SBOM 数据...</p>
            <p className="text-sm text-[var(--muted-foreground)] mt-2">这可能需要几分钟时间，请耐心等待</p>
          </div>
        )}

        {/* Feature Highlights */}
        <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#151b2e] border border-[#1e293b] rounded-lg p-6 text-left">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="text-2xl">🔍</span>
              深度组件分析
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              自动识别项目中的所有依赖组件，包括直接依赖和传递依赖，生成完整的软件物料清单。
            </p>
          </div>

          <div className="bg-[#151b2e] border border-[#1e293b] rounded-lg p-6 text-left">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="text-2xl">📊</span>
              可视化统计
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              提供详细的组件统计信息，包括包管理器分布、许可证类型、依赖层级等可视化图表。
            </p>
          </div>

          <div className="bg-[#151b2e] border border-[#1e293b] rounded-lg p-6 text-left">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="text-2xl">📜</span>
              许可证合规
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              自动检测组件许可证信息，识别许可证冲突，确保项目符合开源许可证合规要求。
            </p>
          </div>

          <div className="bg-[#151b2e] border border-[#1e293b] rounded-lg p-6 text-left">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="text-2xl">💾</span>
              数据导出
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              支持导出 CSV 和 JSON 格式的 SBOM 数据，便于进一步分析和集成到其他工具中。
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

