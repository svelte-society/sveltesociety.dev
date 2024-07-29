import { relations, sql } from 'drizzle-orm';
import { sqliteTable, text, integer, uniqueIndex, index } from 'drizzle-orm/sqlite-core';

// Existing tables and relations...
export const users = sqliteTable(
	'users',
	{
		id: integer('id').primaryKey(),
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
	},
	(users) => ({
		githubIdIdx: uniqueIndex('githubIdIdx').on(users.github_id),
		usernameIdx: uniqueIndex('usernameIdx').on(users.username)
	})
);

export const usersRelations = relations(users, ({ many, one }) => ({
	sessions: many(sessions),
	role: one(roles, { fields: [users.role], references: [roles.id] }),
	authored_content: many(content),
	likes: many(likes),
}));

export const sessions = sqliteTable(
	'sessions',
	{
		id: integer('id').primaryKey(),
		user_id: integer('user_id')
			.notNull()
			.references(() => users.id),
		session_token: text('session_token').notNull(),
		expires_at: text('expires_at').notNull(),
		created_at: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow()
	},
	(sessions) => ({
		userIdIdx: index('user_id_idx').on(sessions.user_id)
	})
);

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

export const content = sqliteTable(
	'content',
	{
		id: integer('id').primaryKey({
			autoIncrement: true
		}),
		title: text('title').notNull(),
		type: text('type', { enum: ['recipe', 'video', 'library', 'link', 'blog', 'collection'] }).notNull(),
		status: text('status', { enum: ['draft', 'published', 'archived', 'pending_review'] }).notNull().default('draft'),
		body: text('body'),
		rendered_body: text('rendered_body'),
		slug: text('slug').notNull(),
		description: text('description'),
		metadata: text('metadata', { mode: 'json' }),
		children: text('children', { mode: 'json' }).$type<number[]>(),
		created_at: integer('created_at', { mode: 'timestamp' })
			.notNull()
			.default(sql`(CURRENT_TIMESTAMP)`),
		updated_at: integer('updated_at', { mode: 'timestamp' })
			.notNull()
			.default(sql`(CURRENT_TIMESTAMP)`),
		published_at: integer('published_at', { mode: 'timestamp' }),
		likes: integer('likes').notNull().default(0),
		saves: integer('saves').notNull().default(0),
	},
	(content) => ({
		titleIdx: uniqueIndex('titleIdx').on(content.title),
		contentSlugIdx: uniqueIndex('contentSlugIdx').on(content.slug),
		statusIdx: index('statusIdx').on(content.status)
	})
);

export const contentRelations = relations(content, ({ many }) => ({
	authors: many(contentToUsers),
	tags: many(contentToTags),
	likes: many(likes),
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


export const tags = sqliteTable(
	'tags',
	{
		id: integer('id').primaryKey(),
		name: text('name').notNull(),
		slug: text('slug').notNull(),
		color: text('color'),
		created_at: integer('created_at', { mode: 'timestamp' })
			.notNull()
			.default(sql`(CURRENT_TIMESTAMP)`),
		updated_at: integer('updated_at', { mode: 'timestamp' })
			.notNull()
			.default(sql`(CURRENT_TIMESTAMP)`)
	},
	(tags) => ({
		tagsSlugIdx: uniqueIndex('tagsSlugIdx').on(tags.slug)
	})
);

export const tagsRelations = relations(tags, ({ many }) => ({
	contents: many(contentToTags)
}));

export const contentToTags = sqliteTable(
	'content_to_tags',
	{
		content_id: text('content_id')
			.notNull()
			.references(() => content.id),
		tag_id: integer('tag_id')
			.notNull()
			.references(() => tags.id)
	},
	(table) => ({
		contentTagIdx: uniqueIndex('contentTagIdx').on(table.content_id, table.tag_id),
		tagIdIdx: index('tag_id_idx').on(table.tag_id)
	})
);

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

export const likes = sqliteTable(
	'likes',
	{
		id: integer('id').primaryKey(),
		user_id: integer('user_id').notNull().references(() => users.id),
		target_id: integer('target_id').notNull(),
		created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(CURRENT_TIMESTAMP)`)
	},
	(table) => ({
		userTargetLikeIdx: uniqueIndex('userTargetLikeIdx').on(table.user_id, table.target_id),
	})
);

export const likesRelations = relations(likes, ({ one }) => ({
	user: one(users, {
		fields: [likes.user_id],
		references: [users.id],
	}),
	content: one(content, {
		fields: [likes.target_id],
		references: [content.id],
	})
}));

export const saves = sqliteTable(
	'saves',
	{
		id: integer('id').primaryKey(),
		user_id: integer('user_id').notNull().references(() => users.id),
		target_id: integer('target_id').notNull(),
		created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(CURRENT_TIMESTAMP)`)
	},
	(table) => ({
		userTargetSaveIdx: uniqueIndex('userTargetSaveIdx').on(table.user_id, table.target_id),
	})
);

export const savedRelations = relations(saves, ({ one }) => ({
	user: one(users, {
		fields: [saves.user_id],
		references: [users.id],
	}),
	content: one(content, {
		fields: [saves.target_id],
		references: [content.id],
	})
}));