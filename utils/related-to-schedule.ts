// 日時文字列から日時オブジェクトを生成
export const getDateFromTimeString = (timeStr: string) => {
    const [hours, minutes] =  timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date
}

// 週の開始日を取得
export const startDateOfWeek = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    return startOfWeek;
}

// 週の日付を取得
export const getWeekDates = (date: Date) => {
    const week = [];
    const startOfWeek = startDateOfWeek(date);

    for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        week.push(day);
    }
    return week;
};

// 時間スロットを取得
export const timeSlots = (h: number) => {
    const slot: string[] = [];
    const date = new Date();
    date.setSeconds(0);
    date.setMilliseconds(0);
    
    for (let m = 0; m < 60; m += 60) {
        const time = new Date(date);
            time.setHours(h, m) ;
            slot.push(time.toLocaleTimeString('default', {
                hour: '2-digit',
                minute: '2-digit'
            }));
        }
    
    return slot;
};

// 小数時間
export const decimalHours = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return hours + minutes / 60;
}

// 開始日と終了日が異なるかどうかを判定
export const isSpanningDays = (start: Date, end: Date) => {
    const startDateString = start.toLocaleDateString('default');
    const endDateString = end.toLocaleDateString('default');
    const isSpanningDays = startDateString !== endDateString;
    return isSpanningDays;
}
// 開始時間と終了時間の間隔（カレンダー上での高さ）をパーセントで計算
export const calculateHeightAsPercentage = (start: Date, end: Date) => {
    const diffMs = end.getTime() - start.getTime();
    const diffMin = diffMs / (1000 * 60);
    const percentage = `${diffMin / 60 * 100}%`;

    // 終日でない場合
    if (isSpanningDays(start, end)) {
        return "100%";
    } else {
        return percentage;
    }
}

// 開始日と終了日の間隔（カレンダー上での幅）をパーセントで計算
export const calculateWidthAsPercentage = (start: Date, end: Date, startOfWeek: Date) => {
    // 終日の場合（100%）
    if (!isSpanningDays(start, end)) return "auto";

    // 1週間以内の予定の場合（100% - 700%）
    if (startOfWeek <= start && end.getTime() - start.getTime() < 7 * 24 * 60 * 60 * 1000) {
        return `${(end.getDay() - start.getDay() + 1) * 100}%`;
    } 
    // 1週間を超える予定の場合（100% - 700%）
    else if (startOfWeek <= start) {
        return `${(6 - start.getDay() + 1) * 100}%`;
    } 
    // 1週間以内の予定の場合（100% - 700%）
    else if (startOfWeek <= end && end.getTime() - startOfWeek.getTime() < 7 * 24 * 60 * 60 * 1000) {
        return `${(end.getDay() - startOfWeek.getDay() + 1) * 100}%`;
    } else {
        return "700%";
    }
}

// 背景色の透過度を計算
export const hexWithAlpha = (hex: string, alpha: number) => {
    const alphaHex = Math.round(alpha * 255).toString(16).padStart(2, '0');
    return hex + alphaHex;
}

// 現在進行中であるかどうかを判定
export const isProgressingOrUpcoming = (start: Date, end: Date) => {
    const now = new Date().getTime();
    const isProgressing = start.getTime() < now && end.getTime() > now;
    const upcoming = now < start.getTime();
    
    if (isProgressing) {
        return "progressing";
    } else if (upcoming) {
        return "upcoming";
    } else {
        return "past"
    };
}