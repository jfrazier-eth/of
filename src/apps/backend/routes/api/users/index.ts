import { Router } from "express";

import { router as loginRouter } from "./:userId/sites/:site/login";
import { router as settingsRouter } from "./:userId/sites/:site/settings";

const router: Router = Router({ mergeParams: true });

router.use("/users/:userId/sites/:site", loginRouter);
router.use("/users/:userId/sites/:site", settingsRouter);

export { router };
