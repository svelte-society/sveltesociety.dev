CREATE TABLE `content_to_tags` (
	`content_id` integer NOT NULL,
	`tag_id` integer NOT NULL,
	FOREIGN KEY (`content_id`) REFERENCES `content`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE no action
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
CREATE UNIQUE INDEX `contentTagIdx` ON `content_to_tags` (`content_id`,`tag_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `slugIdx` ON `tags` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `nameIdx` ON `tags` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `titleIdx` ON `content` (`title`);--> statement-breakpoint
CREATE UNIQUE INDEX `typeIdx` ON `content` (`type`);--> statement-breakpoint
CREATE UNIQUE INDEX `usernameIdx` ON `users` (`username`);