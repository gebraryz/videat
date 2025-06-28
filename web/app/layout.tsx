import { Providers } from '@/components/providers';
import { cn } from '@/utils/cn';
import type { Metadata } from 'next';
import { getLocale, getMessages } from 'next-intl/server';
import { Inter } from 'next/font/google';
import { FC, PropsWithChildren } from 'react';
import './globals.css';
import { TopBar } from '@/components/top-bar';

const font = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Videat',
};

const Layout: FC<PropsWithChildren> = async ({ children }) => {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={cn(`${font.className} antialiased`)}>
        <Providers messages={messages} locale={locale}>
          <TopBar />
          <main className="mx-auto my-12 max-w-6xl">{children}</main>
        </Providers>
      </body>
    </html>
  );
};

export default Layout;
