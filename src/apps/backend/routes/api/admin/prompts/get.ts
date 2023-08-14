import { AdminAuthResponse, GetRequest } from "@/backend/controllers/types";
import { getPrompts } from "@/backend/lib/prompts/get-prompts";

import { GetPromptsResponseBody } from "./types";

export const get = async (_req: GetRequest, res: AdminAuthResponse<GetPromptsResponseBody>) => {
  try {
    const prompts = await getPrompts();

    if (prompts.isErr()) {
      console.error(prompts.error);
      return res.sendStatus(500);
    }

    return res.status(200).json({
      prompts: prompts.value,
    });
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};
