import { Router } from "express";

import { parseAdminHeaders } from "@/backend/controllers/parse-admin-headers";

import { router as loginRouter } from "./login";
import { router as promptsRouter } from "./prompts";

const router: Router = Router({ mergeParams: true });

router.use("/admin", parseAdminHeaders, loginRouter, promptsRouter);

export { router };
