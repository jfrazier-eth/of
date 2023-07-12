import { NextFunction, Request, Response } from "express";

const isAuthorised = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");

  if (!token || token !== process.env.client_auth) {
    console.log("Unauthorized request");
    return res.status(401).json({ message: "Unauthorized request" });
  }
  next();
};

export { isAuthorised };
