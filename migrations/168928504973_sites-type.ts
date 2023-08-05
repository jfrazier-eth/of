/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createType("site_t", ["of"]);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropType("site_t");
}
