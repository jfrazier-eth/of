import { NextFunction, Request, Response } from "express";

export type HeaderLocals = {
  apiKey: string;
  userId: string;
};

export const parseHeaders = (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiKey = req.headers["x-api-key"];
    const userId = req.headers["x-user-id"];
    res.locals.apiKey = apiKey || "";
    res.locals.userId = userId || "";
    next();
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};
