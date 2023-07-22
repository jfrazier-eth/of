import { Router } from "express";

import { parseParams } from "@/backend/controllers/parse-params";

import { router as loginRouter } from "./:userId/sites/:site/users/:siteUserId/login";
import { router as settingsRouter } from "./:userId/sites/:site/users/:siteUserId/settings";

const router: Router = Router({ mergeParams: true });

router.use("/users/:userId/sites/:site/users/:siteUserId", parseParams, loginRouter);
router.use("/users/:userId/sites/:site/users/:siteUserId", parseParams, settingsRouter);

export { router };
