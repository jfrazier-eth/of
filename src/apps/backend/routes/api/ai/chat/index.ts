import { Router } from "express";

import { checkInternalApiAuth } from "@/backend/controllers/internal-api-auth";
import { parseInternalHeaders } from "@/backend/controllers/parse-internal-headers";

import { post } from "./post";

const router: Router = Router({ mergeParams: true });

router.post("/chat", parseInternalHeaders, checkInternalApiAuth, post);

export { router };
