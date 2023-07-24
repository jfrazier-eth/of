import { Site } from "@/backend/lib/accounts/types";
import { ClientOFDynamicParams } from "@/backend/routes/api/users/:userId/sites/:site/users/:siteUserId/sign/params/types";

import { Context } from "./context";

const getPath = (userId: string, siteUserId: string) => {
  return `/api/users/${userId}/sites/${Site.OF}/users/${siteUserId}/sign/params`;
};

export const getOFDynamicParams = async (context: Context, revision?: string) => {
  if (!context.user) {
    throw new Error("User not logged in");
  }

  const path = getPath(context.user.userId, context.ofAuth?.authId ?? "unknown");
  const searchParams = new URLSearchParams({
    revision: revision ?? "",
  });
  const url = context.getUrl(path, searchParams);
  const headers = context.getHeaders();

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  if (res.status === 200) {
    const body = await res.json();

    return body as ClientOFDynamicParams;
  }

  throw new Error(`Failed to get OF dynamic params, status code ${res.status}`);
};
