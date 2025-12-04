// リレーションディレクトリ内のファイル（リレーションを記述したファイル）は型安全なクエリを利用するためのファイル
// データベーススキーマ自体に制約を課すものではないため、このファイルを変更してもマイグレーションは不要
import { relations } from "drizzle-orm";
import { accounts, twoFactors, users } from "../schemas/better-auth";
import { 
    assignmentData, 
    attachmentMetaData, 
    assignmentAttachmentMetaDataIds,
    studentAttribute, 
    course, 
    registered, 
    settings, 
    submission,
    submissionMetaData,
    submissionMetaDataIds,
    assignmentStatus
} from "../schemas/main";

// リレーション
export const usersRelations = relations(users, ({one, many}) => ({
    accounts: many(accounts),
    studentAttribute: one(studentAttribute)
}));

export const courseRelations = relations(course, ({one}) => ({
    registered: one(registered)
}))

export const accountsRelations = relations(accounts, ({one}) => ({
    user: one(users, {
        fields: [accounts.userId],
        references: [users.id]
    })
}));

export const twoFactorsRelations = relations(twoFactors, ({one}) => ({
    user: one(users, {
        fields: [twoFactors.userId],
        references: [users.id]
    })
}));

export const settingsRelations = relations(settings, ({one}) => ({
    user: one(users, {
        fields: [settings.userId],
        references: [users.id]
    })
}));

export const studentAttributeRelations = relations(studentAttribute, ({one}) => ({
    user: one(users, {
        fields: [studentAttribute.userId],
        references: [users.id]
    })
}));

export const registeredRelations = relations(registered, ({one}) => ({
    user: one(users, {
        fields: [registered.userId],
        references: [users.id]
    }),
    course: one(course, {
        fields: [registered.name],
        references: [course.name]
    })
}));

export const assignmentDataRelations = relations(assignmentData, ({one, many}) => ({
    assignmentStatus: one(assignmentStatus),
    assignmentAttachmentMetaDataIds: many(assignmentAttachmentMetaDataIds),
    attachmentMetaData: many(attachmentMetaData)
}));

export const submissionDataRelations = relations(submission, ({one, many}) => ({
    assignmentStatus: one(assignmentStatus),
    submissionMetaData: many(submissionMetaData),
    submissionMetaDataIds: many(submissionMetaDataIds)
}));