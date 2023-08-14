import { config as loadEnv } from "dotenv";
import { ServiceAccount } from "firebase-admin";
import { readFileSync } from "fs";
import { join } from "path";

let serviceAccount: ServiceAccount;

const loadServiceAccount = (path: string) => {
  console.log(`Loading service account from ${path}`);
  const data = readFileSync(path, "utf-8");
  try {
    return JSON.parse(data as string) as ServiceAccount;
  } catch (e) {
    throw new Error(`Failed to load service account`);
  }
};

if (process.env.DEPLOY_ENV === "prod") {
  serviceAccount = loadServiceAccount("/etc/secrets/firebase-prod.json");
  loadEnv({ path: ".env.production", override: true });

  switch (process.env.OF_APP) {
    case "QUEUES":
      loadEnv({ path: ".env.queues", override: true });
      break;
    case "SERVER":
      loadEnv({ path: ".env.server", override: true });
      break;
  }
  console.log(`Loaded prod env`);
} else {
  const path = join(__dirname, "../../creds/firebase-prod.json");
  serviceAccount = loadServiceAccount(path);
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
  admin: {
    password: getEnvVariable("ADMIN_PASSWORD"),
  },
  redis: {
    connectionUrl: getEnvVariable("REDIS_URL"),
  },
  server: {
    enabled: Boolean(Number(getEnvVariable("API_ENABLED"))),
    port: Number(getOptionalEnvVariable("PORT", "8888")),
    apiKey: getEnvVariable("API_KEY"),
    apiUrl: getEnvVariable("API_URL"),
  },
  openAI: {
    apiKey: getEnvVariable("OPEN_AI_API_KEY"),
  },
  pg: {
    connectionUrl: getEnvVariable("DATABASE_URL"),
  },
  firebase: {
    serviceAccount: serviceAccount,
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
