import { createHash } from "crypto";

import { OFDynamicParams } from "./of-dynamic-params";

/**
 * Encodes the OF `sign` header for a request.
 *n
 * Based on:
 * https://github.com/deviint/onlyfans-dynamic-rules
 * https://github.com/datawhores/OF-Scraper/blob/main/ofscraper/utils/auth.py
 */
export const signReq = (url: URL, time: number, dynamicParams: OFDynamicParams, authId = "0") => {
  let urlPart = url.searchParams.size === 0 ? url.pathname : `${url.pathname}${url.search}`;

  const msg = [dynamicParams.staticParam, time, urlPart, authId].join("\n");

  const hexHash = createHash("sha1").update(msg).digest("hex");
  const asciiHash = Buffer.from(hexHash, "ascii");

  const checksum = dynamicParams.checksumIndexes.reduce((sum: number, checksumIndex: number) => {
    return sum + asciiHash[checksumIndex];
  }, dynamicParams.checksumConstant);

  const sign = [dynamicParams.start, hexHash, Math.abs(checksum).toString(16), dynamicParams.end].join(":");

  return {
    sign,
  };
};
