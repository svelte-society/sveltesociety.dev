DROP INDEX IF EXISTS `titleIdx`;--> statement-breakpoint
CREATE INDEX `tag_id_idx` ON `content_to_tags` (`tag_id`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE INDEX `titleIdx` ON `content` (`title`);