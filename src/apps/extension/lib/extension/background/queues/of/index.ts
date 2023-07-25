import { Result, err, ok } from "neverthrow";

import { Context } from "@/extension/lib/api/context";
import { OF_BASE_URL, SessionContext } from "@/sites/of";

import { Errors } from "./errors";
import { getChatsWithNewMessages, trigger } from "./new-messages";
import { init as initSettings } from "./settings";

export const autoMessaging = (context: Context, options: { interval: number }) => {
  if (!context.ofAuth) {
    return err(Errors.UserOFAuthNotFound);
  }

  const session = new SessionContext(
    {
      xbc: context.ofAuth.xbc,
      authId: context.ofAuth.authId,
      sess: context.ofAuth.sess,
      authUid: null,
    },
    {
      baseUrl: OF_BASE_URL,
    },
    context.ofParams
  );

  const { stop: stopSettings } = initSettings({
    interval: options.interval,
    callbacks: [
      (context, settings) => {
        return trigger({ session });
      },
    ],
    context,
  });

  return ok({
    stop: () => {
      stopSettings();
    },
  });
};
