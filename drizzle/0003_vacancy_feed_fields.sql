ALTER TABLE `vacancies` ADD `city` varchar(120) DEFAULT 'Apaseo el Grande' NOT NULL;--> statement-breakpoint
ALTER TABLE `vacancies` ADD `region` varchar(120) DEFAULT 'Guanajuato' NOT NULL;--> statement-breakpoint
ALTER TABLE `vacancies` ADD `postal_code` varchar(12) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `vacancies` ADD `work_mode` enum('onsite','hybrid','remote') DEFAULT 'onsite' NOT NULL;--> statement-breakpoint
ALTER TABLE `vacancies` ADD `salary_min` int;--> statement-breakpoint
ALTER TABLE `vacancies` ADD `salary_max` int;--> statement-breakpoint
ALTER TABLE `vacancies` ADD `salary_period` enum('HOUR','DAY','WEEK','MONTH','YEAR') DEFAULT 'MONTH' NOT NULL;--> statement-breakpoint
ALTER TABLE `vacancies` ADD `openings` int DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `vacancies` ADD `expires_at` timestamp;--> statement-breakpoint
UPDATE `vacancies` SET `city` = TRIM(SUBSTRING_INDEX(`location`, ',', 1)), `region` = CASE WHEN `location` LIKE '%,%' THEN TRIM(SUBSTRING_INDEX(`location`, ',', -1)) ELSE 'Guanajuato' END WHERE TRIM(`location`) <> '';--> statement-breakpoint
UPDATE `vacancies` SET `employment_type` = CASE WHEN `employment_type` LIKE '%medio tiempo%' OR `employment_type` LIKE '%parcial%' THEN 'PART_TIME' WHEN `employment_type` LIKE '%honorarios%' OR `employment_type` LIKE '%contrato%' THEN 'CONTRACTOR' WHEN `employment_type` LIKE '%temporal%' OR `employment_type` LIKE '%eventual%' THEN 'TEMPORARY' WHEN `employment_type` LIKE '%practica%' OR `employment_type` LIKE '%becari%' THEN 'INTERN' ELSE 'FULL_TIME' END;--> statement-breakpoint
ALTER TABLE `vacancies` MODIFY COLUMN `employment_type` enum('FULL_TIME','PART_TIME','CONTRACTOR','TEMPORARY','INTERN') NOT NULL DEFAULT 'FULL_TIME';
