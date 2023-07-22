import { Site } from "@/backend/lib/accounts/types";
import { OFSettings } from "@/backend/lib/settings/of/types";
import { ClientOFSettings } from "@/backend/routes/api/users/:userId/sites/:site/users/:siteUserId/settings/types";

import { Context } from "./context";

const getPath = (userId: string, siteUserId: string, site: Site) => {
  return `/api/users/${userId}/sites/${site}/users/${siteUserId}/settings`;
};

export async function getOFSettings(context: Context): Promise<OFSettings> {
  if (!context.user) {
    throw new Error("User not logged in");
  } else if (!context.ofAuth) {
    throw new Error("Not connected to OF");
  }

  const path = getPath(context.user.userId, context.ofAuth.authId, Site.OF);

  const url = context.getUrl(path);
  const headers = context.getHeaders();
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  const body = await response.json();
  return body as OFSettings;
}

export async function postOFSettings(
  settings: ClientOFSettings,
  context: Context
): Promise<{ success: true } | { success: false; error: string }> {
  if (!context.user) {
    throw new Error("User not logged in");
  } else if (!context.ofAuth) {
    throw new Error("Not connected to OF");
  }

  const path = getPath(context.user.userId, context.ofAuth.authId, Site.OF);
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
