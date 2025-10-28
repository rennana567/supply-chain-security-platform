'use client';

interface ScanButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export function ScanButton({ onClick, isLoading }: ScanButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="px-8 py-3 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] font-semibold rounded-lg transition-all duration-300 glow-hover disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          扫描中...
        </span>
      ) : (
        '启动扫描'
      )}
    </button>
  );
}

