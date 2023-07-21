import { Site } from "@/backend/lib/accounts/types";

import { Auth } from "../auth/types";
import { Context } from "./context";

const getPath = (userId: string) => {
  return `/api/users/${userId}/sites/${Site.OF}/login`;
};

export async function postAuth(context: Context, auth: Auth) {
  try {
    const userId = context.user?.userId;

    if (!userId) {
      throw new Error("Missing user id");
    }
    const path = getPath(userId);
    const url = context.getUrl(path);

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...context.getHeaders(),
      },
      body: JSON.stringify({
        params: auth,
      }),
    });

    if (response.status === 200) {
      return;
    }
    throw new Error("Failed to save auth");
  } catch (err) {
    console.error(err);
    throw new Error("Failed to save auth");
  }
}
