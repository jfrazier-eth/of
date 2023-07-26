import { Result } from "neverthrow";

import { OFLogin } from "@/backend/lib/logins/of-logins/types";
import { OFSettings } from "@/backend/lib/settings/of/types";
import { RedisError } from "@/backend/db/redis";

export interface JobData {
  settings: OFSettings;
  login: OFLogin;
  chat: {
    withUser: {
      id: string;
      username: string;
      name: string;
    };
  };
}

export type Errors = Error | RedisError;

export type JobResult = Result<{ sent: true, id: string } | { sent: false, reason: string }, Errors>;
