import { OFDynamicParams } from "./of-dynamic-params";
import { createHash } from "crypto";

export const signReq = (
  url: URL,
  time: number,
  dynamicParams: OFDynamicParams,
  authId: string
) => {
  const msg = [dynamicParams.staticParam, time, url.pathname, authId].join(
    "\n"
  );

  const hexHash = createHash("sha1").update(msg).digest("hex");
  const asciiHash = Buffer.from(hexHash, "ascii");

  const checksum = dynamicParams.checksumIndexes.reduce(
    (sum, checksumIndex) => {
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
