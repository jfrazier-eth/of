import { NextFunction, Request } from "express";

import { config } from "../config";
import { AdminAuthResponse } from "./types";

export const checkAdminAuth = async (
  req: Request,
  res: AdminAuthResponse<unknown>,
  next: NextFunction
) => {
  try {
    if (!res.locals.adminApiKey) {
      return res.sendStatus(401);
    } else if (res.locals.adminApiKey !== config.admin.password) {
      return res.sendStatus(401);
    }
    next();
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};
