CREATE TABLE `request_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `cases` ADD `paid_until` text;--> statement-breakpoint
ALTER TABLE `payments` ADD `intent` text;--> statement-breakpoint
ALTER TABLE `payments` ADD `expires` text;