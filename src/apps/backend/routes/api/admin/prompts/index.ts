import { Router } from "express";

import { checkAdminAuth } from "@/backend/controllers/admin-auth";

import { router as promptRouter } from "./:promptId";
import { get } from "./get";
import { post } from "./post";

const router: Router = Router({ mergeParams: true });

router.use("/prompts", promptRouter);
router.get("/prompts", checkAdminAuth, get);
router.post("/prompts", checkAdminAuth, post);

export { router };
