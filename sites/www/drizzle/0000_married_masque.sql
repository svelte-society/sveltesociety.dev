CREATE TABLE `collections` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `collections_to_users` (
	`collection_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	FOREIGN KEY (`collection_id`) REFERENCES `collections`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `content` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`type` text NOT NULL,
	`body` text NOT NULL,
	`slug` text NOT NULL,
	`description` text NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `content_to_collections` (
	`content_id` integer NOT NULL,
	`collection_id` integer NOT NULL,
	`order` integer NOT NULL,
	FOREIGN KEY (`content_id`) REFERENCES `content`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`collection_id`) REFERENCES `collections`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `content_to_tags` (
	`content_id` integer NOT NULL,
	`tag_id` integer NOT NULL,
	FOREIGN KEY (`content_id`) REFERENCES `content`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `content_to_users` (
	`content_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	FOREIGN KEY (`content_id`) REFERENCES `content`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`active` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`session_token` text NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`color` text,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`github_id` integer,
	`email` text,
	`username` text,
	`name` text,
	`avatar_url` text,
	`bio` text,
	`location` text,
	`twitter` text,
	`role` integer,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`role`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `titleIdx` ON `content` (`title`);--> statement-breakpoint
CREATE UNIQUE INDEX `contentSlugIdx` ON `content` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `contentTagIdx` ON `content_to_tags` (`content_id`,`tag_id`);--> statement-breakpoint
CREATE INDEX `tag_id_idx` ON `content_to_tags` (`tag_id`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `tagsSlugIdx` ON `tags` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `nameIdx` ON `tags` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `githubIdIdx` ON `users` (`github_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `usernameIdx` ON `users` (`username`);