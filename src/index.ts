import { brave } from "./browser";
import { LoggedInContext } from "./context";
import * as Routes from "./routes";

async function main() {
  const baseUrl = "https://onlyfans.com";

  const xbc = process.env.XBC;
  if (!xbc) {
    throw new Error("XBC env variable was not set");
  }
  const loggedInContext = new LoggedInContext(baseUrl, brave, {
    xbc,
  });

  await Routes.Home.get(loggedInContext);
  await Routes.V2.Init.get(loggedInContext);
}

void main();
