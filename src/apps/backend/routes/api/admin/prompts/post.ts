import { AdminAuthResponse, PostRequest } from "@/backend/controllers/types";
import { savePrompt } from "@/backend/lib/prompts/save-prompt";

import { PostPromptRequestBody } from "./types";

export const post = async (req: PostRequest<PostPromptRequestBody>, res: AdminAuthResponse<{}>) => {
  try {
    const prompt = req.body.prompt;

    if (!prompt) {
      return res.sendStatus(400);
    }

    const result = await savePrompt(prompt);

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
