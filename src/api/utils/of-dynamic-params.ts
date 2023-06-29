import { Context } from "../context";
import {
  RequestError,
  UnexpectedStatusCodeError,
} from "../errors/request-errors";
import phin from "phin";

export const OF_RULES_EP =
  "https://raw.githubusercontent.com/deviint/onlyfans-dynamic-rules/main/dynamicRules.json";

export interface OFDynamicParamsResponse {
  static_param: string;
  start: string;
  end: string;
  checksum_constant: number;
  checksum_indexes: number[];
  app_token: string;
  remove_headers: string[];
  revision: string;
  is_current: boolean;
}

export interface OFDynamicParams {
  staticParam: string;
  start: string;
  end: string;
  checksumConstant: number;
  checksumIndexes: number[];
  appToken: string;
  removeHeaders: string[];
  revision: string;
  isCurrent: boolean;
}

export async function getOFDynamicParams(
  context: Context
): Promise<OFDynamicParams> {
  const url = new URL(OF_RULES_EP);
  try {
    const response = await phin({
      url,
      method: "GET",
    });

    if (response.statusCode === 200) {
      const body = JSON.parse(
        response.body.toString()
      ) as OFDynamicParamsResponse;
      return {
        staticParam: body.static_param,
        start: body.start,
        end: body.end,
        checksumConstant: body.checksum_constant,
        checksumIndexes: body.checksum_indexes,
        appToken: body.app_token,
        removeHeaders: body.remove_headers,
        revision: body.revision,
        isCurrent: body.is_current,
      };
    }
    throw new UnexpectedStatusCodeError(url, context, response.statusCode);
  } catch (err) {
    throw RequestError.create(err, url, context);
  }
}
