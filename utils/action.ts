// データ更新系
'use server';

import type { ScheduleState } from '@/types/schedule';
import { 
    announcementSchema, 
    createAssignmentSchema, 
    createCourseSchema, 
    logInSchema, 
    scheduleSchema 
} from '@/schemas/form-schema';
import { db } from '../lib/drizzle';
import { auth } from '@/lib/better-auth/auth';
import { APIError } from 'better-auth/api';
import { cache } from 'react';
import { cookies, headers } from 'next/headers';
import { getSession } from './getter';
import { 
    announcement, 
    assignmentData, 
    course, 
    schedule 
} from '../lib/drizzle/schema/public';
import { revalidatePath } from 'next/cache';
import z from 'zod/v4';
import { redirect } from 'next/navigation';
import { AnnouncementState, AssignmentState, CourseState } from '@/types/regisered-course';

// ユーザー登録
export async function signUp(formData: FormData) {
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

        if (existingUser) {
            return {
                messages: {
                    errors: "入力された認証情報はすでに使用されています。"
                }
            }
        } else {
            await auth.api.signUpEmail({
                body: {
                    name: validatedFields.data.name,
                    email: validatedFields.data.email,
                    password: validatedFields.data.password,   //scryptによるハッシュ化
                }
            });
            return {
                messages: {
                    success: validatedFields.data.email
                }
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
export async function signIn(formData: FormData) {
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
    try {
        const user = await db.query.users.findFirst({
            with: {
                accounts: {
                    orderBy: (accounts, {desc}) => [desc(accounts.updatedAt)]
                }
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
                        success: user?.accounts[0].providerId
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
                    // 2要素認証有効
                    case true:
                        return {
                            messages: {
                                success: 'twofactor'
                            }
                        }
                    // 2要素認証無効
                    case false:
                        return {
                            messages: {
                                success: 'invalid'
                            }
                        }
                    // 初回ログイン
                    default:
                        return {
                            messages: {
                                errors: 'setting'
                            }
                        }
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
} 

// 2要素認証有効化
export async function enableTwoFactor(
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
                await auth.api.enableTwoFactor({
                    body: {
                        password: validatedField.data.password
                    },
                    headers: await headers()
                });

            case 'invalid': 
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
            errors?: string
        }
    } | undefined, 
    formData: FormData
) {
    const validatedField = z.object({totp: z.string().regex(/^\d+$/)})
        .safeParse({totp: formData.get('totp')});

    if (validatedField.error) {
        const flattened = z.flattenError(validatedField.error);
        return {
            errors: flattened.fieldErrors.totp
        };
    }

    let token: string | undefined;

    try {
        const totp = await auth.api.verifyTOTP({
            body: {
                code: validatedField.data.totp
            },
            headers: await headers()
        });
        if (totp.token) {
            token = totp.token;
        } else {
            return {
                messages: {
                    errors: 'TOTPコードが誤っています。'
                }
            };
        }  
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
            errors?: string
        }
    } | undefined, 
    formData: FormData
) {
    const validatedField = z.object({otp: z.string().regex(/^\d+$/)})
        .safeParse({otp: formData.get('otp')});

    if (validatedField.error) {
        const flattened = z.flattenError(validatedField.error);
        return {
            errors: flattened.fieldErrors.otp
        };
    }

    let token: string | undefined;

    try {
        const otp = await auth.api.verifyTwoFactorOTP({
            body: {
                code: validatedField.data.otp
            },
            headers: await headers()
        });
        if (otp.token) {
            token = otp.token;
        } else {
            return {
                messages: {
                    errors: 'OTPコードが誤っています。'
                }
            };
        }
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

// パスワード再設定メール送信
export async function requestResetPassword(formData: FormData) {
    const validatedField = logInSchema.omit({name: true, password: true}).safeParse({
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
        if (!existingEmail) {
            return {
                messages: {
                    errors: '入力されたメールアドレスは未登録です。'
                }
            }
        }
        await auth.api.requestPasswordReset({
            body: {
                email: validatedField.data.email,
                redirectTo: '/reset/password'
            }
        });
        return {
            messages: {
                success: validatedField.data.email
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
export async function resetPasswordAction(formData: FormData, token: string) {    
    const validatedField = logInSchema.omit({name: true, email: true}).safeParse({
        password: formData.get('password'),
    });
    
    if (validatedField.error) {
        const flattened = z.flattenError(validatedField.error);
        return {
            errors: flattened.fieldErrors.password
        };
    } 
    try {
        await auth.api.resetPassword({
            body: {
                newPassword: validatedField.data.password,
                token: token
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

// スケジュール作成
export async function createSchedule(prevState: ScheduleState | undefined, formData: FormData) {
    const validatedFields = scheduleSchema.safeParse({
        email: formData.get('email'),
        title: formData.get('title'),
        description: formData.get('description'),
        start: formData.get('dateRangeStart'),
        end: formData.get('dateRangeEnd'),
        color: formData.get('color'),
    });
    if (validatedFields.error) {
        const flattened = z.flattenError(validatedFields.error);
        return {
            errors: flattened.fieldErrors
        };
    } else {
        await db
            .insert(schedule)
            .values(validatedFields.data)
            .onConflictDoUpdate({
                target: [schedule.email, schedule.start, schedule.end],
                set: {
                    title: validatedFields.data.title,
                    description: validatedFields.data.description,
                    color: validatedFields.data.color
                }
            });
        revalidatePath('/home/schedule');
    }
}

// 講義作成
export async function createCourse(prevState: CourseState | undefined, formData: FormData) {
    const validatedFields = createCourseSchema.safeParse({
        name: formData.get('name'),
        targetGrade: formData.get('targetGrade'),
        targetFaculty: formData.get('targetFaculty'),
        targetDepartment: formData.get('targetDepartment'),
        week: formData.get('week'),
        period: formData.get('period'),
        credit: formData.get('credit'),
        required: formData.get('required'),
        professor: formData.get('professor'),
        classroom: formData.get('classroom'),
    });
    
    if (validatedFields.error) {
        const flattened = z.flattenError(validatedFields.error);
        return {
            errors: flattened.fieldErrors
        };
    } else {
        await db
            .insert(course)
            .values(validatedFields.data)
            .onConflictDoNothing();

        revalidatePath('/home/register');
    }
}

// アナウンスメント作成
export async function createAnnouncement(prevState: AnnouncementState | undefined, formData: FormData) {
    const validatedFields = announcementSchema.safeParse({
        title: formData.get('title'),
        content: formData.get('content'),
        auther: formData.get('auther'),
        courseName: formData.get('courseName'),
        attachmentIds: formData.get('attachmentIds'),
        type: formData.get('type'),
    });

    if (validatedFields.error) {
        const flattened = z.flattenError(validatedFields.error);
        return {
            errors: flattened.fieldErrors
        };
    } else {
        await db
            .insert(announcement)
            .values(validatedFields.data)
            .onConflictDoNothing();

        revalidatePath(`/home/course-list/${validatedFields.data.courseName}`);
    }
}

// 課題作成
export async function createAssignment(prevState: AssignmentState | undefined, formData: FormData) {
    const validatedFields = createAssignmentSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
        points: formData.get('points'),
        dueDate: formData.get('dueDate'),
        attachmentIds: formData.get('attachmentIds'),
        fileType: formData.get('fileType'),
    });

    if (validatedFields.error) {
        const flattened = z.flattenError(validatedFields.error);
        return {
            errors: flattened.fieldErrors
        };
    } else {
        await db
            .insert(assignmentData)
            .values(validatedFields.data)
            .onConflictDoNothing();

        revalidatePath(`/home/course-list/${validatedFields.data.courseName}`);
    }
}

// テーマ設定
export const setThemeCookie = cache(async () => {
    const cookieStore = await cookies();
    const session = await getSession();
    if (session) {
        const settings = await db.query.settings.findFirst({
            where: (settings, {eq}) => (eq(settings.email, session.user.email))
        });
        cookieStore.set({
            name: 'theme',
            value: settings?.theme || 'light',
            path: '/home'
        });
    }
});







