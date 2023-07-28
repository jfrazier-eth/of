export class RedisError extends Error {
  constructor(internalError: any) {
    if (internalError instanceof Error) {
      super(internalError.message);
    } else if (typeof internalError === "string") {
      super(internalError);
    } else {
      super(`REDIS ERROR: ${internalError}`);
    }
  }
}
