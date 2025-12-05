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
import { AttachmentData } from '@/types/main/regisered-course';
import { useState, useRef, useCallback } from 'react';
import { getFileType, getFileColor } from '@/utils/helpers/assignment';
import { client } from '@/lib/hono/client';  
import { useParams } from 'next/navigation';
import { attachmentIsRelatedTo } from '@/constants/definitions';


export function FileUploader({
    files,
    maxFiles,
    allowedTypes,
    relatedTo,
    onFileRemove,
}: {
    files: AttachmentData[];
    maxFiles: number;
    allowedTypes: string[];
    relatedTo: typeof attachmentIsRelatedTo[number];
    onFileRemove: (
        fileId: string,
        relatedTo: typeof attachmentIsRelatedTo[number]
    ) => void;
}) {
    const {course: courseName} = useParams<{course: string}>();
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState<{[key: string]: number}>({});
    const [fileList, setFileList] = useState<AttachmentData[]>(files);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ReadableStreamを使ったチャンクアップロード
    const chunkedUpload = async (file: File) => {
        const totalSize = file.size;
        const fileName = file.name;

        // ファイルのアップロード準備（進行状況を0%にする）
        setUploading(prev => ({ ...prev, [fileName]: 0 }));

        const stream = new ReadableStream({
            start(controller) {
                const reader = file.stream().getReader();
                function push() {
                    reader.read().then(({ done, value }) => {
                        if (done) {
                            controller.close();
                        } else {
                            setUploading(prev => ({ ...prev, [fileName]: Math.round((value.length / totalSize) * 100) }));
                            controller.enqueue(value);
                            push();
                        }
                    });
                }
                push();
            }
        });

        const res = await client.api.upload.multipart.$post({
            header: {
                'content-type': file.type,
                'x-file-name': file.name,
                'x-course-name': courseName,
                'x-related-to': relatedTo
            },
            body: stream,
        });

        const data = await res.text();

        switch (data) {
            case 'failed upload':
                addToast({
                    title: 'アップロード失敗',
                    description: 'ファイルのアップロードに失敗しました。',
                    color: 'danger',
                });
                break;
            default:
                setFileList(prev => [...prev, { 
                    id: data,
                    name: file.name, 
                    relatedTo,
                    type: getFileType(file.type), 
                }]);
                break;
        }
    }

    // ドラッグオーバー時の処理
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    // ドラッグアウト時の処理
    const handleDragLeave = () => {
        setIsDragging(false);
    };

    // ファイル選択時の処理
    const handleFileUpload = async (fileList: FileList) => {
        if (fileList.length >= maxFiles) {
            addToast({
                color: 'warning',
                title: 'ファイル数制限',
                description: `アップロードできるのは最大${maxFiles}ファイルまでです。`
            });
        } else if (fileList.length === 1) {

        } else {
            const promise = [...fileList].map(file => chunkedUpload(file));
            // ファイルのアップロードを並列で実行
            await Promise.all(promise);
        }
    }

    // ドロップ時の処理(キャッシュ化)
    const handleDrop = useCallback(
        async (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
    
            if (e.dataTransfer.files) await handleFileUpload(e.dataTransfer.files);
        },[]
    );

    // ファイル選択時にアップロード処理をトリガー
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) handleFileUpload(e.target.files);
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
                        className={cn("mb-4", isDragging ? 'text-primary' : 'text-default-400')} 
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

            <AnimatePresence>
                {/* アップロード中のファイル */}
                {Object.entries(uploading).map(([fileId, progress]) => (
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
                                    ファイルをアップロード中...
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

                {/* アップロードしたファイル */}
                {fileList.map((file) => (
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
                                onPress={() => onFileRemove(file.id, file.relatedTo)}
                                aria-label="Remove file"
                            >
                                <X width={16} />
                            </Button>
                        </div>
                    </m.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
