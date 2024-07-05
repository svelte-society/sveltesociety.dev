import { relations } from 'drizzle-orm';
import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';

// Existing tables and relations...
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
	created_at: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow()
});

export const usersRelations = relations(users, ({ many }) => ({
	sessions: many(sessions),
	usersToRoles: many(usersToRoles),
	authoredContents: many(content),
	authoredCollections: many(collections)
}));

export const sessions = sqliteTable('sessions', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	user_id: integer('user_id')
		.notNull()
		.references(() => users.id),
	session_token: text('session_token').notNull(),
	expires_at: text('expires_at').notNull(),
	created_at: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow()
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.user_id],
		references: [users.id]
	})
}));

export const roles = sqliteTable('roles', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	value: text('value').notNull(),
	description: text('description'),
	permissions: text('permissions'),
	active: integer('active', { mode: 'boolean' }).notNull().default(false),
	created_at: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow()
});

export const rolesRelations = relations(roles, ({ many }) => ({
	usersToRoles: many(usersToRoles)
}));

export const usersToRoles = sqliteTable('users_to_roles', {
	user_id: integer('user_id')
		.notNull()
		.references(() => users.id),
	role_id: integer('role_id')
		.notNull()
		.references(() => roles.id)
});

export const usersToRolesRelations = relations(usersToRoles, ({ one }) => ({
	user: one(users, {
		fields: [usersToRoles.user_id],
		references: [users.id]
	}),
	role: one(roles, {
		fields: [usersToRoles.role_id],
		references: [roles.id]
	})
}));

export const content = sqliteTable('content', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	title: text('title').notNull(),
	type: text('type', { enum: ['recipe', 'video'] }).notNull(),
	blocks: text('blocks').notNull(), // Storing as JSON string
	created_at: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow(),
	updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().defaultNow()
});

export const contentRelations = relations(content, ({ many }) => ({
	authors: many(contentToUsers),
	collections: many(contentToCollections)
}));

export const collections = sqliteTable('collections', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	title: text('title').notNull(),
	created_at: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow(),
	updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().defaultNow()
});

export const collectionsRelations = relations(collections, ({ many }) => ({
	contents: many(contentToCollections),
	authors: many(collectionsToUsers)
}));

export const blocks = sqliteTable('blocks', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	type: text('type', { enum: ['text', 'image', 'video', 'code'] }).notNull(), // e.g., 'text', 'image', 'video', 'code', etc.
	data: text('data').notNull(), // JSON string containing the block's data
	created_at: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow(),
	updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().defaultNow()
});

// Junction tables for many-to-many relationships
export const contentToUsers = sqliteTable('content_to_users', {
	content_id: integer('content_id')
		.notNull()
		.references(() => content.id),
	user_id: integer('user_id')
		.notNull()
		.references(() => users.id)
});

export const contentToUsersRelations = relations(contentToUsers, ({ one }) => ({
	content: one(content, {
		fields: [contentToUsers.content_id],
		references: [content.id]
	}),
	user: one(users, {
		fields: [contentToUsers.user_id],
		references: [users.id]
	})
}));

export const contentToCollections = sqliteTable('content_to_collections', {
	content_id: integer('content_id')
		.notNull()
		.references(() => content.id),
	collection_id: integer('collection_id')
		.notNull()
		.references(() => collections.id),
	order: integer('order').notNull()
});

export const contentToCollectionsRelations = relations(contentToCollections, ({ one }) => ({
	content: one(content, {
		fields: [contentToCollections.content_id],
		references: [content.id]
	}),
	collection: one(collections, {
		fields: [contentToCollections.collection_id],
		references: [collections.id]
	})
}));

export const collectionsToUsers = sqliteTable('collections_to_users', {
	collection_id: integer('collection_id')
		.notNull()
		.references(() => collections.id),
	user_id: integer('user_id')
		.notNull()
		.references(() => users.id)
});

export const collectionsToUsersRelations = relations(collectionsToUsers, ({ one }) => ({
	collection: one(collections, {
		fields: [collectionsToUsers.collection_id],
		references: [collections.id]
	}),
	user: one(users, {
		fields: [collectionsToUsers.user_id],
		references: [users.id]
	})
}));

export const contentBlocks = sqliteTable(
	'content_blocks',
	{
		content_id: integer('content_id')
			.notNull()
			.references(() => content.id),
		block_id: integer('block_id')
			.notNull()
			.references(() => blocks.id),
		order: integer('order').notNull()
	},
	(table) => ({
		pk: primaryKey(table.content_id, table.block_id)
	})
);

export const collectionBlocks = sqliteTable(
	'collection_blocks',
	{
		collection_id: integer('collection_id')
			.notNull()
			.references(() => collections.id),
		block_id: integer('block_id')
			.notNull()
			.references(() => blocks.id),
		order: integer('order').notNull()
	},
	(table) => ({
		pk: primaryKey(table.collection_id, table.block_id)
	})
);
