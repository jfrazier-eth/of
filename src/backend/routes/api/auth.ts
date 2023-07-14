import { Site } from "@/backend/lib/accounts/types.js";
import { LoginParamsBySite, getLogin } from "@/backend/lib/logins/get-login.js";
import { getUser } from "@/backend/lib/users/get-user.js";
import { NextFunction, Request, Response, Router } from "express";

const router = Router();

export const checkUserAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const apiKey = req.headers["x-api-key"];
  const userId = req.headers["x-user-id"];

  if (typeof userId !== "string" || typeof apiKey !== "string") {
    res.status(401).json({ message: "Unauthorized request - invalid headers" });
    return;
  }

  const user = await getUser(userId);
  if (!user) {
    res.status(401).json({ message: "Unauthorized request" });
    return;
  }

  if (user.apiKey !== apiKey) {
    res.status(401).json({ messageL: "Unauthorized request" });
    return;
  }

  next();
};

router.use(checkUserAuth);

interface GetLoginQueryParams {
  siteUserId: string;
}

interface GetLoginResponseBody<S extends Site> {
  params: LoginParamsBySite[S];
}

router.get(
  "/api/user/:userId/sites/:site/login",
  async (
    req: Request<
      { userId: string; site: Site },
      null,
      null,
      GetLoginQueryParams
    >,
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
      res.status(500).json({ message: "Server error" });
      console.error(`Expected user id to be present`);
      return;
    }

    if (userIdHeader !== userId) {
      res.status(400).json({ message: "Bad Request" });
      return;
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
  async (
    req: Request<{ userId: string; site: Site }, null>,
    res: Response<GetLoginResponseBody<Site> | { message: string }>
  ) => {
    const userIdHeader = req.headers["x-user-id"];
    const userId = req.params.userId;
    if (typeof userId !== "string" || !userId) {
      res.status(500).json({ message: "Server error" });
      console.error(`Expected user id to be present`);
      return;
    }
    if (userIdHeader !== userId) {
      res.status(400).json({ message: "Bad request" });
      return;
    }

    const site = req.params.site;
    switch (site) {
      case Site.OF: {
      }

      default: {
        res.status(400).json({ message: "Invalid site" });
      }
    }
  }
);
