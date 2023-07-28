import { GetRequest, UserAuthResponseWithUnsafeParams } from "@/backend/controllers/types";
import { Site } from "@/backend/lib/accounts";
import { Context } from "@/sites/common";
import { OF_BASE_URL } from "@/sites/of";
import { OFDynamicParams } from "@/sites/of/utils";
import { getOFDynamicParams } from "@/sites/of/utils/of-api-dynamic-params";

import { ClientOFDynamicParams, GetOFDynamicParamsQueryParams } from "./types";

export const transformOFDynamicParams = (params: OFDynamicParams): ClientOFDynamicParams => {
  return {
    staticParam: params.staticParam,
    start: params.start,
    end: params.end,
    checksumConstant: params.checksumConstant,
    checksumIndexes: params.checksumIndexes,
    revision: params.revision,
    appToken: params.appToken,
  };
};

export const get = async (
  req: GetRequest<GetOFDynamicParamsQueryParams>,
  res: UserAuthResponseWithUnsafeParams<ClientOFDynamicParams>
) => {
  try {


    const site = res.locals.site;

    switch (site) {
      case Site.OF: {
        try {
          const revision = req.query.revision || "active";
          const context = new Context({
            baseUrl: OF_BASE_URL,
          });
          const params = await getOFDynamicParams(context, { revision });
          if (!params) {
            return res.sendStatus(500);
          }
          const clientParams = transformOFDynamicParams(params);
          return res.status(200).json(clientParams);
        } catch (err) {
          return res.sendStatus(500);
        }
      }

      default: {
        return res.sendStatus(400);
      }
    }
  } catch (err) {
    return res.sendStatus(500);
  }
};
