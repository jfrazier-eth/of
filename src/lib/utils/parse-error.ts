import { Err, err } from "neverthrow";

export const parseError = <T = unknown>(error: unknown): Err<T, Error> => {
  if (error instanceof Error) {
    return err(error);
  } else if (typeof error === "string") {
    return err(new Error(error));
  } else {
    return err(new Error(`Unknown error: ${error}`));
  }
};
