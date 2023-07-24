import { ServiceAccount } from "firebase-admin";

import prodServiceAccount from "../../creds/firebase-prod.json";

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
  mongo: {
    connectionUrl: getEnvVariable("MONGO_URL"),
  },
  server: {
    port: Number(getOptionalEnvVariable("PORT", "7777")),
    apiKey: getEnvVariable("API_KEY"),
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
};
