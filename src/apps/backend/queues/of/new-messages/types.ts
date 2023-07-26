import { Result } from "neverthrow";

import { PGError } from "@/backend/db/postgres";
import { OFSettings } from "@/backend/lib/settings/of/types";
import { NotFoundError } from "@/utils/errors";

export interface JobData {
  settings: OFSettings;
}

export type Errors = PGError | NotFoundError;

export type JobResult = Result<
  {
    numChatsTriggered: number;
  },
  Errors
>;
