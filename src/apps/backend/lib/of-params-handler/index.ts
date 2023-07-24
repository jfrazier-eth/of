import { Context } from "@/sites/common";
import { OF_BASE_URL } from "@/sites/of";
import { ParamsHandler } from "@/sites/of/params-handler";
import { getOFDynamicParams } from "@/sites/of/utils/of-api-dynamic-params";

export const serverOFParamsHandler: ParamsHandler = {
  getParams: async () => {
    const context = new Context({
      baseUrl: OF_BASE_URL,
    });
    return await getOFDynamicParams(context, { revision: "active" });
  },
};
