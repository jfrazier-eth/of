import { Router } from "express";

import { router as responseRouter } from "./response";

const router: Router = Router({ mergeParams: true });

router.use("/chat", responseRouter);

export { router };
