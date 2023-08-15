import { Router } from "express";

import { checkAdminAuth } from "@/backend/controllers/admin-auth";

import { post } from "./post";

const router: Router = Router({ mergeParams: true });

router.post("/login", checkAdminAuth, post);

export { router };
