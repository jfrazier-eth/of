/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable("of_logins", {
    xbc: {
      type: "TEXT",
      collation: 'pg_catalog."default"',
      notNull: true,
    },
    sess: {
      type: "TEXT",
      collation: 'pg_catalog."default"',
      notNull: true,
    },
    auth_uid: {
      type: "TEXT",
      collation: 'pg_catalog."default"',
    },
    user_agent: {
      type: "TEXT",
      collation: 'pg_catalog."default"',
      notNull: true,
    },
    site_user_id: {
      type: "TEXT",
      collation: 'pg_catalog."default"',
      notNull: true,
    },
    user_id: {
      type: "char(16)",
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

  pgm.createConstraint(
    "of_logins",
    "of_logins_pkey",
    "PRIMARY KEY (user_id, site_user_id)"
  );
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("of_logins");
  pgm.dropConstraint("of_logins", "of_logins_pkey");
}
