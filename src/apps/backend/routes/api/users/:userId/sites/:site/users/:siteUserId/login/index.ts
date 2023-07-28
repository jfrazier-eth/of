import { Router } from "express";

import { checkSiteAuth } from "@/backend/controllers/site-auth";
import { checkUserAuth } from "@/backend/controllers/user-auth";

import { get } from "./get";
import { post } from "./post";

const router: Router = Router({ mergeParams: true });
router.use(checkUserAuth);

router.get("/login", checkSiteAuth, get);

/**
 * post does not require checkSiteAuth
 */
router.post("/login", post);

export { router };
