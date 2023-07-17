/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable("users", {
    id: {
      type: "char(16)",
      primaryKey: true,
      unique: true,
    },
    api_key: {
      type: "char(16)",
      unique: true,
    },
    name: {
      type: "TEXT",
      collation: 'pg_catalog."default"',
    },
    username: {
      type: "TEXT",
      collation: 'pg_catalog."default"',
      unique: true,
    },
    firebase_auth_id: {
      type: "TEXT",
      collation: 'pg_catalog."default"',
      unique: true,
    },
    created_at: {
      type: "timestamp",
    },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("users");
}
