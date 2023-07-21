import { Router } from "express";

import { checkUserAuth } from "@/backend/controllers/user-auth";

import { post } from "./post";

const router: Router = Router({ mergeParams: true });

router.post("/response", checkUserAuth, post);

export { router };
