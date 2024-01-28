CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`full_name` text,
	`phone` varchar(256),
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
