/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
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
    auto_messaging_enabled: {
      type: "boolean",
      notNull: true,
    },
    spending_threshold: {
      type: "numeric",
      notNull: true,
    },
    sample_script: {
      type: "TEXT",
      notNull: true,
    },
    welcome_message_enabled: {
      type: "boolean",
      notNull: true,
    },
    welcome_message_id: {
      type: "char(16)",
      notNull: true,
    },
    favorite_emojis: {
      type: "TEXT",
      notNull: true,
    },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("of_settings");
}
