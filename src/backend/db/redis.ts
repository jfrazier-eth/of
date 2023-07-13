import { Redis } from "ioredis";
import { config } from "../config.js";

export const redis = new Redis(config.redis.connectionUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  lazyConnect: true,
});

redis
  .connect()
  .then(() => {
    console.log("Redis connected");
  })
  .catch((err) => {
    console.error("Redis failed to connect", err);
    redis.disconnect();
    process.exit(1);
  });

redis.on("error", (err) => {
  console.error(err);
});
