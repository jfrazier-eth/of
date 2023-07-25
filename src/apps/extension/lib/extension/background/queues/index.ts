import { Context } from "@/extension/lib/api/context";

import { autoMessaging } from "./of";

export const registerQueues = async (context: Context) => {
  console.log(`Waiting for context to be ready...`);
  await context.isReady;

  console.log(`Context is ready`);
  const res = autoMessaging(context, { interval: 60_000 });

  if (res.isErr()) {
    console.error(`Failed to register auto messaging`, res.error);
  } else {
    console.log(`Registered auto messaging`);
  }
};
