export const getAnnouncementTypeColor = (type: string) => {
    switch (type) {
        case '資料':
            return 'primary';
        case 'アンケート':
            return 'secondary';
        default:
            return 'default';
    }
};
    