import { ResultAsync } from "neverthrow";

import { redis } from "./db";
import { RedisError } from "./types";

export const redisSet = (key: string, value: string) => {
  return ResultAsync.fromPromise(redis.set(key, value), (err) => {
    return new RedisError(err);
  });
};

export const redisGet = (key: string) => {
  return ResultAsync.fromPromise(redis.get(key), (err) => {
    return new RedisError(err);
  });
};
