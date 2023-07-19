import { ClientOptions } from "./types";

export const mergeOptions = <T extends ClientOptions, U extends ClientOptions>(a: T, b: U) => {
  return {
    ...a,
    ...b,
  };
};
