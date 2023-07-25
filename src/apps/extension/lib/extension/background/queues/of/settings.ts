import PQueue from "p-queue";

import { OFSettings } from "@/backend/lib/settings/of/types";
import { Context } from "@/extension/lib/api/context";

import { sendMessage } from "../../../messages/send-message";

export type SettingsCallback = (context: Context, settings: OFSettings) => Promise<void>;

interface Config {
  interval: number;
  callbacks: SettingsCallback[];
  context: Context;
}

export const init = (config: Config) => {
  const queue = new PQueue({ concurrency: 1, intervalCap: 1, interval: config.interval });
  const task = async () => {
    const res = await sendMessage({
      kind: "GET_OF_SETTINGS",
    });

    if (res.data.success) {
      const { settings } = res.data;
      console.log(`Retreived settings`);
      const promises = config.callbacks.map((callback) => callback(config.context, settings));
      try {
        await Promise.all(promises);
      } catch (err) {
        console.error(`Settings callback failed: ${err}`);
      }
    } else {
      console.error("Failed to get settings", res.data.message);
    }
  };

  const add = () => {
    queue.add(task).catch((err) => {
      console.error("Settings queue failed", err);
    });
  };
  const interval = setInterval(() => {
    if (queue.size > 5) {
      return;
    }

    add();
  }, config.interval);

  add();

  const stop = () => {
    if (interval) {
      clearInterval(interval);
    }
    queue.pause();
    queue.clear();
  };

  return {
    stop,
  };
};
