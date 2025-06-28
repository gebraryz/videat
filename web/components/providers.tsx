'use client';

import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { AbstractIntlMessages, NextIntlClientProvider } from 'next-intl';
import type { FC, PropsWithChildren } from 'react';

const queryClient = new QueryClient();

export const Providers: FC<
  PropsWithChildren<{ messages: AbstractIntlMessages; locale: string }>
> = ({ locale, messages, children }) => (
  <>
    <NextIntlClientProvider messages={messages} locale={locale}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NuqsAdapter>{children}</NuqsAdapter>
        </ThemeProvider>
      </QueryClientProvider>
    </NextIntlClientProvider>
  </>
);
