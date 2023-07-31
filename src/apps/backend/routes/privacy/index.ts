import { Router, Request, Response } from "express";

import { readFile } from "fs/promises";
import { join } from "path";

const router: Router = Router();

let privacy: string;
router.get('/privacy', async (req: Request, res: Response) => {
  if (!privacy) {
    try {
      const privacyFile = join(process.cwd(), "static/privacy.html");
      console.log(`Reading ${privacyFile}`);
      privacy = await readFile(privacyFile, 'utf8');
    } catch (err) {
      console.error(err);
      return res.sendStatus(500);
    }
  }

  return res.status(200).send(privacy);
});

export { router };
