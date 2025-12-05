'use client';

import * as m from "motion/react-m"
import { useEffect, useState } from "react";


export function CurrentTimeIndicator() {
    const [currentPosition, setCurrentPosition] = useState<number>(0);

    useEffect(() => {
        const delay = (60 - new Date().getSeconds()) * 1000;

        // 1. 指標の位置を計算
        const calculatePosition = () => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const timeAsDecimal = hours + (minutes / 60);
            const position = timeAsDecimal * 48;
            
            return position;
        };

        // 2. 初期位置を設定
        setCurrentPosition(calculatePosition());

        // 3. 分頭に合わせて表示
        const timeout = setTimeout(() => {
            // ポーリングにより每分位置を更新
            const interval = setInterval(() => {
                setCurrentPosition(calculatePosition());
            }, 60000);

            return () => clearInterval(interval);
        }, delay);

        return () => clearTimeout(timeout);
    }, []);

    // 位置が範囲(24時間 × gridセルの高さ(48px))外なら表示しない
    if (currentPosition < 0 || currentPosition > 24 * 48) {
        return null;
    }
    
    return (
        <m.div 
            className="absolute left-0 right-0 flex items-center z-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, top: `${currentPosition}px` }}
            transition={{ type: "spring", stiffness: 100, damping: 10 }}
        >
            <span className="text-xs font-medium text-warning-500">
                {new Date().toLocaleTimeString("default", { hour: '2-digit', minute: '2-digit' })}
            </span>
            <div className="h-[2px] flex-grow bg-warning-500/30" />
            <div className="h-3 w-3 rounded-full bg-warning-500 animate-pulse" />
        </m.div>
    );
}