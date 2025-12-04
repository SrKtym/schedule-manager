import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

const statement = {
    ...defaultStatements,
    announcement: ["create", "read", "update", "delete"],
    assignment: ["create", "read", "update", "delete"]  
} as const;

export const ac = createAccessControl(statement);

export const student = ac.newRole({
    announcement: ["read"],
    assignment: ["read"]
});

export const professor = ac.newRole({
    announcement: ["read", "create", "update", "delete"],
    assignment: ["read", "create", "update", "delete"],
});

export const admin = ac.newRole({
    announcement: ["create", "read", "update", "delete"],
    assignment: ["create", "read", "update", "delete"],
    ...adminAc.statements
});
