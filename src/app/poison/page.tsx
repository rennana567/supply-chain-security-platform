'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RepoInput } from '@/components/RepoInput';
import { ScanButton } from '@/components/ScanButton';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getRepositoryId } from '@/lib/repo-ids';

export default function PoisonPage() {
  const router = useRouter();
  const [repoUrl, setRepoUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = async () => {
    if (!repoUrl.trim()) {
      alert('请输入仓库URL');
      return;
    }

    setIsScanning(true);

    // 模拟扫描过程
    setTimeout(() => {
      const repoId = getRepositoryId(repoUrl);

      // 导航到动态路由页面
      router.push(`/poison/${repoId}`);

      setIsScanning(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/code-risk" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
              ← 返回代码风险检测
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gradient">投毒风险检测</h1>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">监控依赖包投毒风险</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Input Section */}
        <div className="mb-8">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">输入仓库URL开始投毒风险检测</h2>
            <RepoInput
              value={repoUrl}
              onChange={setRepoUrl}
              required={true}
              placeholder="输入GitHub或Gitee仓库URL"
            />
            <div className="mt-4 flex justify-center">
              <ScanButton onClick={handleScan} isLoading={isScanning} />
            </div>
          </div>
        </div>

        {/* Feature Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="text-2xl">🔍</span>
              恶意代码检测
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
              深度扫描依赖包中的恶意代码注入，识别隐藏的后门、数据窃取代码和其他恶意行为，保障软件供应链的安全性。
            </p>
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="text-2xl">📊</span>
              行为分析
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
              分析依赖包的运行时行为，检测异常的网络通信、文件操作和系统调用，及时发现可疑的投毒行为模式。
            </p>
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="text-2xl">✅</span>
              风险预警
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
              实时监控依赖包的投毒风险，提供及时的风险预警和防护建议，帮助开发团队快速响应安全威胁。
            </p>
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="text-2xl">🛡️</span>
              持续监测
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
              支持按需扫描和持续监测两种模式，自动定期扫描项目依赖，及时发现新增的投毒风险，确保软件供应链长期安全。
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isScanning && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[var(--primary)] mb-4"></div>
            <p className="text-xl text-[var(--muted-foreground)]">正在扫描投毒风险...</p>
            <p className="text-sm text-[var(--muted-foreground)] mt-2">这可能需要几分钟时间，请耐心等待</p>
          </div>
        )}
      </main>
    </div>
  );
}