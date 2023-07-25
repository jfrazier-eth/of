import { Router } from "express";

import { checkSiteAuth } from "@/backend/controllers/site-auth";
import { checkUserAuth } from "@/backend/controllers/user-auth";

import { post } from "./post";

const router: Router = Router({ mergeParams: true });

router.use(checkUserAuth, checkSiteAuth);
router.post("/response", post);

export { router };
