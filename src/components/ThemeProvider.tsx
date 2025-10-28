'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/stores/themeStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore();

  useEffect(() => {
    // 在组件挂载时应用存储的主题
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return <>{children}</>;
}