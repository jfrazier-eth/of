import { Router } from "express";

import { parseParams } from "@/backend/controllers/parse-params";

import { router as loginRouter } from "./:userId/sites/:site/users/:siteUserId/login";
import { router as settingsRouter } from "./:userId/sites/:site/users/:siteUserId/settings";
import { router as signRouter } from "./:userId/sites/:site/users/:siteUserId/sign";

const router: Router = Router({ mergeParams: true });

const path = "/users/:userId/sites/:site/users/:siteUserId";
router.use(path, parseParams, loginRouter);
router.use(path, parseParams, settingsRouter);
router.use(path, parseParams, signRouter);

export { router };
