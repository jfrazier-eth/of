import mongoose from "mongoose";

const uri = process.env.db_url;

if (!uri) {
  throw new Error("db_url not found");
}

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connection = mongoose.createConnection(
  uri,
  options as unknown as mongoose.ConnectOptions // TODO it looks like useNewUrlParser and useUnifiedTopology are not in the mongoose.ConnectOptions type
);

connection.once("open", () => {
  console.log("Connected to OF Database Successfully");
});
connection.on("error", (err) => {
  console.log("error connecting to of");
  console.log(err);
});

export { connection };
