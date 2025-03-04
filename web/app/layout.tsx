import { cn } from "@/utils/cn";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Inter } from "next/font/google";
import { FC, PropsWithChildren } from "react";
import "./globals.css";

const interFont = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Videat",
};

const Layout: FC<PropsWithChildren> = async ({ children }) => {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={cn(`${interFont.className} antialiased`)}>
        <NextThemesProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </NextThemesProvider>
      </body>
    </html>
  );
};

export default Layout;
