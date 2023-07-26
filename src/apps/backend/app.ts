import cors from "cors";
import express, { Express, NextFunction, Request, Response } from "express";
import { config } from "./config";
import { parseHeaders } from "./controllers/parse-headers";
import { router as apiRouter } from "./routes/api";

const startApp = () => {
  if (config.server.enabled) {

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
    return app;
  }
}

const app = startApp();
export { app };
