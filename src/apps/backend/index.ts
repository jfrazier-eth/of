import { app } from "./app";
import { config } from "./config";
import "./db/mongo";
import "./db/redis";

app.listen(config.server.port, () => {
  console.log(`Server listening on port ${config.server.port}`);
});
