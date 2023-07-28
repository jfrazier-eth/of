import { Err, err } from "neverthrow";

import { RequestError, UnexpectedStatusCodeError } from "./request-errors";

export const parseError = <T = unknown>(
  error: unknown
): Err<T, UnexpectedStatusCodeError | RequestError | Error> => {
  if (error instanceof UnexpectedStatusCodeError) {
    return err(error);
  } else if (error instanceof RequestError) {
    return err(error);
  } else if (error instanceof Error) {
    return err(error);
  } else if (typeof error === "string") {
    return err(new Error(error));
  } else {
    return err(new Error(`Unknown error: ${error}`));
  }
};
