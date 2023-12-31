import { Result, err, ok } from "neverthrow";

import { config } from "@/backend/config";
import { redis } from "@/backend/db/redis";
import { Context } from "@/sites/common";
import { ApiError } from "@/sites/common/errors";
import { parseError } from "@/utils/parse-error";

import { OFDynamicParams } from ".";
import { OFDynamicParamsResponse } from "./types";

export const OF_API_BASE_URL = "https://ofapi.xyz";

const getCachedOFDynamicParams = async (revision: string): Promise<OFDynamicParams | null> => {
  const cachedParams = await redis.get(`of:params:revision:${revision}`);
  try {
    const params = JSON.parse(cachedParams ?? "") as OFDynamicParams;
    return params;
  } catch (err) {
    return null;
  }
};

const setCachedOFDynamicParams = async (params: OFDynamicParams) => {
  await redis.set(`of:params:revision:${params.revision}`, JSON.stringify(params));
  await redis.set(`of:params:revision:active`, JSON.stringify(params));
};

export const getOFDynamicParams = async (
  context: Context,
  version: { revision: "active" | string }
): Promise<OFDynamicParams | null> => {
  try {
    const cachedParams = await getCachedOFDynamicParams(version.revision);

    if (cachedParams) {
      return cachedParams;
    }

    console.log(`CACHE MISS - OF params revision: ${version.revision}`);
    const response = await fetchOFDynamicParams(context);
    if (response.isErr()) {
      console.error(response.error);
      return null;
    }
    const params = response.value;

    if (params.revision !== version.revision) {
      console.warn(`OF params revision mismatch: ${params.revision} !== ${version.revision}`);
    }

    await setCachedOFDynamicParams(params);
    return params;
  } catch (err) {
    console.error("Failed to get OF dynamic params", err);
    return null;
  }
};

// TODO add a mutex
const path = "/rules";
async function fetchOFDynamicParams(context: Context): Promise<Result<OFDynamicParams, ApiError>> {
  const url = new URL(path, OF_API_BASE_URL);
  try {
    const response = await context.client.get<OFDynamicParamsResponse>(url, {
      headers: {
        "api-key": config.ofApi.apiKey,
      },
    });
    if (response.isOk()) {
      const body = response.value.body;
      return ok({
        staticParam: body.static_param,
        start: body.start,
        end: body.end,
        checksumConstant: body.checksum_constant,
        checksumIndexes: body.checksum_indexes,
        appToken: body.app_token,
        revision: body.revision,
        isCurrent: body.is_current,
        newBalance: body.new_balance,
        updatedAt: Date.now(),
      });
    }
    return err(response.error);
  } catch (err) {
    return parseError(err);
  }
}
