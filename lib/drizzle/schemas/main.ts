import { 
    text, 
    integer, 
    timestamp, 
    boolean, 
    pgRole,
    pgSchema,
    unique,
    foreignKey,
    check,
    primaryKey,
    jsonb
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { 
    assignmentStatus as status,
    credit,
    daysOfWeek, 
    notification, 
    period, 
    required,
    faculty, 
    grade, 
    theme, 
    week, 
    attachmentType,
    announcementType,
    department,
} from '@/constants/definitions';
import { users } from './better-auth';
import { objectValues } from '@/utils/helpers/register';


// スキーマの定義
export const main = pgSchema("main");


// Enum型の定義
export const gradeEnum = main.enum("grade", grade);
export const facultyOfEnum = main.enum("faculty", faculty);
export const departmentEnum = main.enum("department", objectValues(department, "全学部"));
export const weekEnum = main.enum("week", week);
export const daysEnum = main.enum("days", daysOfWeek);
export const periodEnum = main.enum("period", period);
export const creditEnum = main.enum("credit", credit);
export const requiredEnum = main.enum("required", required);
export const themeEnum = main.enum("theme", theme);
export const notificationEnum = main.enum("notification", notification);
export const assignmentStatusEnum = main.enum("status", status);
export const fileTypeEnum = main.enum("file_type", attachmentType);
export const announcementTypeEnum = main.enum("announcement_type", announcementType);


// ロールの定義
export const admin = pgRole("admin", { createRole: true, createDb: true, inherit: true }).existing();
export const professor = pgRole("professor").existing();


// -----------------------------------------------------------------------------------------------
// カスタムテーブル
// -----------------------------------------------------------------------------------------------

// テーマと通知の設定
export const settings = main.table("settings", {
    userId: text('user_id')
        .primaryKey()
        .references(() => users.id, { onDelete: 'cascade' }),
    theme: themeEnum().default('light').notNull(),
    notification: notificationEnum().default('on').notNull()
});

// 学生の所属
export const studentAttribute = main.table("student_attribute", {
    userId: text('user_id')
        .primaryKey()
        .references(()=> users.id, { onDelete: 'cascade' }),
    grade: gradeEnum().notNull(),
    faculty: facultyOfEnum().notNull(),
    department: departmentEnum().notNull(),
});

// 講義
export const course = main.table("course", {
    name: text('name').primaryKey(),
    week: weekEnum().notNull(),
    period: periodEnum().notNull(),
    targetGrade: gradeEnum().notNull(),
    targetFaculty: facultyOfEnum(),
    targetDepartment: departmentEnum(),
    credit: creditEnum().notNull(),
    required: requiredEnum().notNull(),
    classroom: text('classroom').notNull(),
    professor: text('professor').notNull()
});

// 履修登録
export const registered = main.table("registered", {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    period: periodEnum().notNull(),
    week: weekEnum().notNull(),
    userId: text('user_id')
        .notNull()
        .references(()=> users.id, { onDelete: 'cascade' })
}, (t) => ([
     /* foreignKey()演算子を使った外部キー制約の定義 */ 
    unique().on(t.userId, t.period, t.week),
    foreignKey({
        columns: [t.name],
        foreignColumns: [course.name]
    }).onDelete('cascade'),

    foreignKey({
        columns: [t.userId],
        foreignColumns: [users.id]
    }).onDelete('cascade')
]));

// スケジュール
export const schedule = main.table("schedule", {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    title: text('title')
        .notNull()
        .default('no title'),
    start: timestamp('start', { mode: 'date', precision: 0 }).notNull(),
    end: timestamp('end', { mode: 'date', precision: 0 }).notNull(),
    description: text('description'),
    color: text('color').notNull(),
    userId: text('user_id')
        .notNull()
        .references(()=> users.id, { onDelete: 'cascade' })
}, (t) => ([
    unique().on(t.userId, t.start, t.end),
    foreignKey({
        columns: [t.userId],
        foreignColumns: [users.id]
    }).onDelete('cascade')
]));

// メッセージ
export const messages = main.table("messages", {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    sender: text('sender').notNull(),
    receiver: text('receiver').notNull(),
    subject: text('subject'),
    body: text('body'),
    details: jsonb('details'),
    isRead: boolean('is_read')
        .default(false)
        .notNull(),
    createdAt: timestamp('created_at')
        .defaultNow()
        .notNull()
});

// アナウンスメント（教員用）
export const announcement = main.table("announcement", {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    title: text('title').notNull(),
    content: text('content').notNull(),
    courseName: text('course_name')
        .references(() => course.name, { onDelete: 'cascade' })
        .notNull(),
    createdAt: timestamp('created_at')
        .defaultNow()
        .notNull(),
    updatedAt: timestamp('updated_at')
        .$onUpdate(() => new Date())
        .notNull(),
    type: announcementTypeEnum().notNull(),
    userId: text('user_id')
        .notNull()
        .references(()=> users.id, { onDelete: 'cascade' })
});

// 課題の内容（教員用）
export const assignmentData = main.table("assignment_data", {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    courseName: text('course_name')
        .references(() => course.name, { onDelete: 'cascade' })
        .notNull(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    points: integer('points').notNull(),
    dueDate: timestamp('due_date').notNull(),
    createdAt: timestamp('created_at')
        .defaultNow()
        .notNull(),
    updatedAt: timestamp('updated_at')
        .$onUpdate(() => new Date())
        .notNull(),
    type: fileTypeEnum(),
    userId: text('user_id')
        .notNull()
        .references(()=> users.id, { onDelete: 'cascade' })
});

// 学生ごとの課題の状態
export const assignmentStatus = main.table("assignment_status", {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    assignmentId: text('assignment_id')
        .references(() => assignmentData.id, { onDelete: 'cascade' })
        .notNull(),
    userName: text('user_name')
        .references(() => users.name, { onDelete: 'cascade' })
        .notNull(),
    courseName: text('course_name')
        .references(() => registered.name, { onDelete: 'cascade' })
        .notNull(),
    status: assignmentStatusEnum().notNull(),
    evaluated: integer('evaluated'),
    userId: text('user_id')
        .notNull()
        .references(()=> registered.userId, { onDelete: 'cascade' })
}, (t) => [
    // ステータスが「評定済」でなければ、評定値はnull、または
    // ステータスが「評定済」なら、評定値はnullでない
    check("status_check", 
        sql`(${t.status} != '評定済' AND ${t.evaluated} IS NULL) OR 
        (${t.status} = '評定済' AND ${t.evaluated} IS NOT NULL)`),
    unique().on(t.assignmentId, t.userId)

]);

// 提出物（テキスト形式、添付ファイルなし）
export const submission = main.table("submission", {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    assignmentId: text('assignment_id')
        .references(() => assignmentData.id, { onDelete: 'cascade' })
        .notNull(),
    content: text('content'),
    createdAt: timestamp('created_at')
        .defaultNow()
        .notNull(),
    updatedAt: timestamp('updated_at')
        .$onUpdate(() => new Date())
        .notNull(),
    userId: text('user_id')
        .notNull()
        .references(()=> registered.userId, { onDelete: 'cascade' })
}, (t) => [
    unique().on(t.assignmentId, t.userId)
]);

// 添付ファイル(課題とアナウンスメント用)メタデータ（教員用）
export const attachmentMetaData = main.table("attachment_metadata", {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    type: fileTypeEnum().notNull(),
    url: text('url').notNull(),
    createdAt: timestamp('created_at')
        .defaultNow()
        .notNull(),
    updatedAt: timestamp('updated_at')
        .$onUpdate(() => new Date())
        .notNull(),
    userId: text('user_id')
        .notNull()
        .references(()=> users.id, { onDelete: 'cascade' })
});

// 提出物（ファイル形式）メタデータ
export const submissionMetaData = main.table("submission_metadata", {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    type: fileTypeEnum().notNull(),
    url: text('url').notNull(),
    createdAt: timestamp('created_at')
        .defaultNow()
        .notNull(),
    updatedAt: timestamp('updated_at')
        .$onUpdate(() => new Date())
        .notNull(),
    userId: text('user_id')
        .notNull()
        .references(()=> users.id, { onDelete: 'cascade' })
});

// アナウンスメントと添付ファイルの関連付け(中間テーブル)
export const announcementAttachmentMetaDataIds = main.table("announcement_attachment_metadata_ids", {
    announcementId: text('announcement_id')
        .references(() => announcement.id, { onDelete: 'cascade' })
        .notNull(),
    attachmentMetaDataId: text('attachment_metadata_id')
        .references(() => attachmentMetaData.id, { onDelete: 'cascade' })
        .notNull(),
    createdAt: timestamp('created_at')
        .defaultNow()
        .notNull(),
    updatedAt: timestamp('updated_at')
        .$onUpdate(() => new Date())
        .notNull(),
}, (t) => [
    primaryKey({
        columns: [t.announcementId, t.attachmentMetaDataId]
    })
]);

// 課題と添付ファイルの関連付け(中間テーブル)
export const assignmentAttachmentMetaDataIds = main.table("assignment_attachment_metadata_ids", {
    assignmentId: text('assignment_id')
        .references(() => assignmentData.id, { onDelete: 'cascade' })
        .notNull(),
    attachmentMetaDataId: text('attachment_metadata_id')
        .references(() => attachmentMetaData.id, { onDelete: 'cascade' })
        .notNull(),
    createdAt: timestamp('created_at')
        .defaultNow()
        .notNull(),
    updatedAt: timestamp('updated_at')
        .$onUpdate(() => new Date())
        .notNull(),
}, (t) => [
    primaryKey({
        columns: [t.assignmentId, t.attachmentMetaDataId]
    })
]);

// 提出物と添付ファイルの関連付け（中間テーブル）
export const submissionMetaDataIds = main.table("submission_metadata_ids", {
    submissionId: text('submission_id')
        .references(() => submission.id, { onDelete: 'cascade' })
        .notNull(),
    submissionMetaDataId: text('submission_metadata_id')
        .references(() => submissionMetaData.id, { onDelete: 'cascade' })
        .notNull(),
    createdAt: timestamp('created_at')
        .defaultNow()
        .notNull(),
    updatedAt: timestamp('updated_at')
        .$onUpdate(() => new Date())
        .notNull(),
}, (t) => [
    primaryKey({
        columns: [t.submissionId, t.submissionMetaDataId]
    })
]);

// コメント
export const comment = main.table("comment", {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    assignmentId: text('assignment_id')
        .references(() => assignmentData.id, { onDelete: 'cascade' }),
    announcementId: text('announcement_id')
        .references(() => announcement.id, { onDelete: 'cascade' }),
    userName: text('user_name')
        .references(() => users.name, { onDelete: 'cascade' })
        .notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at')
        .defaultNow()
        .notNull(),
    updatedAt: timestamp('updated_at')
        .$onUpdate(() => new Date())
        .notNull(),
    userId: text('user_id')
        .notNull()
        .references(()=> users.id, { onDelete: 'cascade' })
});

