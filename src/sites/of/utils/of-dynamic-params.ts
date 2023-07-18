import { Context } from "@/sites/common/context.js";
import {
  RequestError,
  UnexpectedStatusCodeError,
} from "@/sites/common/errors/request-errors.js";

export const OF_RULES_EP =
  "https://raw.githubusercontent.com/deviint/onlyfans-dynamic-rules/main/dynamicRules.json";

export const OF_RULES_TTS = 5 * 60_000;

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

let ofDynamicParams: { value: OFDynamicParams; updatedAt: number } | null =
  null;

export async function getOFDynamicParams(
  context: Context
): Promise<OFDynamicParams> {
  if (
    !ofDynamicParams ||
    ofDynamicParams.updatedAt < Date.now() - OF_RULES_TTS
  ) {
    const params = await fetchOFDynamicParams(context);
    ofDynamicParams = {
      value: params,
      updatedAt: Date.now(),
    };
  }

  return ofDynamicParams.value;
}

export async function fetchOFDynamicParams(
  context: Context
): Promise<OFDynamicParams> {
  const url = new URL(OF_RULES_EP);
  try {
    const response = await context.client.get<OFDynamicParamsResponse>(url);

    if (response.status === 200) {
      const body = response.body;
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
    throw new UnexpectedStatusCodeError(url, context, response.status);
  } catch (err) {
    throw RequestError.create(err, url, context);
  }
}
