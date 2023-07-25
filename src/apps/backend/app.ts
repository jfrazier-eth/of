import cors from "cors";
import express, { Express, NextFunction, Request, Response } from "express";

import { parseHeaders } from "./controllers/parse-headers";
import { router as apiRouter } from "./routes/api";

const app: Express = express();
app.use(cors());
app.use(express.json());

app.use("/", parseHeaders, apiRouter);

app.use((_req, res, _next) => {
  console.log(`Not found ${_req.url}`);
  res.sendStatus(404);
});

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Updating the server. Will be up soon!" });
});

export { app };
