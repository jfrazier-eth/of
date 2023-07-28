import { Router } from "express";

import { checkUserAuth } from "@/backend/controllers/user-auth";

import { get } from "./get";

const router: Router = Router({ mergeParams: true });
router.use(checkUserAuth);

/**
 * does not require check site auth
 */
router.get("/params", get);

export { router };
