'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RepoInput } from '@/components/RepoInput';
import { ScanButton } from '@/components/ScanButton';
import { ModuleEntryCard } from '@/components/ModuleEntryCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getRepositoryId } from '@/lib/repo-ids';

export default function CodeRiskPage() {
  const router = useRouter();
  const [repoUrl, setRepoUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = async () => {
    if (!repoUrl.trim()) {
      alert('请输入仓库URL');
      return;
    }

    setIsScanning(true);

    setTimeout(() => {
      const repoId = getRepositoryId(repoUrl);
      router.push(`/code-risk/${repoId}`);
      setIsScanning(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="border-b border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/home" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
              ← 返回首页
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gradient">代码风险检测</h1>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">全面的代码安全风险评估</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">输入仓库URL开始代码风险检测</h2>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
          <ModuleEntryCard
            title="许可证合规性检测"
            description="自动检测许可证冲突和合规性"
            icon="📜"
            href="/license"
            data={{
              compatible: 0,
              conflict: 0,
              undeclared: 0,
            }}
            chartType="donut"
          />

          <ModuleEntryCard
            title="漏洞检测"
            description="实时对接CVE漏洞数据库"
            icon="🛡️"
            href="/vulnerability"
            data={{
              high: 0,
              medium: 0,
              low: 0,
            }}
            chartType="radar"
          />

          <ModuleEntryCard
            title="投毒风险检测"
            description="监控依赖包投毒风险"
            icon="⚠️"
            href="/poison"
            data={{
              tasks: 0,
              malicious: 0,
              benign: 0,
            }}
            chartType="line"
          />
        </div>

        {isScanning && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[var(--primary)] mb-4"></div>
            <p className="text-xl text-[var(--muted-foreground)]">正在扫描代码风险...</p>
            <p className="text-sm text-[var(--muted-foreground)] mt-2">这可能需要几分钟时间，请耐心等待</p>
          </div>
        )}
      </main>
    </div>
  );
}