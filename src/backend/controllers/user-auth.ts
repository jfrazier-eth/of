import { Request, Response, NextFunction } from "express";
import { getUser } from "../lib/users/get-user.js";

export const checkUserAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const apiKey = req.headers["x-api-key"];
  const userId = req.headers["x-user-id"];

  if (typeof userId !== "string" || typeof apiKey !== "string") {
    res.status(401).json({ message: "Unauthorized request - invalid headers" });
    return;
  }

  const user = await getUser(userId);
  if (!user) {
    res.status(401).json({ message: "Unauthorized request" });
    return;
  }

  if (user.apiKey !== apiKey) {
    res.status(401).json({ messageL: "Unauthorized request" });
    return;
  }

  next();
};
