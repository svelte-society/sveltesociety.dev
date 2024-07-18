CREATE TABLE `saves` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`target_id` text NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `collections` ADD `saves` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `content` ADD `saves` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `userTargetSaveIdx` ON `saves` (`user_id`,`target_id`);