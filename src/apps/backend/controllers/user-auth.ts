import { NextFunction, Request, Response } from "express";

import { getUser } from "../lib/users/get-user";
import { User } from "../lib/users/types";
import { HeaderLocals } from "./parse-headers";

export type AuthLocals = { user: User } & HeaderLocals;

export const checkUserAuth = async (
  req: Request<unknown, unknown, unknown, unknown, { apiKey: string; userId: string }>,
  res: Response<unknown, AuthLocals>,
  next: NextFunction
) => {
  try {


    const userId = res.locals.userId;
    const apiKey = res.locals.apiKey;

    if (typeof userId !== "string" || typeof apiKey !== "string") {
      return res.sendStatus(401);
    }

    const user = await getUser(userId);
    if (!user) {
      return res.sendStatus(401);
    }

    if (user.apiKey !== apiKey) {
      return res.sendStatus(401);
    }

    res.locals.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};
