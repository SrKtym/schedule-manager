import { createAccessControl } from "better-auth/plugins/access";

const statement = {
    announcement: ["create", "read", "update", "delete"],
    assignment: ["create", "read", "update", "delete"],
    user: ["create", "read", "update", "delete", "ban"],  
} as const;

export const ac = createAccessControl(statement);

export const student = ac.newRole({
    announcement: ["read"],
    assignment: ["read"],
    user: ["read"],
});

export const professor = ac.newRole({
    announcement: ["read", "create", "update", "delete"],
    assignment: ["read", "create", "update", "delete"],
    user: ["read"],
});

export const admin = ac.newRole({
    announcement: ["create", "read", "update", "delete"],
    assignment: ["create", "read", "update", "delete"],
    user: ["create", "read", "update", "delete", "ban"],
});
