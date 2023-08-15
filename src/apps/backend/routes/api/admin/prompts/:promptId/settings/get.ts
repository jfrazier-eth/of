import { AdminAuthResponseWithPromptId, GetRequest } from "@/backend/controllers/types";
import { PromptSettings, getPromptSettings } from "@/backend/lib/prompts/prompt-settings";

export const get = async (
  _req: GetRequest,
  res: AdminAuthResponseWithPromptId<{ settings: PromptSettings }>
) => {
  try {
    const settingsResult = await getPromptSettings(res.locals.promptId);
    if (settingsResult.isErr()) {
      console.error(settingsResult.error);
      return res.sendStatus(500);
    }

    return res.status(200).json({ settings: settingsResult.value });
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};
