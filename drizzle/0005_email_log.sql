CREATE TABLE `email_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`flow` enum('leads','applications') NOT NULL,
	`kind` enum('notification','acknowledgement','test') NOT NULL DEFAULT 'notification',
	`status` enum('sent','failed','skipped') NOT NULL,
	`recipients` varchar(500) NOT NULL DEFAULT '',
	`subject` varchar(255) NOT NULL DEFAULT '',
	`detail` varchar(500) NOT NULL DEFAULT '',
	`duration_ms` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `email_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `email_log_created_at_idx` ON `email_log` (`created_at`);