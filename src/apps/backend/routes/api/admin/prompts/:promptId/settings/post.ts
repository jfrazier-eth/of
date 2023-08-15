import { AdminAuthResponseWithPromptId, PostRequest } from "@/backend/controllers/types";
import { savePromptSettings } from "@/backend/lib/prompts/prompt-settings";

import { PostPromptSettingsRequestBody } from "./types";

export const post = async (
  req: PostRequest<PostPromptSettingsRequestBody>,
  res: AdminAuthResponseWithPromptId<{}>
) => {
  try {
    const settings = req.body.settings;
    if (!settings) {
      return res.sendStatus(400);
    }

    const result = await savePromptSettings(settings);
    if (result.isErr()) {
      console.error(result.error);
      return res.json({ error: result.error.message }).status(500);
    }

    return res.sendStatus(200);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};
