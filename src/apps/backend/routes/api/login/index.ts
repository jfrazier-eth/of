import { Router } from "express";

import { post } from "./post";

const router: Router = Router({
  mergeParams: true,
});

router.post("/login", post);

export { router };
