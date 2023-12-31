import { Router } from "express";

import { router as adminRouter } from "./admin";
import { router as aiRouter } from "./ai";
import { router as loginRouter } from "./login/index";
import { router as usersRouter } from "./users";
import { router as chatRouter } from "./users/:userId/sites/:site/users/:siteUserId/chat";

const router: Router = Router({ mergeParams: true });

router.use("/api", adminRouter, chatRouter, usersRouter, loginRouter, aiRouter);

export { router };
