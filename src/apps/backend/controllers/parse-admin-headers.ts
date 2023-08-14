import { NextFunction, Request, Response } from "express";

export type AdminAuthLocals = {
  adminApiKey: string;
};

export const parseAdminHeaders = (req: Request, res: Response, next: NextFunction) => {
  try {
    const adminApiKey = req.headers["x-admin-api-key"];
    res.locals.adminApiKey = adminApiKey || "";
    next();
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};
