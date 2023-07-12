import express, { NextFunction, Request, Response } from "express";
import cors from "cors";

//models
import { FansModel } from "./models/only-fans/fans.js";

//routes
import { ofRoute } from "./routes/of-route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => res.send("Hello World!"));
app.use("/api/of", ofRoute);

app.options("/api/v1/of/auth", (req, res) => {
  console.log(`Save auth!`, req.body);
  res.status(200);
});
app.post("/api/v1/of/auth", (req, res) => {
  console.log(req.body);
  res.status(200);
});

//error handling
app.use((_req, res, _next) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Updating the server. Will be up soon!" });
});

app.listen(7777, () => {
  console.log("Server listening on port 7777");
});
