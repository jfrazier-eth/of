import { NextFunction, Request, Response } from "express";

import { config } from "../config";
import { InternalHeaderLocals } from "./parse-internal-headers";

export type InternalAuthLocals = InternalHeaderLocals;

export const checkInternalApiAuth = (
  _req: Request,
  res: Response<unknown, InternalHeaderLocals>,
  next: NextFunction
) => {
  try {
    const apiKey = res.locals.apiKey;

    if (apiKey === config.admin.password) {
      return next();
    }

    if (apiKey !== config.server.apiKey) {
      return res.sendStatus(401);
    }

    next();
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};
