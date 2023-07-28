import { err, ok } from "neverthrow";

import { SessionContext } from "@/sites/of/context";
import { parseError } from "@/utils/parse-error";

import { VaultMediaItem } from "./types";

const path = `/api2/v2/vault/media`;

const getHeaders = (userId: string) => {
  return {
    Host: "onlyfans.com",
    "User-Id": userId,
    Accept: "application/json, text/plain, */*",
    Referer: "https://onlyfans.com/my/vault/list/all",
    "Accept-Encoding": "gzip, deflate",
  };
};

export interface GetVaultMediaOptions {
  offset?: number;
}

export interface GetVaultMediaResponseBody {
  list: VaultMediaItem[];
  hasMore: boolean;
}

export const defaultPageSize = 24;

export const get = async (context: SessionContext, options: GetVaultMediaOptions) => {
  try {
    const searchParams = new URLSearchParams({
      limit: `${defaultPageSize}`,
      sort: "desc",
      list: "all",
      field: "recent",
      offset: `${options.offset}` || "0",
    });

    const url = context.getUrl(path, searchParams);

    const contextHeaders = await context.getHeaders(url);
    const reqHeaders = {
      ...getHeaders(context.userId),
      ...contextHeaders,
    };

    const response = await context.client.get<GetVaultMediaResponseBody>(url, {
      headers: reqHeaders,
    });

    if (response.isOk()) {
      return ok(response.value.body);
    }

    return err(response.error);
  } catch (err) {
    return parseError(err);
  }
};

export type { VaultMediaItem, VaultListState } from "./types";
