import { Request, Response } from "express";
import { getAuth } from "firebase-admin/auth";

import { getApp } from "@/backend/db/firebase";
import { createUser } from "@/backend/lib/users";
import { getUserByFirebaseId } from "@/backend/lib/users/get-user";

export const post = async (
  req: Request<{}, {}, { token: string }>,
  res: Response<{ apiKey: string; userId: string }>
) => {
  try {
    const app = getApp();
    const idToken = req.body.token;

    const payload = await getAuth(app).verifyIdToken(idToken, true);
    const uid = payload.uid;

    let user = await getUserByFirebaseId(uid);
    if (!user) {
      await createUser({
        name: "",
        username: uid,
        firebaseAuthId: uid,
      });

      user = await getUserByFirebaseId(uid);

      if (!user) {
        return res.sendStatus(500);
      }

      return res.status(200).json({
        apiKey: user.apiKey,
        userId: user.id,
      });
    } else {
      return res.status(200).json({
        apiKey: user.apiKey,
        userId: user.id,
      });
    }
  } catch (err) {
    console.error(err);
    return res.sendStatus(401);
  }
};
