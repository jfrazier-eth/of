import { NextFunction, Request, Response } from "express";
import { config } from "../config.js";

const isAuthorised = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");

  if (!token || token !== config.server.apiKey) {
    console.log("Unauthorized request");
    return res.status(401).json({ message: "Unauthorized request" });
  }
  next();
};

export { isAuthorised };
