'use client';

import { 
    addToast, 
    Button, 
    Card, 
    Chip, 
    cn, 
    Progress 
} from '@heroui/react';
import { 
    File, 
    FileText, 
    UploadCloud,
    X, 
} from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { AttachmentData } from '@/types/regisered-course';
import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useSessionUserData } from '@/contexts/user-data-context';
import { AppType } from '@/app/api/[[...route]]/route';
import { env } from '@/env';
import { hc } from 'hono/client';
import { useCurrentCourseData } from '@/contexts/registered-course-context';
import { getFileType, getFileColor } from '@/utils/related-to-assignment';
import { usePathname } from 'next/navigation';


export function FileUploader({
    onFileUpload,
    onFileRemove,
    id,
    files,
    maxFiles,
    allowedTypes
}: {
    onFileUpload: (file: AttachmentData) => void;
    onFileRemove: (fileId: string) => void;
    id: string;
    files: AttachmentData[];
    maxFiles: number;
    allowedTypes: string[];
}) {
    const client = hc<AppType>(env.NEXT_PUBLIC_APP_URL);
    const [isDragging, setIsDragging] = useState(false);
    const [reading, setReading] = useState<{[key: string]: number}>({});
    const fileInputRef = useRef<HTMLInputElement>(null);
    const email = useSessionUserData().email;
    const userName = useSessionUserData().name;
    const courseName = useCurrentCourseData().course.name;
    const pathName = usePathname();

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleFiles = (fileList: FileList) => {
        if (files.length >= maxFiles) {
            addToast({
                color: 'warning',
                title: 'ファイル数制限',
                description: `アップロードできるのは最大${maxFiles}ファイルまでです。`
            });
        } else {
            Array.from(fileList).slice(0, maxFiles - files.length).forEach(async (file) => {
                const fileId = `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        
                // 選択されたファイルの読み込み準備（進行状況を0%にする）
                setReading(prev => ({ ...prev, [fileId]: 0 }));

                // FileReaderのインスタンスを生成
                const reader = new FileReader();

                // ファイルの読み込み開始
                reader.readAsDataURL(file);
        
                // ファイルの読み込み状況を監視
                reader.onprogress = (progressEvent) => {
                    if (progressEvent.lengthComputable) {
                        setReading(prev => ({
                            ...prev, [fileId]: Math.round((progressEvent.loaded / progressEvent.total) * 100) 
                        }));
                    }
                };
                // ファイルの読み込み完了後の処理
                reader.onload = () => {
                    setTimeout(() => {
                        const fileType = getFileType(file.type);

                        const newFile: AttachmentData = {
                            id: fileId,
                            name: file.name,
                            type: fileType,
                            url: ""
                        };

                        onFileUpload(newFile);

                        // 読み込み中…の状態を削除
                        setReading(prev => {
                            const { [fileId]: _, ...rest } = prev;
                            return rest;
                        });
                    }, 500);
                }
            });
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
        }
    };

    return (
        <div className="flex flex-col space-y-4">
            <Card
                className={cn("border-2 border-dashed p-4 transition-colors",
                    isDragging ? "border-primary bg-primary-50/30" : "border-divider"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="flex flex-col items-center justify-center py-6">
                    <UploadCloud
                        width={40} 
                        className={cn("mb-4", 
                            isDragging ? 'text-primary' : 'text-default-400'
                        )} 
                    />
                    <p className="text-center mb-2">
                        <span className="font-medium">
                            クリックまたはドラッグしてファイルをアップロードしてください。
                        </span>
                    </p>
                    <p className="text-xs text-default-500 text-center mb-4">
                        PDF, DOC, DOCX, JPG, PNG, MP4 (最大 {maxFiles} ファイルまで)
                    </p>
                    <Button 
                        color="primary" 
                        variant="flat" 
                        onPress={() => fileInputRef.current?.click()}
                        isDisabled={files.length >= maxFiles}
                    >
                        ファイルを選択
                    </Button>
                    <input
                        id="file-input"
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileInputChange}
                        className="hidden"
                        multiple
                        accept={allowedTypes.join(',')}
                    />
                </div>
            </Card>

            {/* 読み込み中のファイル */}
            <AnimatePresence>
                {Object.entries(reading).map(([fileId, progress]) => (
                    <m.div
                        key={fileId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-content2 rounded-medium p-3"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <File className="text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                    ファイルを読み込み中...
                                </p>
                            </div>
                            <Chip 
                                size="sm" 
                                variant="flat" 
                                color="primary"
                            >
                                {progress}%
                            </Chip>
                        </div>
                        <Progress 
                            value={progress} 
                            color="primary" 
                            size="sm" 
                            className="max-w-full" 
                            aria-label="Upload progress"
                        />
                    </m.div>
                ))}
            </AnimatePresence>

            {/* アップロードしたファイル */}
            <AnimatePresence>
                {files.map((file) => (
                    <m.div
                        key={file.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-content2 rounded-medium p-3"
                        whileHover={{ cursor: 'pointer', opacity: 0.8 }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-content3 flex items-center justify-center">
                               <FileText className={`text-${getFileColor(file.type)}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm justify-start font-medium truncate">
                                    {file.name}
                                </div>
                                <p className="text-xs text-default-500 capitalize">
                                    {file.type}
                                </p>
                            </div>
                            <Button
                                isIconOnly
                                variant="light"
                                size="sm"
                                onPress={() => onFileRemove(file.id)}
                                aria-label="Remove file"
                            >
                                <X width={16} />
                            </Button>
                        </div>
                    </m.div>
                ))}
            </AnimatePresence>

            {files.length > 0 ? (
                <Button
                    color="primary"
                    onPress={() => {
                        files.forEach(async (file) => {
                            try {
                                if (pathName.endsWith(`/${id}`)) {
                                    const { data } = await supabase
                                        .storage
                                        .from('documents')
                                        .upload(`${courseName}/課題/${email}/${file.name}`, 
                                            file.id, 
                                        {
                                            upsert: true
                                        }
                                    );
                                    if (data) {
                                        await client.api.assignment.$post({
                                            json: {
                                                assignment: {
                                                    assignmentId: id,
                                                    courseName: courseName,
                                                    email: email,
                                                    userName: userName,
                                                    status: '提出済'
                                                },
                                                submission: {
                                                    name: file.name,
                                                    type: file.type,
                                                    url: data.path
                                                }
                                            }
                                        });
                                    }
                                } else {
                                    const { data } = await supabase
                                        .storage
                                        .from('documents')
                                        .upload(`${courseName}/資料/${file.name}`, 
                                            file.id, 
                                        {
                                            upsert: true
                                        }
                                    );
                                    if (data) {
                                        await client.api.material.$post({
                                            json: {
                                                name: file.name,
                                                type: file.type,
                                                url: data.path
                                            }
                                        });
                                    }
                                }
                            } catch (error) {
                                if (error instanceof Error) {
                                    addToast({
                                        title: "ファイルのアップロードに失敗しました。",
                                        description: `お手数ですが再試行してください。詳細: ${error.message}`,
                                        color: "danger"
                                    });
                                }
                            }
                        });
                    }}
                >
                    提出する
                </Button>
            ) : null}
        </div>
    );
}
