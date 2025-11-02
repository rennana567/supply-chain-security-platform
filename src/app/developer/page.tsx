'use client';

import { useRouter } from 'next/navigation';

export default function DeveloperPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="text-[var(--primary)] hover:text-[var(--primary)]/80 transition-colors"
            >
              ← 返回
            </button>
            <button
              onClick={() => router.push('/home')}
              className="text-[#10b981] hover:text-[#34d399] transition-colors"
            >
              🏠 返回首页
            </button>
            <h1 className="text-2xl font-bold text-gradient">开发者画像</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gradient">选择分析模式</h2>
          <p className="text-[var(--muted-foreground)] text-lg">
            请选择您要分析的开发者画像类型
          </p>
        </div>

        {/* Module Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Individual Developer Card */}
          <div 
            onClick={() => router.push('/developer/individual')}
            className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-8 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-[var(--primary)]/20 hover:border-[var(--primary)]/50 glow-hover group"
          >
            <div className="text-center mb-6">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">👨‍💻</div>
              <h3 className="text-2xl font-bold mb-2">个人开发者画像</h3>
              <p className="text-sm text-[var(--muted-foreground)]">
                深度分析单个开发者的贡献、技能和影响力
              </p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[var(--primary)]">✓</span>
                <span>提交节律热力图与趋势分析</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[var(--primary)]">✓</span>
                <span>技能画像（语言占比、角色倾向）</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[var(--primary)]">✓</span>
                <span>个人影响力分析（PR合并率、被@次数）</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[var(--primary)]">✓</span>
                <span>代表性贡献作品集</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[var(--primary)]">✓</span>
                <span>可导出开源简历（PDF）</span>
              </div>
            </div>

            <button className="w-full py-3 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white rounded-lg font-semibold transition-all">
              开始分析 →
            </button>
          </div>

          {/* Community Developer Card */}
          <div 
            onClick={() => router.push('/developer/community')}
            className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-8 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-[var(--primary)]/20 hover:border-[var(--primary)]/50 glow-hover group"
          >
            <div className="text-center mb-6">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">👥</div>
              <h3 className="text-2xl font-bold mb-2">社区与生态治理</h3>
              <p className="text-sm text-[var(--muted-foreground)]">
                分析社区和生态系统的整体健康度与治理情况
              </p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[var(--primary)]">✓</span>
                <span>OVA总体概览（观察-价值-行动模型）</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[var(--primary)]">✓</span>
                <span>基础信息统计（仓库数、开发者数等）</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[var(--primary)]">✓</span>
                <span>活跃周期与语言分布</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[var(--primary)]">✓</span>
                <span>系统健康指数分析</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[var(--primary)]">✓</span>
                <span>可导出治理报告（PDF）</span>
              </div>
            </div>

            <button className="w-full py-3 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white rounded-lg font-semibold transition-all">
              开始分析 →
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 max-w-3xl mx-auto">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="text-2xl">ℹ️</span>
              使用说明
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
              选择分析模式后，您需要输入开发者ID或仓库URL，或上传相关的数据包。
              系统将自动进行分析并生成详细的画像报告。分析完成后，您可以查看可视化数据并导出报告。
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

