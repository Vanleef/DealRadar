import { sql } from "drizzle-orm";
import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const profiles = sqliteTable("profiles", {
  email: text("email").primaryKey(),
  displayName: text("display_name").notNull().default("Jogador"),
  currency: text("currency").notNull().default("BRL"),
  language: text("language").notNull().default("pt-BR"),
  dealAlerts: integer("deal_alerts", { mode: "boolean" }).notNull().default(true),
  twoFactorEnabled: integer("two_factor_enabled", { mode: "boolean" }).notNull().default(false),
  steamId: text("steam_id"),
  xboxId: text("xbox_id"),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const savedGames = sqliteTable("saved_games", {
  email: text("email").notNull().references(() => profiles.email, { onDelete: "cascade" }),
  gameId: integer("game_id").notNull(),
  state: text("state", { enum: ["favorite", "interested"] }).notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, table => [primaryKey({ columns: [table.email, table.gameId, table.state] })]);

export const priceAlerts = sqliteTable("price_alerts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().references(() => profiles.email, { onDelete: "cascade" }),
  gameId: integer("game_id").notNull(),
  targetPriceCents: integer("target_price_cents"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
