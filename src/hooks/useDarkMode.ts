import type { ColorScheme } from '@mantine/core';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';

export const useDarkMode = () => {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) => {
    const newColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(newColorScheme);
  };

  useHotkeys([['mod+J', () => toggleColorScheme()]]);

  return { colorScheme, toggleColorScheme };
};
