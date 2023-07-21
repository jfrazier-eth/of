import { Router } from "express";

import { router as loginRouter } from "./:userId/sites/:site/login";

const router: Router = Router({ mergeParams: true });

router.use("/:userId/sites/:site", loginRouter);

export { router };
