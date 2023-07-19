import { Auth } from "../auth/types";
import { Context } from "./context";

const path = "/api/of/auth";

export async function postAuth(context: Context, auth: Auth) {
  try {
    const url = context.getUrl(path);

    console.log(url.toString());
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...context.getHeaders(),
      },
      body: JSON.stringify(auth),
    });

    if (response.status === 200) {
      return;
    }
    console.error(`Received status code ${response.status}`);
    throw new Error("Failed to save auth");
  } catch (err) {
    console.error(err);
    throw new Error("Failed to save auth");
  }
}
