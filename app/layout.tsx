import "./globals.css";
import { notoSansJP } from '@/font/fonts';
import React from "react";
import { Providers } from "./providers";
import { Metadata } from "next";
import { getThemeCookie } from "@/lib/fetch";

export const experimental_ppr = true;

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
  const theme = await getThemeCookie();

  return (
    <html lang="ja" className={`${theme}`}>
      <body className={`${notoSansJP.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
