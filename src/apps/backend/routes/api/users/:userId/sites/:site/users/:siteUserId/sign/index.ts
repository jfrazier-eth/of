import { Router } from "express";

import { router as paramsRouter } from "./params";

const router: Router = Router({ mergeParams: true });

router.use("/sign", paramsRouter);

export { router };
