/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable("accounts", {
    user_id: {
      type: "char(16)",
      notNull: true,
    },
    site: {
      type: "site_t",
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
  });

  pgm.addConstraint(
    "accounts",
    "accounts_pkey",
    "PRIMARY KEY (user_id, site_user_id, site)"
  );
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("accounts");
  pgm.dropConstraint("accounts", "accounts_pkey");
}
