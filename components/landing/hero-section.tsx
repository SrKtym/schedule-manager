'use client';

import { Button } from "@heroui/react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";


export function HeroSection() {
    return (
        <section className="relative flex items-center justify-center min-h-screen px-4 py-20 overflow-hidden bg-gradient-to-b from-purple-200 to-gray-200">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="container relative z-10 flex flex-col items-center max-w-6xl gap-8 mx-auto text-center"
            >
                <h1 className="text-4xl tracking-tight sm:text-6xl">
                    大学生のための学習管理アプリ
                </h1>
                <p className="max-w-2xl text-xl text-default-600">
                    このアプリは大学生の学習をサポートすることを目的として開発されました。
                    時間割の作成やスケジュールの管理、課題の管理をこれ一つで実現できます。
                </p>
                <div className="flex items-center justify-center">
                    <Link href="/sign-in">
                        <Button 
                            size="lg" 
                            color="primary"
                            endContent={<ArrowRight />}
                        >
                            はじめる
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </section>
    );
}