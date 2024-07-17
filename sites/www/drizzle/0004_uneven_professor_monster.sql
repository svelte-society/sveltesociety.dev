DROP INDEX IF EXISTS `userContentIdx`;--> statement-breakpoint
DROP INDEX IF EXISTS `userCollectionIdx`;--> statement-breakpoint
ALTER TABLE `collections` ADD `likes` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `content` ADD `likes` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `userContentLikeIdx` ON `likes` (`user_id`,`content_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `userCollectionLikeIdx` ON `likes` (`user_id`,`collection_id`);