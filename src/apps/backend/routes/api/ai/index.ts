import { Router } from "express";
import { router as chatRouter } from "./chat";

const router: Router = Router({ mergeParams: true });

router.use('/ai', chatRouter);

export { router };
