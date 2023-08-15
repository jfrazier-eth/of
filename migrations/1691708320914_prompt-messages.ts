/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createType("prompt_role_t", ["user", "system", 'assistant']);
  pgm.createTable("prompt_messages", {
    id: {
      type: "char(16)",
      primaryKey: true,
      unique: true,
      notNull: true,
    },
    prompt_id: {
      type: "char(16)",
      notNull: true,
    },
    role: {
      type: "prompt_role_t",
      notNull: true,
    },
    message_index: {
      type: "integer",
      notNull: true,
    },
    message: {
      type: "TEXT",
      collation: 'pg_catalog."default"',
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
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("prompt_messages")
  pgm.dropType("prompt_role_t")
}
