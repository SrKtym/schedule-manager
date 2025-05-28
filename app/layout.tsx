import "./globals.css";
import { notoSansJP } from '@/font/fonts';
import React from "react";
import { Providers } from "./providers";
import { getTheme } from "@/lib/fetch";

export const experimental_ppr = true;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = await getTheme();

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
