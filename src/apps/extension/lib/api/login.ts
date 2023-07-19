import { Context } from "./context";

export const postLogin = async (token: string, context: Context): Promise<{ apiKey: string; userId: string }> => {
  const url = context.getUrl("/api/login");

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...context.getHeaders(),
    },
    body: JSON.stringify({ token: token }),
  });

  if (response.status === 200) {
    const body = await response.json();
    const apiKey = body.apiKey;
    const userId = body.userId;

    if (!apiKey || !userId) {
      throw new Error("Login failed");
    }

    return { apiKey, userId };
  }

  throw new Error("Login failed");
};
