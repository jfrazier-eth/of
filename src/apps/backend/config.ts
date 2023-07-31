import { config as loadEnv } from "dotenv";
import { ServiceAccount } from "firebase-admin";

import prodServiceAccount from "../../creds/firebase-prod.json";

if (process.env.DEPLOY_ENV === "prod") {
  loadEnv({ path: ".env.production", override: true });
  console.log(`Loaded prod env`);
}

const getEnvVariable = (key: string) => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

const getOptionalEnvVariable = (key: string, defaultValue: string) => {
  return process.env[key] || defaultValue;
};

export const config = {
  redis: {
    connectionUrl: getEnvVariable("REDIS_URL"),
  },
  server: {
    enabled: Boolean(Number(getEnvVariable("API_ENABLED"))),
    port: Number(getOptionalEnvVariable("PORT", "8888")),
    apiKey: getEnvVariable("API_KEY"),
    apiUrl: getEnvVariable("API_URL")
  },
  openAI: {
    apiKey: getEnvVariable("OPEN_AI_API_KEY"),
  },
  pg: {
    connectionUrl: getEnvVariable("DATABASE_URL"),
  },
  firebase: {
    serviceAccount: prodServiceAccount as ServiceAccount,
  },
  ofApi: {
    apiKey: getEnvVariable("OF_API_API_KEY"),
  },
  queues: {
    of: {
      newMessages: {
        enabled: Boolean(Number(getEnvVariable("OF_NEW_MESSAGE_QUEUE"))),
        concurrency: Number(getEnvVariable("OF_NEW_MESSAGE_CONCURRENCY")),
      },
      pollSettings: {
        enabled: Boolean(Number(getEnvVariable("OF_POLL_SETTINGS_QUEUE"))),
        concurrency: Number(getEnvVariable("OF_POLL_SETTINGS_CONCURRENCY")),
        schedule: getEnvVariable("OF_POLL_SETTINGS_SCHEDULE"),
      },
      respond: {
        enabled: Boolean(Number(getEnvVariable("OF_RESPOND_QUEUE"))),
        concurrency: Number(getEnvVariable("OF_RESPOND_CONCURRENCY")),
      },
    },
  },
};
