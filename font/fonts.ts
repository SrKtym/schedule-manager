import { Noto_Sans_JP, Noto_Serif_JP } from 'next/font/google';

export const notoSansJP = Noto_Sans_JP({subsets: ['latin']});
export const notoSerifJP = Noto_Serif_JP({
    subsets: ['latin'],
    weight: ['400', '700'],
});