import { Router } from "express";

import { router as chatRouter } from "./chat";
import { router as loginRouter } from "./login/index";
import { router as usersRouter } from "./users";

const router: Router = Router({ mergeParams: true });

router.use("/api", chatRouter, usersRouter, loginRouter);

export { router };
