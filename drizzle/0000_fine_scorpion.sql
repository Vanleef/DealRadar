CREATE TABLE `price_alerts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`game_id` integer NOT NULL,
	`target_price_cents` integer,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`email`) REFERENCES `profiles`(`email`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`email` text PRIMARY KEY NOT NULL,
	`display_name` text DEFAULT 'Jogador' NOT NULL,
	`currency` text DEFAULT 'BRL' NOT NULL,
	`language` text DEFAULT 'pt-BR' NOT NULL,
	`deal_alerts` integer DEFAULT true NOT NULL,
	`two_factor_enabled` integer DEFAULT false NOT NULL,
	`steam_id` text,
	`xbox_id` text,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `saved_games` (
	`email` text NOT NULL,
	`game_id` integer NOT NULL,
	`state` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY(`email`, `game_id`, `state`),
	FOREIGN KEY (`email`) REFERENCES `profiles`(`email`) ON UPDATE no action ON DELETE cascade
);
