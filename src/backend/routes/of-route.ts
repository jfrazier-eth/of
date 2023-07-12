import { Router } from "express";
import { generateResponse } from "../controllers/of-controller.js";
import { isAuthorised } from "../controllers/auth.js";

const router = Router();
router.post("/generateResponse", isAuthorised, generateResponse);

export { router as ofRoute };
