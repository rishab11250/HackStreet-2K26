import { useEffect } from 'react';
import useStore from '../store/useStore';

export function applyTheme(mode) {
  const dark =
    mode === 'dark'
      ? true
      : mode === 'light'
        ? false
        : window.matchMedia('(prefers-color-scheme: dark)').matches;

  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
}

/**
 * Syncs Zustand themeMode with <html data-theme> and system preference when mode is "system".
 */
export function useTheme() {
  const themeMode = useStore((s) => s.themeMode);

  useEffect(() => {
    applyTheme(themeMode);
    if (themeMode !== 'system') return undefined;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyTheme('system');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [themeMode]);
}
