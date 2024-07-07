import { desc, relations, sql } from 'drizzle-orm';
import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';

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
	role: integer('role').references(() => roles.id),
	created_at: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow()
}, (users) => ({
	githubIdIdx: uniqueIndex('githubIdIdx').on(users.github_id),
	usernameIdx: uniqueIndex('usernameIdx').on(users.username)
})
);

export const usersRelations = relations(users, ({ many, one }) => ({
	sessions: many(sessions),
	roles: one(users, { fields: [users.role], references: [users.id] }),
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
	description: text('description').notNull(),
	active: integer('active', { mode: 'boolean' }).notNull().default(false),
	created_at: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow()
});

export const rolesRelations = relations(roles, ({ many }) => ({
	user: many(users)
}));

export const content = sqliteTable('content', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	title: text('title').notNull(),
	type: text('type', { enum: ['recipe', 'video'] }).notNull(),
	created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(CURRENT_TIMESTAMP)`),
	updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(CURRENT_TIMESTAMP)`)
}, (content) => ({
	titleIdx: uniqueIndex('titleIdx').on(content.title),
	typeIdx: uniqueIndex('typeIdx').on(content.type)
}));

export const contentRelations = relations(content, ({ many }) => ({
	authors: many(contentToUsers),
	collections: many(contentToCollections),
	tags: many(contentToTags)
}));

export const collections = sqliteTable('collections', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	title: text('title').notNull(),
	created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(CURRENT_TIMESTAMP)`),
	updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(CURRENT_TIMESTAMP)`)
});

export const collectionsRelations = relations(collections, ({ many }) => ({
	contents: many(contentToCollections),
	authors: many(collectionsToUsers)
}));

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

export const tags = sqliteTable('tags', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	slug: text('slug').notNull(),
	color: text('color'),
	created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(CURRENT_TIMESTAMP)`),
	updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(CURRENT_TIMESTAMP)`)
}, (tags) => ({
	slugIdx: uniqueIndex('slugIdx').on(tags.slug),
	nameIdx: uniqueIndex('nameIdx').on(tags.name)
}));

export const tagsRelations = relations(tags, ({ many }) => ({
	contents: many(contentToTags)
}));

export const contentToTags = sqliteTable('content_to_tags', {
	content_id: integer('content_id')
		.notNull()
		.references(() => content.id),
	tag_id: integer('tag_id')
		.notNull()
		.references(() => tags.id)
}, (table) => ({
	contentTagIdx: uniqueIndex('contentTagIdx').on(table.content_id, table.tag_id)
}));

export const contentToTagsRelations = relations(contentToTags, ({ one }) => ({
	content: one(content, {
		fields: [contentToTags.content_id],
		references: [content.id]
	}),
	tag: one(tags, {
		fields: [contentToTags.tag_id],
		references: [tags.id]
	})
}));
