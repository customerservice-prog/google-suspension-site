CREATE TABLE `case_versions` (
	`id` text PRIMARY KEY NOT NULL,
	`case_id` text NOT NULL,
	`user_id` text NOT NULL,
	`data` text NOT NULL,
	`version` integer NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `versions_case_user_idx` ON `case_versions` (`case_id`,`user_id`);