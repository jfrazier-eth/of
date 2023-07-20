import { Router } from "express";

// import { generateResponse } from "../controllers/generate-response";
import { getSettings, postSettings } from "../controllers/settings";

const router: Router = Router();

// router.post("/generateResponse", generateResponse);

//user settings
router.get("/settings", getSettings);
router.post("/settings", postSettings);

export { router as ofRoute };
