import sha1 from "sha1";

import { ClientOFDynamicParams } from "@/backend/routes/api/users/:userId/sites/:site/users/:siteUserId/sign/params/types";

/**
 * Encodes the OF `sign` header for a request.
 *
 * Based on:
 * https://github.com/deviint/onlyfans-dynamic-rules
 * https://github.com/datawhores/OF-Scraper/blob/main/ofscraper/utils/auth.py
 */
export const signReq = async (
  url: URL,
  time: number,
  dynamicParams: ClientOFDynamicParams,
  authId = "0"
) => {
  let urlPart = url.searchParams.size === 0 ? url.pathname : `${url.pathname}${url.search}`;

  const msg = [dynamicParams.staticParam, time, urlPart, authId].join("\n");

  const hexHash = await sha1(msg);
  let encoder = new TextEncoder();
  let asciiHash = encoder.encode(hexHash);

  let checksum = dynamicParams.checksumIndexes.reduce(function (
    sum: number,
    checksumIndex: number
  ) {
    return sum + asciiHash[checksumIndex];
  },
  dynamicParams.checksumConstant);

  const sign = [
    dynamicParams.start,
    hexHash,
    Math.abs(checksum).toString(16),
    dynamicParams.end,
  ].join(":");

  return {
    sign,
  };
};
