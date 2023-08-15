import { Router } from "express";

import { parsePromptId } from "@/backend/controllers/parse-prompt-id";

import { router as settingsRouter } from "./settings";

const router: Router = Router({ mergeParams: true });

router.use("/:promptId", parsePromptId, settingsRouter);

export { router };
