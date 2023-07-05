import { OFDynamicParams } from "./of-dynamic-params.js";
import { createHash } from "crypto";

/**
 * Encodes the OF `sign` header for a request.
 *
 * Based on:
 * https://github.com/deviint/onlyfans-dynamic-rules
 * https://github.com/datawhores/OF-Scraper/blob/main/ofscraper/utils/auth.py
 */

export const signReq = (
  url: URL,
  time: number,
  dynamicParams: OFDynamicParams,
  authId = "0"
) => {
  const msg = [dynamicParams.staticParam, time, url.pathname, authId].join(
    "\n"
  );

  /**
   * The hex hash is currently different from the browser
   * It could be due to incorrect dynamic params
   */
  const hexHash = createHash("sha1").update(msg).digest("hex");
  const asciiHash = Buffer.from(hexHash, "ascii");

  const checksum = dynamicParams.checksumIndexes.reduce(
    (sum: number, checksumIndex: number) => {
      return sum + asciiHash[checksumIndex];
    },
    dynamicParams.checksumConstant
  );

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
