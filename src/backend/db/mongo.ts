import { config } from "../config.js";
import mongoose from "mongoose";

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connection = mongoose.createConnection(
  config.mongo.connectionUrl,
  options as unknown as mongoose.ConnectOptions // TODO it looks like useNewUrlParser and useUnifiedTopology are not in the mongoose.ConnectOptions type
);

connection.once("open", () => {
  console.log("Connected to Mongo!");
});
connection.on("error", (err) => {
  console.error(`MongoDB Error`, err);
});

export { connection };
