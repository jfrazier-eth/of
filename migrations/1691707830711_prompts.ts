/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable("prompts", {
    id: {
      type: "char(16)",
      primaryKey: true,
      unique: true,
      notNull: true,
    },
    created_at: {
      type: "timestamp",
      notNull: true,
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
    },
    version: {
      type: "integer",
      notNull: true,
    }
  })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("prompts")
}
