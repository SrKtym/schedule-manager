'use client';

import * as m from 'motion/react-m';
import { 
    AnimatePresence, 
    LayoutGroup, 
    LazyMotion, 
    domAnimation, 
    useAnimate 
} from "motion/react";
import { useEffect, useState } from "react";
import { Button } from '@heroui/react';
import { Bell, Settings, X } from 'lucide-react';
import dynamic from 'next/dynamic';

const SingleItemModal = dynamic(() => import('@/components/home/shared-layout-modal'), { ssr: false });

export function NotificationsList() {
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'マクロ経済学に新しい課題が追加されました', message: 'これはテスト通知です。通知を消すには右上のXを押してください。この通知リストには、framer-motionを使用してアニメーションを適用しています。', read: false },
        { id: 2, title: 'ミクロ経済学に新しい課題が追加されました', message: 'njkbjhbjhbjkbjkbvjhvkucgcgjugcgcmjcgfhchfchcgfcugjvcgckghchgckhcghcckhchch.', read: false },
        { id: 3, title: 'タイトル3', message: 'これはテスト通知です。', read: false }
    ]);

    const [index, setIndex] = useState<number | false>(false);
    const [scope, animate] = useAnimate();

    useEffect(() => {
        // 未読の通知がある場合、ベルを振る
        if (notifications.some(n => !n.read)) {
            animate(scope.current, { 
                rotate: [0, -15, 15, -10, 10, -5, 5, 0]
            }, {
                duration: 0.8,
                repeat: Infinity,
                repeatType: 'reverse'
            });
        } else {
            animate(scope.current, { 
                rotate: 0
            }, {
                duration: 0.8
            });
        }
    }, [notifications]);

    useEffect(() => {
        const connect = () => {
            const eventSource = new EventSource('/api/sse');

            eventSource.onmessage = (e) => {
                const data = JSON.parse(e.data);
                setNotifications(prev => [...prev, data]);
            };

            eventSource.onerror = () => {
                eventSource.close();
                setTimeout(connect, 1000);
            }
        }

        connect();
    }, []);

    return (
        <div className="h-[400px] overflow-y-auto scrollbar-hidden bg-gradient-to-b from-success-50 to-success-100 shadow-small rounded-large p-2">
            <div className="flex items-center gap-2">
                <Bell 
                    width={24} 
                    height={24}
                    ref={scope}
                />
                <h1 className="sticky top-0 text-xl font-medium m-2">
                    通知
                </h1>
                <p>
                    未読: {notifications.filter(n => !n.read).length}
                </p>
            </div>
            <LazyMotion features={domAnimation}>
                {notifications.length === 0 && (
                    <m.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="text-center p-5"
                    >
                        通知はありません
                    </m.p>
                )}
                <LayoutGroup>
                    <m.ul 
                        className="max-w-[400px] space-y-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <AnimatePresence 
                            initial={false}
                            mode="popLayout"
                        >
                            {notifications.map((notification) => (
                                <m.li
                                    key={notification.id}
                                    layoutId={notification.id.toString()}
                                    layout
                                    initial={{ opacity: 0, y: 50, scale: 0.3 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                                    whileHover={{ scale: 1.05 }}
                                    className="relative flex items-center gap-2 bg-background p-6 m-5 rounded-3xl corsor-pointer"
                                    onClick={() => setIndex(notification.id)}
                                >
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex items-center gap-1">
                                            <h2 className="text-lg font-medium truncate">
                                                {notification.title}
                                            </h2>
                                            <span>・</span>
                                            <p className="text-tiny">
                                                {new Date().toLocaleDateString()}
                                            </p>
                                        </div>
                                        <p className="text-sm line-clamp-2">
                                            {notification.message}
                                        </p>
                                    </div>
                                    <Button 
                                        aria-label="delete notification"
                                        className="absolute top-1 right-1 rounded-full"
                                        size="sm"
                                        isIconOnly
                                        variant="light"
                                        onPress={() => setNotifications(notifications.filter(n => n.id !== notification.id))}
                                    >
                                        <X 
                                            width={18} 
                                            height={18} 
                                        />
                                    </Button>
                                </m.li>
                            ))}
                            {index && (
                                <SingleItemModal 
                                    key="modal"
                                    notification={notifications.find(n => n.id === index)}
                                    onClose={() => setIndex(false)}
                                />
                            )}
                        </AnimatePresence>
                    </m.ul>
                </LayoutGroup>
            </LazyMotion>
            <Button
                aria-label="settings"
                isIconOnly
                variant="light"
                className="absolute right-2 top-2"
            >
                <Settings 
                    width={24} 
                    height={24} 
                />
            </Button>
            {/* <Button
                aria-label="add notification"
                isIconOnly
                size="lg"
                color="primary"
                onPress={() => setNotifications(
                    [{ 
                        id: new Date().getTime(), 
                        title: '新しい通知', 
                        message: '新しい通知を追加しました', 
                        read: false
                    }, ...notifications]
                )}
                className="absolute right-2 bottom-2 rounded-full"
            >
                <Plus 
                    width={18} 
                    height={18} 
                />
            </Button> */}
        </div>
    );
}
