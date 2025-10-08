'use client';

import { Tabs, Tab, Button } from '@heroui/react';
import { Settings } from 'lucide-react';
import * as m from 'motion/react-m';
import { LazyMotion, domAnimation } from 'motion/react';
import { Plus } from 'lucide-react';
import { HeaderTabKey } from '@/types/regisered-course';
import { useState } from 'react';
import { AssignmentCard } from './assignment-card';
import { AnnouncementCard } from './announcement-card';
import { MemberList } from './member-list';
import { useCurrentCourseData } from '@/contexts/registered-course-context';
import { CreateAssignmentForm } from './create-assignment-form';
import { CreateAnnouncementForm } from './create-announcement-form';
import Image from 'next/image';
import { useCurrentAssignmentData } from '@/contexts/assignment-data-context';
import { useCurrentAnnouncement } from '@/contexts/announcement-context';

export function Overall({ courseName }: { courseName: string }) {
    const { course, coverImage } = useCurrentCourseData(courseName);
    const assignmentData = useCurrentAssignmentData()?.assignmentData;
    const announcements = useCurrentAnnouncement();
    const [selectedTab, setSelectedTab] = useState<HeaderTabKey>('announcement');
    const [isCreateAssignmentOpen, setIsCreateAssignmentOpen] = useState(false);
    const isTeacher = true;
  
    return (
        <div>
            
            {/* 講義のヘッダー */}
            <div className="h-48 md:h-64 relative flex items-end">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent">
                    <Image
                        src={coverImage}
                        alt="背景画像"
                        fill={true}
                        priority
                    />
                </div>
                <div className="relative z-10 container mx-auto p-6 max-w-screen-xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
                        <div className="text-white">
                            <h1 className="text-2xl md:text-3xl font-google-sans font-medium">
                                {course.name}
                            </h1>
                            <p className="text-white/80">
                                {course.classroom}
                            </p>
                            <p className="text-white/80">
                                {course.professor}
                            </p>
                        </div>
            
                        <div className="mt-4 md:mt-0">
                            <Button 
                                color="default" 
                                variant="flat"
                                className="bg-white/10 backdrop-blur-sm text-white border-white/20"
                                startContent={<Settings width={18} />}
                            >
                                設定
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
      
            {/* タブナビゲーション */}
            <div className="bg-content1 border-b border-divider px-4 py-3">
                <div className="container mx-auto max-w-screen-xl">
                    <Tabs 
                        aria-label="Class tabs" 
                        selectedKey={selectedTab} 
                        onSelectionChange={key => setSelectedTab(key as HeaderTabKey)}
                        variant="underlined"
                        color="primary"
                        classNames={{
                            base: "overflow-x-auto",
                            tabList: "w-full"
                        }}
                    >
                        <Tab 
                            key="announcement" 
                            title="アナウンスメント" 
                        />
                        <Tab 
                            key="assignment" 
                            title="課題" 
                        />
                        <Tab 
                            key="people" 
                            title="メンバー" 
                        />
                    </Tabs>
                </div>
            </div>
      
            {/* タブコンテンツ */}
            {assignmentData && (
            <div className="container mx-auto p-6 max-w-screen-xl">
                <LazyMotion features={domAnimation}>

                    {/* アナウンスメント */}
                    {selectedTab === 'announcement' && (
                        <m.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-google-sans font-medium">
                                    アナウンスメント
                                </h2>
                                {/* アナウンスメントの投稿（教員用） */}
                                {isTeacher && <CreateAnnouncementForm courseName={course.name} />}
                            </div>
                
                            {announcements.length > 0 ? (
                                <div className="space-y-4">
                                    {announcements.map(announcement => (
                                        <AnnouncementCard 
                                            key={announcement.id} 
                                            data={announcement} 
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-default-500">
                                        まだアナウンスメントはありません
                                    </p>
                                </div>
                            )}
                        </m.div>
                    )}

                    {/* 課題 */}
                    {selectedTab === 'assignment' && (
                        <m.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-google-sans font-medium">
                                    課題
                                </h2>
                                {/* 課題の投稿（教員用） */}
                                {isTeacher && (
                                    <Button 
                                        color="primary"
                                        startContent={<Plus width={18} />}
                                        onPress={() => setIsCreateAssignmentOpen(true)}
                                    >
                                        課題作成
                                    </Button>
                                )}
                            </div>
                
                            {assignmentData.length > 0 ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {assignmentData.map(assignment => (
                                        <AssignmentCard 
                                            key={assignment.id} 
                                            assignment={assignment} 
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-default-500">
                                        課題はありません
                                    </p>
                                </div>
                            )}

                            {/* 課題の投稿（教員用） */}
                            {isTeacher && (
                                <CreateAssignmentForm 
                                    isOpen={isCreateAssignmentOpen} 
                                    onClose={() => setIsCreateAssignmentOpen(false)} 
                                />
                            )}
                        </m.div>
                    )}
            
                    {/* メンバー */}
                    {selectedTab === 'member' && (
                        <m.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <MemberList />
                        </m.div>
                    )}
                </LazyMotion>
            </div>
            )}
        </div>
    );
};

