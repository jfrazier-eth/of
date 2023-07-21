import { Router } from "express";

import { checkUserAuth } from "@/backend/controllers/user-auth";

import { get } from "./get";
import { post } from "./post";

const router: Router = Router({ mergeParams: true });
router.use(checkUserAuth);

router.get("/", get);
router.post("/", post);

export { router };
