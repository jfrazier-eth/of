import { MetricsTime, Queue, Worker } from "bullmq";

import { redis } from "@/backend/db/redis";

import { processJob } from "./process";
import { JobData, JobResult } from "./types";

export const queueName = "OF_POLL_SETTINGS";

export const queue = new Queue<JobData, JobResult>(queueName, {
  connection: redis.duplicate(),
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: { count: 1000, age: 24 * 3600 },
    attempts: 1,
  },
});

export const add = async () => {
  return await queue.add("default", {});
};

export const startWorker = (concurrency: number) => {
  const worker = new Worker<JobData, JobResult>(queueName, processJob, {
    metrics: {
      maxDataPoints: MetricsTime.ONE_WEEK * 2,
    },
    concurrency,
    connection: redis.duplicate(),
  });

  worker.on("active", (job) => {
    console.log(`${queue.name} job ${job.id} active`);
  });

  worker.on("completed", (job) => {
    console.log(
      `${queue.name} job ${job.id} completed. Result: ${JSON.stringify(job.returnvalue, null, 2)}`
    );
  });

  worker.on("error", (e) => {
    console.error(`${queue.name} worker error`, e);
  });

  worker.on("failed", (job, err) => {
    console.warn(`${queue.name} job ${job?.id} failed. Reason: ${err.message}`);
  });

  return { worker };
};
