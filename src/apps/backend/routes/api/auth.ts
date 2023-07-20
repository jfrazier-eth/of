import { Request, Response, Router } from "express";

import { Site } from "@/backend/lib/accounts";
import { LoginParamsBySite, getLogin } from "@/backend/lib/logins/get-login";
import { OFLogins } from "@/backend/lib/logins/index";

const router: Router = Router();

interface GetLoginQueryParams {
  siteUserId: string;
}

interface GetLoginResponseBody<S extends Site> {
  params: LoginParamsBySite[S];
}

router.get(
  "/api/user/:userId/sites/:site/login",
  async (
    req: Request<{ userId: string; site: Site }, null, null, GetLoginQueryParams>,
    res: Response<GetLoginResponseBody<Site> | { message: string }>
  ) => {
    const site = req.params.site;
    const siteUserId = req.query.siteUserId;
    const userIdHeader = req.headers["x-user-id"];
    const userId = req.params.userId;

    if (!site || !siteUserId) {
      res.status(400).json({ message: "Missing site or siteUserId" });
      return;
    }

    if (typeof userIdHeader !== "string" || !userIdHeader) {
      console.error(`Expected user id to be present`);
      return res.sendStatus(500);
    } else if (userIdHeader !== userId) {
      return res.sendStatus(400);
    }

    const login = await getLogin({
      site,
      siteUserId,
      userId: userIdHeader,
    });

    if (!login) {
      res.status(404).json({ message: "Not found" });
      return;
    }

    res.status(200).json({
      params: login.params,
    });
  }
);

interface PostLoginRequestBody<S extends Site> {
  params: LoginParamsBySite[S];
}

router.post(
  "/api/user/:userId/sites/:site/login",
  async <S extends Site>(
    req: Request<{ userId: string; site: Site }, null, PostLoginRequestBody<S>>,
    res: Response<GetLoginResponseBody<Site> | { message: string }>
  ) => {
    const userIdHeader = req.headers["x-user-id"];
    const userId = req.params.userId;
    if (typeof userId !== "string" || !userId) {
      return res.status(500).json({ message: "Server error" });
    }
    if (userIdHeader !== userId) {
      return res.status(400).json({ message: "Bad request" });
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
          return res.status(400).json({ message: "Missing params" });
        }
      }
    }

    return res.status(400).json({ message: "Invalid site" });
  }
);

export { router };
