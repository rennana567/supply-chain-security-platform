import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'dark' | 'light';

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      setTheme: (theme: Theme) => {
        set({ theme });
        // 更新 HTML 的 data-theme 属性
        document.documentElement.setAttribute('data-theme', theme);
      },
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        set({ theme: newTheme });
        document.documentElement.setAttribute('data-theme', newTheme);
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);