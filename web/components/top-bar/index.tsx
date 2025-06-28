import { useTranslations } from 'next-intl';
import Link from 'next/link';
import type { FC } from 'react';
import { TopBarLanguageSwitcher } from './language-switcher';
import { TopBarSearch } from './search';
import { TopBarThemeSwitcher } from './theme-switcher';

export const TopBar: FC = () => {
  const t = useTranslations();

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex items-center justify-between px-4 py-4 md:px-0 md:py-2">
        <div className="flex gap-x-6">
          <Link
            href="/"
            className="text-primary flex items-center gap-2 text-2xl font-bold"
            title={t('components.top-bar.homepage')}
          >
            Videat
          </Link>
        </div>
        <div className="flex items-center gap-x-2">
          <TopBarSearch />
          <TopBarLanguageSwitcher />
          <TopBarThemeSwitcher />
        </div>
      </div>
    </header>
  );
};
