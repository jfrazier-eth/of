/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;
export async function up(pgm: MigrationBuilder) {
  pgm.createTable("of_welcome_messages", {
    id: {
      type: "char(16)",
      primaryKey: true,
      unique: true,
      notNull: true,
    },
    user_id: {
      type: "char(16)",
      notNull: true,
    },
    site_user_id: {
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
    image: {
      type: "TEXT",
      notNull: true,
    },
    script: {
      type: "TEXT",
      notNull: true,
    },
    price: {
      type: "numeric",
      notNull: true,
    },
  });
}

export async function down(pgm: MigrationBuilder) {
  pgm.dropTable("of_welcome_messages");
}
