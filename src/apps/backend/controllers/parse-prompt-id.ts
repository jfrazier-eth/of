import { NextFunction, Request, Response } from "express";

export const parsePromptId: (
  req: Request<{
    promptId: string;
  }>,
  res: Response<unknown, { promptId: string }>,
  next: NextFunction
) => void = (req, res, next) => {
  try {
    const promptId = req.params.promptId;
    res.locals.promptId = promptId;
    next();
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};
