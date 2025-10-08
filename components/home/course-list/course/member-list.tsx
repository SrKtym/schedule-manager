'use client';

import { Avatar, Button, Card, CardBody } from '@heroui/react';
import { Plus, MoreVertical } from 'lucide-react';
import { useCurrentMemberList } from '@/contexts/member-context';
import { fetchMemberList } from '@/utils/getter';


export function MemberList() {
    const memberList = useCurrentMemberList();

    return (
        <div className="space-y-6">
            <Card className="border border-divider">
                <CardBody className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">
                            教授
                        </h3>
                        <Button 
                            variant="light" 
                            size="sm"
                            startContent={<Plus width={16} />}
                        >
                            招待
                        </Button>
                    </div>
          
                    <div className="space-y-4">
                        {memberList.map((member) => (
                            <MemberListItem 
                                key={member.users.id} 
                                member={member} 
                            />
                        ))}
                    </div>
                </CardBody>
            </Card>
      
            <Card className="border border-divider">
                <CardBody className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="text-lg font-medium">
                                学生
                            </h3>
                            <p className="text-sm text-default-500">
                                {memberList.length} 学生
                            </p>
                        </div>
                        <Button 
                            variant="light" 
                            size="sm"
                            startContent={<Plus width={16} />}
                        >
                            招待
                        </Button>
                    </div>
          
                    <div className="space-y-4">
                        {memberList.map((member) => (
                            <MemberListItem 
                                key={member.users.id} 
                                member={member} 
                            />
                        ))}
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}

export function MemberListItem({ 
    member 
}: { 
    member: Awaited<ReturnType<typeof fetchMemberList>>[number] 
}) {
    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
                <Avatar
                    src={member.users.image ?? undefined}
                    name={member.users.name ?? undefined}
                    size="sm"
                />
                <div>
                    <p className="font-medium">
                        {member.users.name}
                    </p>
                    <p className="text-tiny text-default-500">
                        {member.users.email}
                    </p>
                </div>
            </div>
            <Button 
                isIconOnly 
                variant="light" 
                size="sm"
            >
                <MoreVertical width={16} />
            </Button>
        </div>
    );
}
