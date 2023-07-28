import { Result, ResultAsync } from "neverthrow";
import { QueryParam } from "pg-promise";

import { PGError, pg } from ".";

export const pgQuery = async <RowType = any>(
  query: QueryParam,
  values?: any
): Promise<Result<RowType[], PGError>> => {
  const rowsResult = await ResultAsync.fromPromise(pg.query(query, values), (e) => {
    return e as PGError;
  });

  return rowsResult;
};

export const pgQueryOne = async <RowType = any>(
  query: QueryParam,
  values?: any
): Promise<Result<RowType, PGError>> => {
  const one = await ResultAsync.fromPromise(pg.one(query, values), (e) => {
    return e as PGError;
  });

  return one;
};

export const pgQueryOneOrNone = async <RowType = any>(
  query: QueryParam,
  values?: any
): Promise<Result<RowType | null, PGError>> => {
  return await ResultAsync.fromPromise(pg.oneOrNone<RowType>(query, values), (e) => {
    return e as PGError;
  });
};
