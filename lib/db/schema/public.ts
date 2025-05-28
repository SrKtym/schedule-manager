import { text, integer, timestamp, boolean, pgEnum, pgTable, pgView } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';



export const gradeEnum = pgEnum("grade", ['1学年', '2学年', '3学年', '4学年']);
export const facultyOfEnum = pgEnum("faculty_of", [
    '文学部', 
    '経済学部', 
    '法学部', 
    '教育学部', 
    '社会学部',
    '理学部',
    '工学部',
    '農学部',
    '医学部',
]);

export const departmentEnum = pgEnum("department", [
    '史学科',
    '哲学科',
    '心理学科',
    '文学科',
    '経済学科',
    '経営学科',
    '法律学科',
    '政治学科',
    '教育学科',
    '社会学科',
    '社会心理学科',
    '数学科',
    '物理学科',
    '化学科',
    '生物学科',
    '地学科',
    '情報工学科',
    '機械工学科',
    '電気工学科',
    '建築学科',
    '生物資源学科',
    '森林学科',
    '医学科',
    '看護学科',
    '保健学科',
]);

export const weekEnum = pgEnum("week", ['月曜日', '火曜日', '水曜日', '木曜日', '金曜日']);
export const periodEnum = pgEnum("period", ['1限目', '2限目', '3限目', '4限目', '5限目', '6限目', '7限目']);
export const creditEnum = pgEnum("credit", ['1', '2', '4']);
export const requiredEnum = pgEnum("required", ['必修', '選択必修', '任意']);
export const themeEnum = pgEnum("theme", ['light', 'dark']);
export const notificationEnum = pgEnum("notification", ['on', 'off']);



export const users = pgTable("users", {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text('name'),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').notNull(),
    image: text('image'),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').$onUpdate(() => new Date()).notNull(),
    username: text('username').unique(),
    displayUsername: text('display_username'),
    twoFactorEnabled: boolean('two_factor_enabled')
});

export const sessions = pgTable("sessions", {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').$onUpdate(() => new Date()).notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
        .notNull()
        .references(()=> users.id, { onDelete: 'cascade' })
});

export const accounts = pgTable("accounts", {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id').notNull().references(()=> users.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').$onUpdate(() => new Date()).notNull()
});

export const verifications = pgTable("verifications", {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at'),
    updatedAt: timestamp('updated_at').$onUpdate(() => new Date())
});

export const twoFactors = pgTable("two_factors", {
    id: text('id').primaryKey(),
    secret: text('secret').notNull(),
    backupCodes: text('backup_codes').notNull(),
    userId: text('user_id').notNull().references(()=> users.id, { onDelete: 'cascade' })
});

export const passkeys = pgTable("passkeys", {
    id: text('id').primaryKey(),
    name: text('name'),
    publicKey: text('public_key').notNull(),
    userId: text('user_id')
        .notNull()
        .references(()=> users.id, { onDelete: 'cascade' }),
    credentialID: text('credential_id').notNull(),
    counter: integer('counter').notNull(),
    deviceType: text('device_type').notNull(),
    backedUp: boolean('backed_up').notNull(),
    transports: text('transports'),
    createdAt: timestamp('created_at')
});




export const settings = pgTable("settings", {
    email: text('email')
        .primaryKey()
        .references(() => users.email, { onDelete: 'cascade' }),
    theme: themeEnum().default('light').notNull(),
    notification: notificationEnum().default('on').notNull()
});


export const attribute = pgTable("attribute", {
    userId: text('user_id')
        .primaryKey()
        .references(() => users.id, { onDelete: 'cascade' }),
    grade: gradeEnum().notNull(),
    facultyOf: facultyOfEnum().notNull(),
    department: departmentEnum().notNull(),
});


export const course = pgTable("course", {
    name: text('name').primaryKey(),
    week: weekEnum().notNull(),
    period: periodEnum().notNull(),
    targetGrade: gradeEnum().notNull(),
    targetFaculty: facultyOfEnum(),
    targetDepartment: departmentEnum(),
    credit: creditEnum().notNull(),
    required: requiredEnum().notNull(),
    classroom: text('classroom').notNull(),
    professor: text('professor').notNull(),
    textbooks: text('textbooks')
});



export const registered = pgTable("registered", {
    name: text('name')
        .references(() => course.name, { onDelete: 'cascade'}),
    email: text('email')
        .references(() => users.email, { onDelete: 'cascade'})
});


export const scheduleView = pgView("schedule_view")
    .as((qb) => qb.select({name: registered.name})
    .from(registered));




export const usersRelation = relations(users, ({many}) => ({
    accounts: many(accounts),
    twoFactors: many(twoFactors),
    settings: many(settings),
    attribute: many(attribute),
    registered: many(registered)
}));

export const accountsRelation = relations(accounts, ({one}) => ({
    user: one(users, {
        fields: [accounts.userId],
        references: [users.id]
    })
}));

export const twoFactorsRelation = relations(twoFactors, ({one}) => ({
    user: one(users, {
        fields: [twoFactors.userId],
        references: [users.id]
    })
}));


export const settingsRelations = relations(settings, ({one}) => ({
    user: one(users, {
        fields: [settings.email],
        references: [users.email]
    })
}));

export const attributeRelations = relations(attribute, ({one}) => ({
    user: one(users, {
        fields: [attribute.userId],
        references: [users.id]
    })
}));

export const registeredRelations = relations(registered, ({one}) => ({
    user: one(users, {
        fields: [registered.email],
        references: [users.email]
    })
}));
