import type { State } from "@/types/sign-up";

// ログインアクションのバリデーションエラー
export type StateOmitName = {
    errors?: Omit<State['errors'], 'name'>,
    messages?: {
        success?: string,
        errors?: string, 
    }
};