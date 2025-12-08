// データ更新系(POST method only)
'use server';

import { logInSchema } from '@/schemas/form-schema';
import { db } from '../../lib/drizzle';
import { auth } from '@/lib/better-auth/auth';
import { APIError } from 'better-auth/api';
import { headers } from 'next/headers';
import z from 'zod/v4';
import { redirect } from 'next/navigation';
import { State } from '@/types/auth/sign-up';
import { StateOmitName } from '@/types/auth/sign-in';
import { setThemeCookie } from './main';
import { StatePickEmail } from '@/types/auth/request-reset-password';


// ユーザー登録
export async function signUp(prevState: State | undefined, formData: FormData) {
    const validatedFields = logInSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (validatedFields.error) {
        const flattened = z.flattenError(validatedFields.error);
        return {
            errors: flattened.fieldErrors
        }
    } 
    try {
        const existingUser = await db.query.users.findFirst({
            where: (users, {eq}) => (eq(users.email, validatedFields.data.email))
        });

        // 既存のユーザーが存在する場合
        if (existingUser) {
            return {
                messages: {
                    errors: "入力された認証情報はすでに使用されています。"
                }
            }
        }
        // 新規ユーザー登録
        const data = await auth.api.signUpEmail({
            body: {
                name: validatedFields.data.name,
                email: validatedFields.data.email,
                password: validatedFields.data.password  //scryptによるハッシュ化
            }
        });

        // ユーザーが教員の場合
        if (data && validatedFields.data.email.startsWith('prof.')) {
            await auth.api.setRole({
                body: {
                    userId: data.user.id,
                    role: 'professor'
                },
                headers: await headers()
            });
        }

        return {
            messages: {
                success: "サインアップに成功しました。入力されたメールアドレスに届いたメールを確認してください。"
            }
        }
    } catch (error) {
        if (error instanceof APIError) {
            return {
                messages: {
                    errors: `サインアップに失敗しました。詳細: ${error.body?.message}`
                }
            }
        }
    }
}

// ユーザー認証
export async function signIn(prevState: StateOmitName | undefined, formData: FormData) {
    const validatedFields = logInSchema.omit({name: true}).safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (validatedFields.error) {
        const flattened = z.flattenError(validatedFields.error);
        return {
            errors: flattened.fieldErrors
        }
    } 

    let redirectUrl: string | undefined;

    try {
        // 1人のユーザーにつき1つのアカウントとする
        const user = await db.query.users.findFirst({
            with: {
                accounts: {
                    orderBy: (accounts, {desc}) => [desc(accounts.updatedAt)]
                }
                // accounts: true
            },
            where: (users, {eq}) => (eq(users.email, validatedFields.data.email))
        });

        switch (user?.accounts[0].providerId) {
            // SNS認証でサインアップ済み（アカウントの重複がある）場合
            case 'github':
            case 'google':
            case 'twitter':
                return {
                    messages: {
                        errors: `入力されたメールアドレスはすでに登録されています。
                                前回のログイン: ${user?.accounts[0].providerId}`
                    }
                }
            // email and password認証
            default:
                await auth.api.signInEmail({
                    body: {
                        email: validatedFields.data.email,
                        password: validatedFields.data.password,
                        rememberMe: true,
                    }
                });
                switch (user?.twoFactorEnabled) {
                    // 2要素認証無効
                    case false:
                        redirectUrl = '/home';
                        break;
                    // 初回ログインまたは2要素認証有効
                    default:
                        redirectUrl = '/two-factor';
                        break;
                }
        } 
    } catch (error) {
        if (error instanceof APIError) {
            return {
                messages: {
                    errors: `サインインに失敗しました。
                            詳細: ${error.body?.message}`
                }
            }
        }
    }

    if (redirectUrl) redirect(redirectUrl);
} 

// 2要素認証有効化
export async function setTwoFactor(
    prevState: {
        errors?: string[],
        message?: {
            error?: string
        }
    } | undefined, 
    formData: FormData
) {
    const validatedField = logInSchema
        .omit({name: true, email: true})
        .extend({
            selected: z.enum(['valid', 'invalid']),
        })
        .safeParse({
            password: formData.get('password'),
            selected: formData.get('selected'),
        });

    if (validatedField.error) {
        const flattened = z.flattenError(validatedField.error);
        return {
            errors: flattened.fieldErrors.password
        };
    }

    try {
        switch (validatedField.data.selected) {
            case 'valid': 
                // 2要素認証有効化
                await auth.api.enableTwoFactor({
                    body: {
                        password: validatedField.data.password
                    },
                    headers: await headers()
                });

            case 'invalid': 
                // 2要素認証無効化
                await auth.api.disableTwoFactor({
                    body: {
                        password: validatedField.data.password
                    },
                    headers: await headers()
                });
        }
    } catch (error) {
        if (error instanceof APIError) {
            return {
                message: {
                    error: `2要素認証の設定に失敗しました。
                            詳細: ${error.body?.message}`
                }
            }
        }
    }
}

