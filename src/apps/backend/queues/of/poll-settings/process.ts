import { Processor } from "bullmq";
import { ok } from "neverthrow";

import { getUsersWithAutoMessagingEnabled } from "@/backend/lib/settings/of/get-settings";
import { ONE_MIN } from "@/utils/constants";

import { OFNewMessagesQueue } from "..";
import { JobData, JobResult } from "./types";

export const processJob: Processor<JobData, JobResult> = async (job) => {
  let numTriggered = 0;

  if (job.timestamp < Date.now() - ONE_MIN * 5) {
    return ok({
      skipped: true,
      reason: "Job too old",
    });
  }

  for await (const user of getUsersWithAutoMessagingEnabled()) {
    if (user.isErr()) {
      console.error(`Failed to get user settings`, user.error);
      continue;
    }

    const settings = user.value.settings;
    if (
      settings.settings.autoMessaging.enabled &&
      settings.settings.autoMessaging.spendingThreshold > 0
    ) {
      await OFNewMessagesQueue.add({
        settings,
      });
      numTriggered += 1;
    }
  }

  return ok({
    numTriggered,
  });
};
