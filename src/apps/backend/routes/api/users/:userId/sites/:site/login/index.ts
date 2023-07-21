import { Router } from "express";

import { checkUserAuth } from "@/backend/controllers/user-auth";

import { get } from "./get";
import { post } from "./post";

const router: Router = Router({ mergeParams: true });
router.use(checkUserAuth);

router.get("/login", get);
router.post("/login", post);

export { router };
