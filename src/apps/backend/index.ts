import cors from "cors";
import express, { NextFunction, Request, Response } from "express";

import { config } from "./config";
import { checkUserAuth } from "./controllers/user-auth";
import "./db/mongo";
import "./db/redis";
import { router as apiRouter } from "./routes/api";
import { router as login } from "./routes/api/login";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", apiRouter);

app.use((_req, res, _next) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Updating the server. Will be up soon!" });
});

app.listen(config.server.port, () => {
  console.log(`Server listening on port ${config.server.port}`);
});
