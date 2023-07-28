import { NextFunction, Request } from "express";

import { getLogin } from "../lib/logins/get-login";
import { UserSiteAuthResponse } from "./types";

export const checkSiteAuth = async (
  req: Request,
  res: UserSiteAuthResponse<unknown>,
  next: NextFunction
) => {
  try {
    if (res.locals.userIdParam !== res.locals.userId) {
      return res.sendStatus(400);
    }

    try {
      const login = await getLogin({
        site: res.locals.site,
        siteUserId: res.locals.siteUserId,
        userId: res.locals.userId,
      });
      if (login.isErr()) {
        return res.sendStatus(500);
      }

      if (!login.value) {
        return res.sendStatus(404);
      }

      res.locals.siteLogin = login.value;
      next();
    } catch (err) {
      console.error(`Unexpected error while authenticating login`, err);
      return res.sendStatus(500);
    }
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};
