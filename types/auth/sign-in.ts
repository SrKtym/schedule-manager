import type { State } from "@/types/auth/sign-up";

// ログインアクションのバリデーションエラー
export type StateOmitName = {
    errors?: Omit<State['errors'], 'name'>,
    messages?: {
        success?: string,
        errors?: string, 
    }
};