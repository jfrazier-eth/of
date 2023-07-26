import { Result } from "neverthrow";

export interface JobData {}

export type JobResult = Result<{ numTriggered: number }, never>;
