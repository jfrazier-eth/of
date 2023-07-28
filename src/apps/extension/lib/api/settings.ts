import { Site } from "@/backend/lib/accounts/types";
import { OFSettings } from "@/backend/lib/settings/of/types";
import { ClientOFSettings } from "@/backend/routes/api/users/:userId/sites/:site/users/:siteUserId/settings/types";
import { parseError } from "@/utils/parse-error";
import { err, ok, Result } from "neverthrow";

import { Context } from "./context";

const getPath = (userId: string, siteUserId: string, site: Site) => {
  return `/api/users/${userId}/sites/${site}/users/${siteUserId}/settings`;
};

export async function getOFSettings(context: Context): Promise<Result<OFSettings, Error>> {
  try {
    if (!context.user) {
      return err(new Error("User not logged in"));
    } else if (!context.ofAuth) {
      return err(new Error("Not connected to OF"));
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
    return ok(body as OFSettings);
  } catch (err) {
    return parseError(err);
  }
}

export async function postOFSettings(
  settings: ClientOFSettings,
  context: Context
): Promise<Result<void, Error>> {
  try {


    if (!context.user) {
      return err(new Error("User not logged in"));
    } else if (!context.ofAuth) {
      return err(new Error("Not connected to OF"));
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
      return ok(undefined);
    }
    return err(new Error(`Failed to save settings. Status code: ${response.status}`));
  } catch (err) {
    return parseError(err);
  }
}
