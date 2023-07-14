import { Router } from "express";
import { generateResponse } from "../controllers/of-controller.js";

const router = Router();
router.post("/generateResponse", generateResponse);

export { router as ofRoute };