// TOTP URI取得
export async function getTotpUri(formData: FormData) {
    const validatedField = logInSchema
        .omit({name: true, email: true})
        .extend({
            selected: z.enum(['totp', 'disable']),
        })
        .safeParse({
            password: formData.get('password'),
            selected: formData.get('selected'),
        });
    
    if (validatedField.error) {
        const flattened = z.flattenError(validatedField.error);
        return {
            errors: flattened.fieldErrors.password
        };
    } 
    try {
        switch (validatedField.data.selected) {
            case 'totp':
                // TOTP URI取得
                const data = await auth.api.getTOTPURI({
                    body: {
                        password: validatedField.data.password
                    },
                    headers: await headers(),
                });
                if (data) {
                    return {
                        success: data.totpURI
                    };
                }
            case 'disable':
                // 2要素認証無効化
                await auth.api.disableTwoFactor({
                    body: {
                        password: validatedField.data.password
                    },
                    headers: await headers(),
                });
        }
    } catch (error) {
        if (error instanceof APIError) {
            return {
                messages: {
                    errors: `2要素認証の設定に失敗しました。
                            詳細: ${error.body?.message}`
                }
            }
        }
    }
}

// TOTPコード検証
export async function verifyTotp(
    prevState: {
        errors?: string[],
        messages?: {
            errors?: string,
            success?: string
        }
    } | undefined, 
    formData: FormData
) {
    const validatedField = z.object({totp: z.string()
        .regex(/^\d+$/)})
        .safeParse({totp: formData.get('totp')});

    if (validatedField.error) {
        const flattened = z.flattenError(validatedField.error);
        return {
            errors: flattened.fieldErrors.totp
        };
    }

    let token: string | undefined;

    try {
        // TOTPコード検証
        const totp = await auth.api.verifyTOTP({
            body: {
                code: validatedField.data.totp
            },
            headers: await headers()
        });
        // TOTPコード検証成功
        if (totp.token) {
            token = totp.token;
            return {
                messages: {
                    success: 'TOTPコードの検証に成功しました。'
                }
            }
        } 
        // TOTPコードが誤っている場合
        return {
            messages: {
                errors: 'TOTPコードが誤っています。'
            }
        }; 
    } catch (error) {
        if (error instanceof APIError) {
            return {
                messages: {
                    errors: `コードの検証に失敗しました。
                            詳細: ${error.body?.message}`
                }
            };
        }
    }

    if (token) {
        await setThemeCookie();
        // try-catchでは使用不可
        redirect('/home');
    }
}

// OTPコード検証
export async function verifyOtp(
    prevState: {
        errors?: string[],
        messages?: {
            errors?: string,
            success?: string
        }
    } | undefined, 
    formData: FormData
) {
    const validatedField = z.object({otp: z.string()
        .regex(/^\d+$/)})
        .safeParse({otp: formData.get('otp')});

    if (validatedField.error) {
        const flattened = z.flattenError(validatedField.error);
        return {
            errors: flattened.fieldErrors.otp
        };
    }

    let token: string | undefined;

    try {
        // OTPコード検証
        const otp = await auth.api.verifyTwoFactorOTP({
            body: {
                code: validatedField.data.otp
            },
            headers: await headers()
        });
        // OTPコード検証成功
        if (otp.token) {
            token = otp.token;
            return {
                messages: {
                    success: 'OTPコードの検証に成功しました。'
                }
            }
        } 
        // OTPコードが誤っている場合
        return {
            messages: {
                errors: 'OTPコードが誤っています。'
            }
        };
    } catch (error) {
        if (error instanceof APIError) {
            return {
                messages: {
                    errors: `コードの検証に失敗しました。
                            詳細: ${error.body?.message}`
                }
            };
        }
    }

    if (token) {
        await setThemeCookie();
        redirect('/home');
    }
}

// パスワード再設定のリクエストメール送信
export async function requestResetPassword(prevState: StatePickEmail | undefined, formData: FormData) {
    const validatedField = logInSchema
        .omit({name: true, password: true})
        .safeParse({
            email: formData.get('email'),
        });
    
    if (validatedField.error) {
        const flattened = z.flattenError(validatedField.error);
        return {
            errors: flattened.fieldErrors.email
        };
    }

    try {
        const existingEmail = await db.query.users.findFirst({
            where: (users, {eq}) => (eq(users.email, validatedField.data.email))
        });
        // 未登録のメールアドレスの場合
        if (!existingEmail) {
            return {
                messages: {
                    errors: '入力されたメールアドレスは未登録です。'
                }
            }
        }
        // パスワード再設定のリクエストメール送信
        await auth.api.requestPasswordReset({
            body: {
                email: validatedField.data.email,
                redirectTo: '/reset/password'
            }
        });
        return {
            messages: {
                success: "リクエストメールの送信に成功しました。入力されたメールアドレスに届いたメールを確認してください。"
            }
        }
    } catch (error) {
        if (error instanceof APIError) {
            return {
                messages: {
                    errors: `メールの送信に失敗しました。
                            詳細: ${error.body?.message}`
                }
            }
        }
    }
}

// パスワード再設定
export async function resetPasswordAction(prevState: StateOmitName | undefined, formData: FormData) {    
    const validatedField = logInSchema
        .omit({name: true, email: true})
        .extend({token: z.string()})
        .safeParse({
            token: formData.get('token'),
            password: formData.get('password'),
        });
    
    if (validatedField.error) {
        const flattened = z.flattenError(validatedField.error);
        return {
            errors: flattened.fieldErrors.password
        };
    } 
    try {
        // パスワード再設定
        await auth.api.resetPassword({
            body: {
                newPassword: validatedField.data.password,
                token: validatedField.data.token
            }   
        });
        return {
            messages: {
                success: 'パスワードの変更に成功しました。'
            }
        }
    } catch (error) {
        if (error instanceof APIError) {
            return {
                messages: {
                    errors: `パスワードの変更に失敗しました。
                            詳細: ${error.body?.message}`
                }
            }
        }
    }
}
