import { ClientOFDynamicParams } from "@/backend/routes/api/users/:userId/sites/:site/users/:siteUserId/sign/params/types";
import { Context } from "@/extension/lib/api/context";
import { getOFDynamicParams } from "@/extension/lib/api/get-of-dynamic-params";

import { GetOFDynamicParamsMessage, UpdateOFRevisionMessage } from "../../messages";
import { Storage } from "../../storage";
import { Handler } from "./types";

const updateOFParams = async (
  context: Context,
  revision?: string
): Promise<ClientOFDynamicParams> => {
  const params = await getOFDynamicParams(context, revision);
  context.ofParams.params = params;
  await setCachedOFDynamicParams(params);

  return params;
};

export const handleUpdateOFRevisionMessage: Handler<UpdateOFRevisionMessage> = async (
  message,
  context
) => {
  const currRev = message.data.revision;
  const prevRevision = context.ofParams.params?.revision;

  if (prevRevision === currRev) {
    return {
      kind: "UPDATE_OF_REVISION",
      data: { success: true, revision: currRev },
    };
  }
  try {
    const params = await updateOFParams(context, currRev);
    return {
      kind: "UPDATE_OF_REVISION",
      data: { revision: params.revision, success: true },
    };
  } catch (err) {
    return {
      kind: "UPDATE_OF_REVISION",
      data: {
        success: false,
        message: "Failed to update revision",
      },
    };
  }
};

const getCachedOFDynamicParams = async () => {
  const key = "of-dynamic-params";
  const params = await Storage.getObject<ClientOFDynamicParams>(key);
  return params;
};

const setCachedOFDynamicParams = async (params: ClientOFDynamicParams) => {
  const key = "of-dynamic-params";
  await Storage.set({
    [key]: params,
  });
};

export const handleGetOFDynamicParamsMessage: Handler<GetOFDynamicParamsMessage> = async (
  message,
  context
) => {
  const cachedDynamicParams = await getCachedOFDynamicParams();

  if (cachedDynamicParams) {
    console.log(`Found cached dynamic params!`, cachedDynamicParams);
    return {
      kind: "GET_OF_DYNAMIC_PARAMS",
      data: {
        success: true,
        params: cachedDynamicParams,
      },
    };
  }

  try {
    const res = await updateOFParams(context);
    console.log(`Updated dynamic params!`, res);
    return {
      kind: "GET_OF_DYNAMIC_PARAMS",
      data: {
        success: true,
        params: res,
      },
    };
  } catch (err) {
    console.error(`Failed to get OF dynamic params`, err);
    return {
      kind: "GET_OF_DYNAMIC_PARAMS",
      data: {
        success: false,
        message: "Failed to get OF dynamic params",
      },
    };
  }
};
