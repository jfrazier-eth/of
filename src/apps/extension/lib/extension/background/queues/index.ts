import { Context } from "@/extension/lib/api/context";
import { sleep } from "@/utils/sleep";

import { worker as ofWorker } from "./of";

export const registerQueues = async (context: Context) => {
  console.log(`Waiting for context to be ready...`);
  await context.isReady;

  while (true) {
    try {
      console.log(`Context is ready`);
      const res = ofWorker(context, { interval: 60_000 });

      if (res.isErr()) {
        console.error(`Failed to register auto messaging`, res.error);
      } else {
        console.log(`Registered auto messaging`);
        return;
      }
    } catch (err) {
      console.error(err);
    }
    await sleep(30_000);
  }
};
