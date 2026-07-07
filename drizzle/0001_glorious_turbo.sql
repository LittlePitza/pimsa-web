CREATE TABLE `settings` (
	`key` varchar(100) NOT NULL,
	`value` text NOT NULL,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `settings_key` PRIMARY KEY(`key`)
);
--> statement-breakpoint
CREATE TABLE `stock_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`material` varchar(120) NOT NULL,
	`form` enum('Molido','Pellet','Original') NOT NULL,
	`color` varchar(60) NOT NULL DEFAULT '',
	`availability` enum('Disponible','Bajo pedido','Consultar') NOT NULL DEFAULT 'Consultar',
	`notes` varchar(300) NOT NULL DEFAULT '',
	`published` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `stock_items_id` PRIMARY KEY(`id`)
);
