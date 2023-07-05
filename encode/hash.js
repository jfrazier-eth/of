import { createHash } from "crypto";

const msg = [
  "LRPoBI6L2rXVyG9PQH9xTWgM6S6M0Au3", // secret
  "1688591724791", // timestamp
  "/api2/v2/labels?offset=0", // path and query
  "342900132", // user id
].join("\n");
const hexHash = createHash("sha1").update(msg).digest("hex");

console.log("889c8943782cde7421e8deb6d3d4f095ac6dea3b" === hexHash);

console.log(hexHash);
