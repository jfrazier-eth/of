import PgPromise from "pg-promise";

import { config } from "../../config";

export const pgp = PgPromise();

export const pg = pgp({
  connectionString: config.pg.connectionUrl,
  keepAlive: true,
  max: 60,
  connectionTimeoutMillis: 10 * 1000,
  query_timeout: 10 * 1000,
  statement_timeout: 60 * 1000,
  allowExitOnIdle: true,
});
