import { pgSchema } from "drizzle-orm/pg-core";
import { 
    boolean, 
    integer, 
    text, 
    timestamp 
} from "drizzle-orm/pg-core";

// スキーマの定義
export const betterAuth = pgSchema("better_auth");

// -----------------------------------------------------------------------------------------------
// Better-Auth用のテーブル
// -----------------------------------------------------------------------------------------------


// ユーザー
export const users = betterAuth.table("users", {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text('name'),
    email: text('email')
        .notNull()
        .unique(),
    emailVerified: boolean('email_verified').notNull(),
    image: text('image'),
    createdAt: timestamp('created_at')
        .defaultNow()
        .notNull(),
    updatedAt: timestamp('updated_at')
        .$onUpdate(() => new Date())
        .notNull(),
    username: text('username').unique(),
    displayUsername: text('display_username'),
    role: text("role"),
    banned: boolean("banned"),
    banReason: text("ban_reason"),
    banExpires: timestamp("ban_expires"),
    twoFactorEnabled: boolean('two_factor_enabled')
});

// セッション
export const sessions = betterAuth.table("sessions", {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at')
        .defaultNow()
        .notNull(),
    updatedAt: timestamp('updated_at')
        .$onUpdate(() => new Date())
        .notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
        .notNull()
        .references(()=> users.id, { onDelete: 'cascade' }),
    impersonatedBy: text("impersonated_by")
});

// アカウント
export const accounts = betterAuth.table("accounts", {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
        .notNull()
        .references(()=> users.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at')
        .defaultNow()
        .notNull(),
    updatedAt: timestamp('updated_at')
        .$onUpdate(() => new Date())
        .notNull()
});

// 認証
export const verifications = betterAuth.table("verifications", {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at')
        .defaultNow()
        .notNull(),
    updatedAt: timestamp('updated_at')
        .$onUpdate(() => new Date())
        .notNull()
});

// 2要素認証
export const twoFactors = betterAuth.table("two_factors", {
    id: text('id').primaryKey(),
    secret: text('secret').notNull(),
    backupCodes: text('backup_codes').notNull(),
    userId: text('user_id')
        .notNull()
        .references(()=> users.id, { onDelete: 'cascade' })
});

// パスキー認証
export const passkeys = betterAuth.table("passkeys", {
    id: text('id').primaryKey(),
    name: text('name'),
    publicKey: text('public_key').notNull(),
    userId: text('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    credentialID: text('credential_id').notNull(),
    counter: integer('counter').notNull(),
    deviceType: text('device_type').notNull(),
    backedUp: boolean('backed_up').notNull(),
    transports: text('transports'),
    createdAt: timestamp('created_at')
        .defaultNow()
        .notNull(),
    aaguid: text("aaguid"),
});


