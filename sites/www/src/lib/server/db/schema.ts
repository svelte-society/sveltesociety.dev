import { sql, relations } from "drizzle-orm";
import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    github_id: integer('github_id'),
    email: text('email'),
    username: text('username'),
    name: text('name'),
    avatar_url: text('avatar_url'),
    bio: text('bio'),
    location: text('location'),
    twitter: text('twitter'),
    role_id: integer('role_id').references(() => roles.id),
    created_at: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
})

export const usersRelations = relations(users, ({ many }) => ({
    sessions: many(sessions),
    usersToRoles: many(usersToRoles),
}))

export const sessions = sqliteTable('sessions', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    user_id: integer('user_id').notNull().references(() => users.id),
    session_token: text('session_token').notNull(),
    expires_at: text('expires_at').notNull(),
    created_at: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`)
})

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
    user: one(users, {
        fields: [sessions.user_id],
        references: [users.id]
    })
}))

export const roles = sqliteTable('roles', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    value: text('value').notNull(),
    description: text('description'),
    permissions: text('permissions'),
    created_at: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
})

export const rolesRelations = relations(roles, ({ many }) => ({
    usersToRoles: many(usersToRoles),
}))

export const usersToRoles = sqliteTable('users_to_roles', {
    user_id: integer('user_id').notNull().references(() => users.id).references(() => roles.id),
    role_id: integer('role_id').notNull().references(() => roles.id).references(() => users.id),
})

export const usersToRolesRelations = relations(usersToRoles, ({ one }) => ({
    user: one(users, {
        fields: [usersToRoles.user_id],
        references: [users.id]
    }),
    role: one(roles, {
        fields: [usersToRoles.role_id],
        references: [roles.id]
    })
}))