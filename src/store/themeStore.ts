import { create } from 'zustand';
import { LS } from '../data/defaults';

type Theme = 'dark' | 'light';

interface ThemeStore {
  theme: Theme;
  toggle: () => void;
}

const saved = (localStorage.getItem(LS.theme) as Theme) || 'dark';

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: saved,
  toggle: () =>
    set((s) => {
      const next: Theme = s.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem(LS.theme, next);
      document.documentElement.setAttribute('data-theme', next);
      return { theme: next };
    }),
}));
