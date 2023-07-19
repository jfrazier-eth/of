import { UserOFSettings } from "../extension/messages/responses";
import { Context } from "./context";

const path = "/api/of/settings";

export async function getSettings(context: Context) {
  if (!context.user) {
    throw new Error("User not logged in");
  }

  const url = context.getUrl(path, new URLSearchParams({ userId: context.user.userId }));
  const headers = context.getHeaders();
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  const body = await response.json();
  return body as UserOFSettings;
}

export async function postSettings(
  settings: any,
  context: Context
): Promise<{ success: true } | { success: false; error: string }> {
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
  if (response.status === 200) {
    return {
      success: true,
    };
  }
  return {
    success: false,
    error: `Failed to save settings. Status code: ${response.status}`,
  };
}
