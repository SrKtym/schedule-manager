'use client';

import * as m from 'motion/react-m';
import { LazyMotion, domAnimation } from 'motion/react';
import { Card, CardBody } from '@heroui/react';
import { Avatar } from '@heroui/react';
import { Textarea } from '@heroui/react';
import { Button } from '@heroui/react';
import { useState } from 'react';
import { useSessionUserData } from '@/contexts/user-data-context';
import { useCurrentComment } from '@/contexts/comment-context';
import { dateOptionforAnnouncement } from '@/constants/definitions';


export function CommentsOnAssignment({id}: {id: string}) {
    const [comment, setComment] = useState('');
    const userData = useSessionUserData();
    const comments = useCurrentComment();
    const filteredComments = comments.filter(
        (comment) => comment.assignmentId === id
    );

    return (
        <LazyMotion features={domAnimation}>
            <m.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            >
                <Card className="border border-divider">
                    <CardBody className="p-6">
                        <h2 className="text-lg font-google-sans font-medium mb-4">
                            メンバーのコメント
                        </h2>
                        <div className="flex gap-3 mb-6">
                            <Avatar
                                src={userData?.image ?? undefined}
                                name={userData?.name}
                                size="sm"
                            />
                            <div className="flex-1">
                                <Textarea
                                    placeholder="コメントを追加"
                                    value={comment}
                                    onValueChange={setComment}
                                    minRows={1}
                                />
            
                                {comment.trim() && (
                                    <div className="flex justify-end mt-2">
                                        <Button 
                                            size="sm" 
                                            color="primary"
                                            variant="flat"
                                        >
                                            投稿
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
        
                        <div className="space-y-6">
                            {filteredComments.map((comment) => (
                                <div className="flex gap-3">
                                    <Avatar
                                        name={comment.userName}
                                        size="sm"
                                    />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium">
                                                {comment.userName}
                                            </p>
                                            <p className="text-xs text-default-500">
                                                {comment.createdAt.toLocaleString(
                                                    "default", dateOptionforAnnouncement
                                                )}
                                            </p>
                                        </div>
                                        <p className="mt-1">
                                            {comment.content}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>
            </m.div>
        </LazyMotion>
    );
}