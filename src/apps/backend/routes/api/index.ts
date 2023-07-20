import { Router } from "express";

import { router as chatRouter } from "./chat";

const router: Router = Router();

router.use(chatRouter);

export { router };
