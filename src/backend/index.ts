import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import "./db/mongo.js";
import "./db/redis.js";

//models
import { FansModel } from "./models/only-fans/fans.js";

//routes
import { ofRoute } from "./routes/of-route.js";
import { config } from "./config.js";
import { isAuthorised } from "./controllers/auth.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => {
  res.send("Hello world!");
});
app.use("/api/of", isAuthorised, ofRoute);

app.post("/api/auth", (req, res) => {
  console.log(req.body);
  res.status(200);
});

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
