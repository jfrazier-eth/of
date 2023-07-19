import cors from "cors";
import express, { NextFunction, Request, Response } from "express";

import { config } from "./config";
import { checkUserAuth } from "./controllers/user-auth";
import "./db/mongo";
import "./db/redis";
import { router as siteLoginRouter } from "./routes/api/auth";
import { router as login } from "./routes/api/login";
//routes
import { ofRoute } from "./routes/of-route";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => {
  res.send("Hello world!");
});
app.use("/api/login", login);
app.use("/api/of", checkUserAuth, ofRoute);
// app.use(siteLoginRouter);

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
