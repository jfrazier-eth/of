import { Result } from "neverthrow";

import { RedisError } from "@/backend/db/redis";
import { OFLogin } from "@/backend/lib/logins/of-logins/types";
import { OFSettings } from "@/backend/lib/settings/of/types";

export interface JobData {
  settings: OFSettings;
  login: OFLogin;
  chat: {
    withUser: {
      id: string;
      username: string;
      name: string;
    };
    lastMessageId: string | null;
  };
}

export type Errors = Error | RedisError;

export type JobResult = Result<
  { sent: true; id: string } | { sent: false; reason: string },
  Errors
>;
