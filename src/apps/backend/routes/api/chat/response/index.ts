import { Router } from "express";

import { checkUserAuth } from "@/backend/controllers/user-auth";

import { post } from "./post";

const router: Router = Router({ mergeParams: true });

router.use(checkUserAuth);
router.post("/response", post);

export { router };
