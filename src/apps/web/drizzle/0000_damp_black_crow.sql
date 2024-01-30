CREATE TABLE `user_daily_progress` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`event` enum('github_commit','leetcode_submission') NOT NULL,
	`date` date DEFAULT (CURDATE()),
	`amount` int NOT NULL,
	CONSTRAINT `user_daily_progress_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_id_date_event_idx` UNIQUE(`user_id`,`date`,`event`)
);
--> statement-breakpoint
CREATE TABLE `user_profiles` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`current_streak` int DEFAULT 0,
	`last_consumed_event_date` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `user_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_profiles_user_id_unique` UNIQUE(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`email` varchar(256) NOT NULL,
	`user_name` varchar(256) NOT NULL,
	`github_id` varchar(256) NOT NULL,
	`github_access_token` varchar(256),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`),
	CONSTRAINT `users_user_name_unique` UNIQUE(`user_name`),
	CONSTRAINT `users_github_id_unique` UNIQUE(`github_id`)
);
