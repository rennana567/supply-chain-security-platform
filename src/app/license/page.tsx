'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RepoInput } from '@/components/RepoInput';
import { ScanButton } from '@/components/ScanButton';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getRepositoryId } from '@/lib/repo-ids';

export default function LicensePage() {
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
      router.push(`/license/${repoId}`);

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
              <h1 className="text-2xl font-bold text-gradient">许可证合规性检测</h1>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">自动检测项目中的许可证使用情况</p>
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
            <h2 className="text-lg font-semibold mb-4">输入仓库URL开始许可证合规性检测</h2>
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
              自动检测
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
              自动扫描项目中的所有依赖包，识别使用的许可证类型，检测许可证冲突和未声明的许可证。
            </p>
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="text-2xl">📊</span>
              合规性分析
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
              提供详细的许可证合规性报告，包括兼容性分析、冲突检测和风险等级评估。
            </p>
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="text-2xl">✅</span>
              解决方案
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
              针对发现的许可证问题提供具体的解决方案和建议，帮助项目符合开源许可证合规要求。
            </p>
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="text-2xl">🛡️</span>
              风险预警
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
              及时发现许可证相关的法律风险，避免因许可证冲突导致的商业和法律问题。
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isScanning && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[var(--primary)] mb-4"></div>
            <p className="text-xl text-[var(--muted-foreground)]">正在扫描许可证合规性...</p>
            <p className="text-sm text-[var(--muted-foreground)] mt-2">这可能需要几分钟时间，请耐心等待</p>
          </div>
        )}
      </main>
    </div>
  );
}

