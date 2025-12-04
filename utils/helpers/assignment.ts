import { dateOptionforAnnouncement } from "@/constants/definitions";

export const getFileType = (mimeType: string) => {
    switch (mimeType) {
        case 'application/pdf':
            return 'PDFファイル';
        case 'application/msword':
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            return 'Wordファイル';
        case 'application/vnd.ms-excel':
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            return 'Excelファイル';
        default:
            return 'PowerPointファイル';
    }
};

export const getFileColor = (fileType: string) => {
    switch (fileType) {
        case 'PDFファイル':
            return 'danger';
        case 'Wordファイル':
            return 'primary';
        case 'Excelファイル':
            return 'success';
        default:
            return 'warning';
    }
};

export const getAssignmentStatusColor = (status: string) => {
    switch (status) {
        case '評定済':
            return 'success';
        case '提出済':
            return 'primary';
        default:
            return 'default';
    }
};

export const formatDate = (dateString?: string) => {
    if (!dateString) return '期限日なし';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('default', dateOptionforAnnouncement);
};
