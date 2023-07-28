import { app } from "./app";
import { config } from "./config";
import "./db/redis";
import { start as startQueues } from "./queues";

import { setAdapter } from "@/sites/common/client";
import { adapter as gotAdapter } from "@/sites/common/client/got-adapter";
setAdapter(gotAdapter);

if (app) {
  app.set('trust proxy', true);
  app.listen(config.server.port, () => {
    console.log(`Server listening on port ${config.server.port}`);
  });
}
startQueues();
