export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--background)]">
      {/* 主加载动画 */}
      <div className="relative">
        {/* 外圈旋转 */}
        <div className="w-16 h-16 border-4 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin"></div>

        {/* 中心点 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[var(--primary)] rounded-full"></div>
      </div>

      {/* 加载文本 */}
      <div className="mt-6 text-center">
        <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">供应链安全平台</h2>
        <p className="text-sm text-[var(--muted-foreground)] animate-pulse">正在加载中...</p>
      </div>

      {/* 加载提示 */}
      <div className="mt-4 text-xs text-[var(--muted-foreground)] text-center max-w-xs">
        <p>为您准备最佳的安全分析体验</p>
      </div>
    </div>
  );
}