'use client';

import { Button } from '@heroui/react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useCurrentAssignmentData } from '@/contexts/assignment-data-context';

export function AssignmentHeader({id}: {id: string}) {
    const {currentAssignment} = useCurrentAssignmentData(id);

    return (
        <div 
            className="h-24 relative flex items-end"
            style={{ 
                backgroundColor: 'bg-primary',
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <div className="relative z-10 container mx-auto px-4 py-4 max-w-screen-xl">
                <div className="flex items-center text-white">
                    <Button
                        as={Link}
                        href={`/home/course-list`}
                        variant="light"
                        className="text-white bg-white/10 mr-2"
                        startContent={<ArrowLeft width={16} />}
                        size="sm"
                    >
                        戻る
                    </Button>
                    <div className="text-sm opacity-80">
                        {currentAssignment?.courseName} / 課題の詳細
                    </div>
                </div>
            </div>
        </div>
    );
}