import { NextFunction, Request, Response } from "express";


export type InternalHeaderLocals = {
  apiKey: string;
}

export const parseInternalHeaders = (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiKey = req.headers["x-api-key"];
    res.locals.apiKey = apiKey || "";
    next();
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
}
