/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {

  pgm.createTable("active_prompt", {
    id: {
      type: "TEXT",
      collation: 'pg_catalog."default"',
      primaryKey: true,
      unique: true,
      notNull: true,
    },
    prompt_id: {
      type: "char(16)",
      notNull: true,
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
    },
    created_at: {
      type: "timestamp",
      notNull: true,
    }
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("active_prompt");
}
