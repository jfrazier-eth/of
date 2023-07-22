/* eslint-disable @typescript-eslint/naming-convention */
import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder) {
  pgm.createType("media_t", ["photo", "video", "gif", "audio"]);

  pgm.createTable("user_media", {
    id: {
      type: "char(16)",
      unique: true,
      notNull: true,
      primaryKey: true,
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
    type: {
      type: "media_t",
      notNull: true,
    },
    square_preview: {
      type: "TEXT",
      collation: 'pg_catalog."default"',
      notNull: true,
    },
    source: {
      type: "TEXT",
      collation: 'pg_catalog."default"',
      notNull: true,
    },
    media_created_at: {
      type: "timestamp",
      notNull: true,
    },
    site_media_id: {
      type: "TEXT",
      collation: 'pg_catalog."default"',
      notNull: true,
    },
  });
}

export async function down(pgm: MigrationBuilder) {
  pgm.dropTable("of_ppvs");
}
