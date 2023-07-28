import { PostRequest, UserAuthResponseWithUnsafeParams } from "@/backend/controllers/types";
import { Site } from "@/backend/lib/accounts";
import { OFLogins } from "@/backend/lib/logins/index";
import { serverOFParamsHandler } from "@/backend/lib/of-params-handler";
import { Browsers } from "@/sites/common";
import { UnexpectedStatusCodeError } from "@/sites/common/errors/request-errors";
import { OF } from "@/sites/index";

import { GetLoginResponseBody, PostLoginRequestBody } from "./types";

type PostLogin<S extends Site> = (
  req: PostRequest<PostLoginRequestBody<S>>,
  res: UserAuthResponseWithUnsafeParams<GetLoginResponseBody<Site>>
) => Promise<unknown>;

export const post: PostLogin<Site> = async (req, res) => {
  try {


    switch (res.locals.site) {
      case Site.OF: {
        const body = req.body as PostLoginRequestBody<Site.OF>;
        if (
          "params" in body &&
          body.params &&
          body.params.xbc &&
          body.params.sess &&
          body.params.authId
        ) {
          const sess = new OF.SessionContext(
            {
              xbc: body.params.xbc,
              sess: body.params.sess,
              authId: body.params.authId,
              authUid: null,
            },
            {
              baseUrl: OF.OF_BASE_URL,
              browser: Browsers.brave,
            },
            serverOFParamsHandler
          );
          try {
            // ensure the creds are valid
            const user = await OF.Routes.V2.Users.me.get(sess);
            await OFLogins.saveLogin({
              xbc: body.params.xbc,
              sess: body.params.sess,
              authId: body.params.authId,
              userId: res.locals.userId,
            });
            return res.sendStatus(200);
          } catch (err) {
            if (err instanceof UnexpectedStatusCodeError && err.statusCode === 401) {
              console.warn(`Attempt to save invalid creds on account ${body.params.authId}`);
              return res.sendStatus(401);
            }
            console.error(`Unknown error occurred while saving creds`, err);
            return res.sendStatus(500);
          }
        } else {
          return res.sendStatus(400);
        }
      }
      default:
        return res.sendStatus(400);
    }
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};
