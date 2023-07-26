import { errors } from "pg-promise";

export type PGError =
  | errors.QueryResultError
  | errors.QueryFileError
  | errors.PreparedStatementError
  | errors.ParameterizedQueryError;
