import { Context } from "./context.js";

const path = "/api/of/settings";

export async function getSettings(context: Context) {
  if (!context.user) {
    throw new Error("User not logged in");
  }

  const url = context.getUrl(
    path,
    new URLSearchParams({ userId: context.user.userId })
  );
  const headers = context.getHeaders();
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
  return response.json();
}

//authenticate before posting
export async function postSettings(settings: any, context: Context) {
  const url = context.getUrl(path);
  const headers = context.getHeaders();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(settings),
  });
  return response.json();
}