import { Router } from "express";
import { generateResponse } from "../controllers/generate-response.js";
import { getSettings, postSettings } from "../controllers/settings.js";

const router = Router();

router.post("/generateResponse", generateResponse);

//user settings
router.get("/settings", getSettings);
router.post("/settings", postSettings);

export { router as ofRoute };
