'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Moon, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

export const TopBarThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const t = useTranslations();

  const themes = {
    light: {
      name: t('components.top-bar.theme-switcher.light'),
      value: 'light',
      icon: Sun,
    },
    dark: {
      name: t('components.top-bar.theme-switcher.dark'),
      value: 'dark',
      icon: Moon,
    },
    system: {
      name: t('components.top-bar.theme-switcher.system'),
      value: 'system',
      icon: Moon,
    },
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label={t('components.top-bar.theme-switcher.toggle')}
        >
          <themes.light.icon className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <themes.dark.icon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">{themes.system.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(themes).map(([key, { name, value }]) => (
          <DropdownMenuItem
            key={key}
            disabled={value === theme}
            onClick={() => {
              setTheme(value);
            }}
          >
            {name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
