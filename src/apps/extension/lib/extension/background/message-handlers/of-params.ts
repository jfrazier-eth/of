import { Result, err, ok } from "neverthrow";

import { ClientOFDynamicParams } from "@/backend/routes/api/users/:userId/sites/:site/users/:siteUserId/sign/params/types";
import { Context } from "@/extension/lib/api/context";
import { getOFDynamicParams } from "@/extension/lib/api/get-of-dynamic-params";
import { parseError } from "@/utils/parse-error";

import { GetOFDynamicParamsMessage, UpdateOFRevisionMessage } from "../../messages";
import { Storage } from "../../storage";
import { Handler } from "./types";

const updateOFParams = async (
  context: Context,
  revision?: string
): Promise<Result<ClientOFDynamicParams, Error>> => {
  try {
    const params = await getOFDynamicParams(context, revision);
    context.ofParams.params = params;
    await setCachedOFDynamicParams(params);

    return ok(params);
  } catch (err) {
    return parseError(err);
  }
};

export const handleUpdateOFRevisionMessage: Handler<UpdateOFRevisionMessage> = async (
  message,
  context
) => {
  const currRev = message.data.revision;
  const prevRevision = context.ofParams.params?.revision;

  if (prevRevision === currRev) {
    return ok({
      kind: "UPDATE_OF_REVISION",
      data: { revision: currRev },
    });
  }
  try {
    const paramsResponse = await updateOFParams(context, currRev);
    if (paramsResponse.isErr()) {
      return err(paramsResponse.error);
    }
    return ok({
      kind: "UPDATE_OF_REVISION",
      data: { revision: paramsResponse.value.revision },
    });
  } catch (err) {
    return parseError(err);
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
  try {
    const cachedDynamicParams = await getCachedOFDynamicParams();
    if (cachedDynamicParams) {
      return ok({
        kind: "GET_OF_DYNAMIC_PARAMS",
        data: {
          params: cachedDynamicParams,
        },
      });
    }

    const res = await updateOFParams(context);
    if (res.isErr()) {
      return err(res.error);
    }
    console.log(`Updated dynamic params!`, res);
    return ok({
      kind: "GET_OF_DYNAMIC_PARAMS",
      data: {
        params: res.value,
      },
    });
  } catch (err) {
    console.error(`Failed to get OF dynamic params`, err);
    return parseError(err);
  }
};
