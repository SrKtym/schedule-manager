import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'ホーム'
}

export default async function HomePage() {
    return <p>メインコンテンツ</p>;
}