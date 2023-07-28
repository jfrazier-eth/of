import { schedule } from "node-cron";

import { config } from "../config";
import { OFNewMessagesQueue, OFPollSettingsQueue, OFRespondQueue } from "./of";

export const start = () => {
  const pollSettings = config.queues.of.pollSettings;
  const newMessages = config.queues.of.newMessages;
  const respond = config.queues.of.respond;
  if (pollSettings.enabled) {
    OFPollSettingsQueue.startWorker(pollSettings.concurrency);
    schedule(pollSettings.schedule, async () => {
      try {
        await OFPollSettingsQueue.add();
      } catch (err) {
        console.error(`Failed to add item to OF settings queue`, err);
      }
    });
    OFPollSettingsQueue.add().catch((err) => {
      console.error(`Failed to add item to OF settings queue`, err);
    });
  }

  if (newMessages.enabled) {
    OFNewMessagesQueue.startWorker(newMessages.concurrency);
  }

  if (respond.enabled) {
    OFRespondQueue.startWorker(respond.concurrency);
  }
};
