/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable("prompt_settings", {
    prompt_id: {
      type: "char(16)",
      notNull: true,
      primaryKey: true,
      unique: true
    },
    model: {
      type: "TEXT",
      collation: 'pg_catalog."default"',
      notNull: true,
    },
    temperature: {
      type: "real",
      notNull: true,
    },
    top_p: {
      type: "real",
      notNull: true,
    },
    max_tokens: {
      type: "integer",
      notNull: true,
    },
    presence_penalty: {
      type: "real",
      notNull: true,
    },
    frequency_penalty: {
      type: "real",
      notNull: true,
    },
    created_at: {
      type: "timestamp",
      notNull: true,
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
    }
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("prompt_settings")
}
