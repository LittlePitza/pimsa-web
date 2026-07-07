CREATE TABLE `admin_users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(190) NOT NULL,
	`name` varchar(120) NOT NULL,
	`password_hash` varchar(100) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`last_login_at` timestamp,
	CONSTRAINT `admin_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `admin_users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `application_files` (
	`id` int AUTO_INCREMENT NOT NULL,
	`application_id` int NOT NULL,
	`file_name` varchar(255) NOT NULL,
	`mime_type` varchar(100) NOT NULL,
	`size` int NOT NULL,
	`data` longblob NOT NULL,
	CONSTRAINT `application_files_id` PRIMARY KEY(`id`),
	CONSTRAINT `application_files_application_id_unique` UNIQUE(`application_id`)
);
--> statement-breakpoint
CREATE TABLE `applications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`vacancy_id` int,
	`vacancy_title` varchar(160) NOT NULL DEFAULT '',
	`name` varchar(120) NOT NULL,
	`email` varchar(200) NOT NULL,
	`phone` varchar(30) NOT NULL DEFAULT '',
	`message` text NOT NULL,
	`status` enum('new','reviewing','finalist','hired','rejected') NOT NULL DEFAULT 'new',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `applications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`company` varchar(120) NOT NULL DEFAULT '',
	`email` varchar(200) NOT NULL,
	`phone` varchar(30) NOT NULL DEFAULT '',
	`service` varchar(120) NOT NULL DEFAULT '',
	`message` text NOT NULL,
	`utm` json,
	`ip` varchar(64) NOT NULL DEFAULT '',
	`status` enum('new','contacted','closed') NOT NULL DEFAULT 'new',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vacancies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(160) NOT NULL,
	`title` varchar(160) NOT NULL,
	`department` varchar(120) NOT NULL DEFAULT '',
	`location` varchar(160) NOT NULL DEFAULT 'Apaseo el Grande, Guanajuato',
	`employment_type` varchar(60) NOT NULL DEFAULT 'Tiempo completo',
	`summary` varchar(500) NOT NULL DEFAULT '',
	`description` text NOT NULL,
	`requirements` json NOT NULL,
	`benefits` json NOT NULL,
	`salary_range` varchar(120),
	`status` enum('draft','open','closed') NOT NULL DEFAULT 'draft',
	`published_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vacancies_id` PRIMARY KEY(`id`),
	CONSTRAINT `vacancies_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
ALTER TABLE `application_files` ADD CONSTRAINT `application_files_application_id_applications_id_fk` FOREIGN KEY (`application_id`) REFERENCES `applications`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `applications` ADD CONSTRAINT `applications_vacancy_id_vacancies_id_fk` FOREIGN KEY (`vacancy_id`) REFERENCES `vacancies`(`id`) ON DELETE set null ON UPDATE no action;