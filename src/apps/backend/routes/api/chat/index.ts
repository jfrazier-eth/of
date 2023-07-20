import { Router } from "express";

import { router as responseRouter } from "./response";

const router: Router = Router();

router.use(responseRouter);

export { router };
