import { Router } from "express";

import { checkAdminAuth } from "@/backend/controllers/admin-auth";

import { get } from "./get";
import { post } from "./post";

const router: Router = Router({ mergeParams: true });

router.get("/settings", checkAdminAuth, get);
router.post("/settings", checkAdminAuth, post);

export { router };
