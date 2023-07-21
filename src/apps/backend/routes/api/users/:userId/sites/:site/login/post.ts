import { Request, Response } from "express";

import { Site } from "@/backend/lib/accounts";
import { OFLogins } from "@/backend/lib/logins/index";

import { GetLoginResponseBody, PostLoginRequestBody } from "./types";

type PostLogin<S extends Site> = (
  req: Request<{ userId: string; site: Site }, null, PostLoginRequestBody<S>>,
  res: Response<GetLoginResponseBody<Site> | { message: string }>
) => Promise<unknown>;

export const post: PostLogin<Site> = async (req, res) => {
  const userIdHeader = req.headers["x-user-id"];
  const userId = req.params.userId;
  if (typeof userId !== "string" || !userId) {
    return res.sendStatus(500);
  }
  if (userIdHeader !== userId) {
    return res.sendStatus(400);
  }

  const site = req.params.site;
  switch (site) {
    case Site.OF: {
      const body = req.body as PostLoginRequestBody<Site.OF>;
      if (
        "params" in body &&
        body.params &&
        body.params.xbc &&
        body.params.sess &&
        body.params.authId
      ) {
        await OFLogins.saveLogin({
          xbc: body.params.xbc,
          sess: body.params.sess,
          authId: body.params.authId,
          userId,
        });
        return res.sendStatus(200);
      } else {
        return res.sendStatus(400);
      }
    }
  }

  return res.sendStatus(400);
};
