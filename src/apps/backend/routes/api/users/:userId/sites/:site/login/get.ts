import { Request, Response } from "express";

import { Site } from "@/backend/lib/accounts/types";
import { getLogin } from "@/backend/lib/logins/get-login";

import { GetLoginQueryParams, GetLoginResponseBody } from "./types";

export const get = async (
  req: Request<{ userId: string; site: Site }, {}, {}, GetLoginQueryParams>,
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
};
