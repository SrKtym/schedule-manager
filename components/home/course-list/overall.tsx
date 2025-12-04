'use client';

import { Button, Input } from "@heroui/react";
import { 
    ArrowRight, 
    BookOpen, 
    Filter, 
    Search,
} from 'lucide-react';
import * as m from 'motion/react-m';
import { LazyMotion, domAnimation } from 'motion/react';
import { CourseCard } from "@/components/home/course-list/course-card";
import Link from "next/link";
import { useRegisteredCourseDataList } from "@/contexts/registered-course-context";
import { CreateCourse } from "./create-course";

export function Overall() {
    const isTeacher = false;
    const { courseDataList } = useRegisteredCourseDataList();

    return (
        <div className="container mx-auto px-4 py-6 max-w-screen-xl">
            <div className="space-y-3 sm:flex justify-between items-center mb-6">
                <h1 className="text-2xl font-google-sans font-medium">
                    登録済みの講義
                </h1>
                <div className="flex items-center gap-4">
                    <Input
                        type="text"
                        placeholder="講義名を入力してください。"
                        variant="bordered"
                        className="flex-1 max-w-xl sm:ml-4"
                        startContent={
                            <Search 
                                width={18}
                                height={18}
                                color="gray"    
                            />
                        }
                    />
                    <Button
                        color="primary"
                        startContent={<Filter width={18} />}
                    >
                        フィルター
                    </Button>
                    {isTeacher && <CreateCourse />}
                </div>
            </div>
            {courseDataList.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-lg font-google-sans font-medium mb-4">
                        すべて
                    </h2>
                    <LazyMotion features={domAnimation}>
                        <m.div 
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: {
                                        staggerChildren: 0.1
                                    }
                                }
                            }}
                            initial="hidden"
                            animate="visible"
                        >
                            {courseDataList.map((currentCourseData) => (
                                <m.div
                                    key={currentCourseData.course.name}
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: {
                                            opacity: 1,
                                            y: 0,
                                            transition: { duration: 0.3 }
                                        }
                                    }}
                                >
                                    <CourseCard courseData={currentCourseData} />
                                </m.div>
                            ))}
                        </m.div>
                    </LazyMotion>
                </div>
            )}
            
            {courseDataList.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-32 h-32 mb-6 flex items-center justify-center rounded-full bg-content2">
                        <BookOpen
                            width={48} 
                            className="text-default-400" 
                        />
                    </div>
                    <h2 className="text-xl font-medium mb-2">
                        履修する講義がありません
                    </h2>
                    <p className="text-default-500 mb-6 text-center max-w-md">
                        まずは履修する講義を登録してください
                    </p>
                    <Button 
                        as={Link}
                        href="/home/register"
                        color="primary"
                        startContent={<ArrowRight width={18} />}
                    >
                        履修登録のページへ
                    </Button>
                </div>
            )}
        </div>
    );
}