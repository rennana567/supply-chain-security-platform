'use client';

interface RepoInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function RepoInput({ value, onChange }: RepoInputProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="输入 GitHub / Gitee 仓库 URL"
          className="w-full px-6 py-4 bg-[var(--input)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-300 glow-hover"
        />
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <button
            type="button"
            className="px-4 py-2 text-sm text-[var(--primary)] hover:text-[var(--primary)]/80 transition-colors"
          >
            或上传压缩包
          </button>
        </div>
      </div>
    </div>
  );
}

