import { OFDynamicParams } from "./of-dynamic-params";
import { sha1 } from "./sha1";

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
  dynamicParams: OFDynamicParams,
  authId = "0"
) => {
  let urlPart = url.searchParams.size === 0 ? url.pathname : `${url.pathname}${url.search}`;

  const msg = [dynamicParams.staticParam, time, urlPart, authId].join("\n");

  const hexHash = await sha1(msg);
  // const hexHash = createHash("sha1").update(msg).digest("hex");
  // const asciiHash = new TextDecoder("ascii").decode(uint8Array);

  // const asciiHash = Buffer.from(hexHash, "ascii");
  // const checksum = dynamicParams.checksumIndexes.reduce(
  //   (sum: number, checksumIndex: number): number => {
  //     return sum + asciiHash[checksumIndex];
  //   },
  //   dynamicParams.checksumConstant
  // );
  let encoder = new TextEncoder();
  let asciiHash = encoder.encode(hexHash);

  let checksum = dynamicParams.checksumIndexes.reduce(function (sum, checksumIndex) {
    return sum + asciiHash[checksumIndex];
  }, dynamicParams.checksumConstant);

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
