// ユーザー登録アクションのバリデーションエラー
export type State = {
    errors?: {
        name?: string[],
        email?: string[],
        password?: string[],
    },
    messages?: {
        success?: string,
        errors?: string, 
    }
};