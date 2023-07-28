/* eslint-disable @typescript-eslint/naming-convention */
import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;
export async function up(pgm: MigrationBuilder) {
  pgm.createTable("of_settings", {
    user_id: {
      type: "char(16)",
      notNull: true,
    },
    site_user_id: {
      type: "TEXT",
      collation: 'pg_catalog."default"',
      notNull: true,
      primaryKey: true,
      unique: true,
    },
    created_at: {
      type: "timestamp",
      notNull: true,
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
    },
    generative_messaging_script: {
      type: "TEXT",
      collation: 'pg_catalog."default"',
      notNull: true,
    },
    generative_messaging_emojis: {
      type: "TEXT",
      collation: 'pg_catalog."default"',
      notNull: true,
    },
    auto_messaging_enabled: {
      type: "boolean",
      notNull: true,
    },
    auto_messaging_spending_threshold: {
      type: "numeric",
      notNull: true,
    },
    primary_ppv_media_id: {
      type: "char(16)",
    },
    primary_ppv_price: {
      type: "numeric",
      notNull: true,
    },
    secondary_ppv_media_id: {
      type: "char(16)",
    },
    secondary_ppv_price: {
      type: "numeric",
      notNull: true,
    },
    welcome_enabled: {
      type: "boolean",
      notNull: true,
    },
    welcome_message: {
      type: "TEXT",
      collation: 'pg_catalog."default"',
      notNull: true,
    },
    welcome_price: {
      type: "numeric",
      notNull: true,
    },
    welcome_media_id: {
      type: "char(16)",
    },
  });
}

export async function down(pgm: MigrationBuilder) {
  pgm.dropTable("of_settings");
}
