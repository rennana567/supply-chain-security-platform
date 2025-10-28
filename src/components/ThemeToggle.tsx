'use client';

import { useThemeStore } from '@/stores/themeStore';

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--muted)] transition-all duration-200 glow-hover"
      aria-label={`切换到${theme === 'dark' ? '亮色' : '暗色'}主题`}
    >
      <div className="relative w-6 h-6">
        {/* 太阳图标 (亮色模式) */}
        <svg
          className={`absolute inset-0 transition-all duration-300 ${
            theme === 'dark' ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'
          }`}
          fill="currentColor"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>

        {/* 月亮图标 (暗色模式) */}
        <svg
          className={`absolute inset-0 transition-all duration-300 ${
            theme === 'light' ? 'opacity-0 -rotate-90' : 'opacity-100 rotate-0'
          }`}
          fill="currentColor"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </div>
    </button>
  );
}