'use client';

import { 
    Card, 
    CardBody, 
    Chip, 
} from '@heroui/react';
import { FileText } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getFileColor } from '@/utils/related-to-assignment';
import { dateOptionforAnnouncement } from '@/constants/definitions';
import { assignmentData } from '@/lib/drizzle/schema/public';


export function AssignmentCard({
    assignment
}: {
    assignment: typeof assignmentData.$inferSelect;
}) {
    const pathName = usePathname();
    
    const { 
        name, 
        description, 
        dueDate, 
        points, 
        type 
    } = assignment;

    return (
        <Card 
            key={assignment.id}
            as={Link}
            href={`${pathName}/${assignment.id}`}
            isPressable
            className="border border-divider"
        >
            <CardBody className="p-4">
                <div className="flex gap-3">
                    <div className="mt-1">
                        <div className="w-10 h-10 rounded-full bg-content2 flex items-center justify-center">
                            {type && <FileText className={`text-${getFileColor(type)}`}/>}
                        </div>
                    </div>
          
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-medium">
                                    {name}
                                </h3>
                                <div className="flex items-center gap-2 text-tiny text-default-500 mt-1">
                                    <span>
                                        {dueDate.toLocaleDateString("default", dateOptionforAnnouncement)}
                                    </span>
                                    {points && (
                                        <>
                                            <span>•</span>
                                            <span>{points} 点</span>
                                        </>
                                    )}
                                </div>
                            </div>
              
                            {type &&
                                <Chip 
                                    size="sm" 
                                    variant="flat" 
                                    color={getFileColor(type)}
                                >
                                    課題
                                </Chip>
                            }
                        </div>
            
                        {description && (
                            <div className="mt-3">
                                <p className="text-sm text-default-600">
                                    {description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </CardBody>
    </Card>
  );
};
