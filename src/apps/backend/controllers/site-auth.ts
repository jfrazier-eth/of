import { NextFunction, Request } from "express";

import { getLogin } from "../lib/logins/get-login";
import { UserSiteAuthResponse } from "./types";

export const checkSiteAuth = async (
  req: Request,
  res: UserSiteAuthResponse<unknown>,
  next: NextFunction
) => {
  if (res.locals.userIdParam !== res.locals.userId) {
    return res.sendStatus(400);
  }

  try {
    const login = await getLogin({
      site: res.locals.site,
      siteUserId: res.locals.siteUserId,
      userId: res.locals.userId,
    });

    if (!login) {
      return res.sendStatus(404);
    }

    res.locals.siteLogin = login;
    next();
  } catch (err) {
    console.error(`Unexpected error while authenticating login`, err);
    return res.sendStatus(500);
  }
};
