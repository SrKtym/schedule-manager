import { 
    Card, 
    CardBody, 
    Chip, 
} from '@heroui/react';
import { dateOptionforAnnouncement } from '@/constants/definitions';
import { announcement } from '@/lib/drizzle/schema/public';
import { File, FileQuestion, Info } from 'lucide-react';
import { getAnnouncementTypeColor } from '@/utils/related-to-announcement';


export function AnnouncementCard({ data }: { data: typeof announcement.$inferSelect}) {
    function getFileIcon(type: string) {
        switch (type) {
            case '資料':
                return <File />;
            case 'アンケート':
                return <FileQuestion />;
            default:
                return <Info />;
        }
    }
    
    return (
        <Card 
            key={data.id}
            className="border border-divider"
        >
            <CardBody className="p-4">
                <div className="flex gap-3">
                    <div className="mt-1">
                        <div className="w-10 h-10 rounded-full bg-content2 flex items-center justify-center">
                            {data.type && getFileIcon(data.type)}
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-medium">
                                    {data.title}
                                </h3>
                                <p className="text-tiny text-default-500">
                                    {data.createdAt.toLocaleDateString("default", dateOptionforAnnouncement)}
                                </p>
                            </div>
                            <Chip
                                size="sm"
                                variant="flat"
                                color={getAnnouncementTypeColor(data.type)}
                            >
                                {data.type}
                            </Chip>
                        </div>
            
                        <div className="mt-3">
                            <p className="whitespace-pre-line">
                                {data.content}
                            </p>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};
