CREATE TABLE `appointments` (
	`id` text PRIMARY KEY NOT NULL,
	`request_id` text NOT NULL,
	`reference` text NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`service` text NOT NULL,
	`preferred_date` text NOT NULL,
	`preferred_time` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` integer NOT NULL,
	`consent_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `appointments_request_id_unique` ON `appointments` (`request_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `appointments_reference_unique` ON `appointments` (`reference`);--> statement-breakpoint
CREATE INDEX `appointments_phone_created_idx` ON `appointments` (`phone`,`created_at`);