import { Queue, Worker } from "bullmq";
import { redis } from "../db/redis";
import { pg } from "../db/postgres";
import { PGOFSettings } from "../lib/settings/of/types";
import * as Lib from "../lib/index";
import { ONE_MIN } from "@/utils/constants";

interface DataType {
  timestamp: number;
}

interface ResultType {
  numUsersTriggered: number;
}

interface ProcessingDataType {
  userId: string;
  siteUserId: string;
  welcomeMessageId: string;
}

interface ProcessingResultType {}

/**
 * this queue is responsible for retrieving the users who have enabled welcome messaging
 * and triggering processing for them
 */
export const triggerQueueName = "of-welcome-messaging-trigger";
export const processingQueueName = "of-welcome-messaging-processing";

const triggerQueue = new Queue<DataType, ResultType>(triggerQueueName, {
  connection: redis.duplicate(),
});

const processingQueue = new Queue<ProcessingDataType, ProcessingResultType>(
  processingQueueName,
  {
    connection: redis.duplicate(),
  }
);

const triggerWorker = new Worker<DataType, ResultType>(
  triggerQueueName,
  async (job) => {
    if (job.timestamp < Date.now() - 5 * ONE_MIN) {
      return {
        numUsersTriggered: 0,
      };
    }
    type ResponseType = Pick<
      PGOFSettings,
      | "user_id"
      | "site_user_id"
      | "welcome_message_id"
      | "welcome_message_enabled"
    >;
    const query =
      "SELECT (user_id, site_user_id, welcome_message_id, welcome_message_enabled) FROM of_settings WHERE welcome_message_enabled = true";
    const result = await pg.query<ResponseType[]>(query);

    let numUsersTriggered = 0;
    for (const userSettings of result) {
      const user = {
        userId: userSettings.user_id,
        siteUserId: userSettings.site_user_id,
        welcomeMessageId: userSettings.welcome_message_id,
      };

      numUsersTriggered += 1;
      const timestamp = Date.now();
      await processingQueue.add(`${user.userId}-${timestamp}`, {
        userId: user.userId,
        siteUserId: user.siteUserId,
        welcomeMessageId: user.welcomeMessageId,
      });
    }

    return {
      numUsersTriggered,
    };
  },
  { connection: redis.duplicate() }
);

const processingWorker = new Worker<ProcessingDataType, ProcessingResultType>(
  processingQueueName,
  async (job) => {
    const welcomeMessage = await Lib.Settings.OF.WelcomeMessages.getMessage(
      job.data.welcomeMessageId
    );

    if (!welcomeMessage) {
      console.warn(
        "No welcome message found for id",
        job.data.welcomeMessageId
      );
      return {};
    }

    // check subscribers

    // for any new subscribers
    // check if they have an existing chat
    // if not send the welcome message

    return {};
  },
  {
    connection: redis.duplicate(),
  }
);

export const sendWelcomeMessages = async () => {
  const timestamp = Date.now();
  await triggerQueue.add(`${timestamp}`, {
    timestamp,
  });
};
