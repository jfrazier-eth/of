import { Result } from "neverthrow";

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
  };
}

export type Errors = Error;

export type JobResult = Result<{}, Errors>;
