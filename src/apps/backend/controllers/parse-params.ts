import { NextFunction, Request, Response } from "express";

import { Site } from "../lib/accounts/types";
import { SiteParamLocals } from "./types";

export const parseParams: (
  req: Request<{
    userId: string;
    site: Site;
    siteUserId: string;
  }>,
  res: Response<unknown, SiteParamLocals<Site>>,
  next: NextFunction
) => void = (req, res, next) => {
  const userIdParam = req.params.userId;
  const site = req.params.site;
  const siteUserId = req.params.siteUserId;

  res.locals.userIdParam = userIdParam;
  res.locals.site = site;
  res.locals.siteUserId = siteUserId;
  next();
};
