import "./globals.css";
import { notoSansJP } from '@/public/fonts/fonts';
import React from "react";
import { Providers } from "./providers";
import type { Metadata } from "next";
import { fetchThemeCookie } from "@/utils/getters/main";
import NextjsTopLoader from "nextjs-toploader";
import { BackToTopButton } from "@/components/home/back-to-top-button";

export const metadata: Metadata = {
  title: {
    template: '%s | スケジュールマネージャーアプリ',
    default: 'スケジュールマネージャーアプリ'
  },
  description: '講義の履修登録、時間割の作成、課題の作成・提出ができます。'
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = await fetchThemeCookie();

  return (
    <html lang="ja" className={`${theme}`}>
      <body className={`${notoSansJP.className} antialiased`}>
        <NextjsTopLoader showSpinner={false} />
        <Providers>
          {children}
        </Providers>
        <footer className="flex flex-col items-center justify-center">
          <BackToTopButton />
          <p className="w-full text-center text-tiny text-white bg-gray-700 px-3 py-5">
              Copyright &copy; 2025 Schedule Manager All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}
