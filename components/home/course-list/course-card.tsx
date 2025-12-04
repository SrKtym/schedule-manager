'use client';

import { 
    Card, 
    CardBody, 
    CardFooter, 
    Button, 
    Avatar
} from '@heroui/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MoreVertical, Folder } from 'lucide-react';
import { fetchRegisteredCourseData } from '@/utils/getters/main';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export function CourseCard({
    courseData
}: {
    courseData: Awaited<ReturnType<typeof fetchRegisteredCourseData>>[number] & {
        coverImage: string;
    }
}) {
    const { course, coverImage } = courseData;
    const pathName = usePathname();

    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
        >
            <Card 
                isPressable
                className="border border-divider overflow-hidden"
                as={Link}
                href={`${pathName}/${course.name}`}
            >   
                <div className="relative">
                    <Image
                        src={coverImage}
                        alt={course.name}
                        width={600}
                        height={400}
                        priority
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                        <h2 className="text-xl text-white font-medium truncate">
                            {course.name}
                        </h2>
                        <p className="text-sm text-white opacity-90 truncate">
                            教室: {course.classroom}
                        </p>
                    </div>
                </div>
                <CardBody className="p-4">
                    <div className="flex items-center">
                        <Avatar
                            name={course.professor}
                            size="sm"
                            className="mr-3"
                        />
                        <span className="text-sm text-shadow-xl opacity-90 truncate">
                            教授: {course.professor}
                        </span>
                    </div>
                </CardBody>        
                <CardFooter className="justify-end gap-2 p-3 border-t border-divider">
                    <Button 
                        isIconOnly 
                        variant="light" 
                        size="sm"
                        aria-label="Folder"
                    >
                        <Folder width={18} />
                    </Button>
                    <Button 
                        isIconOnly 
                        variant="light" 
                        size="sm"
                        aria-label="More options"
                    >
                        <MoreVertical width={18} />
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
