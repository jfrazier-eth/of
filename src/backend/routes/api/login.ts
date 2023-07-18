import { getApp } from "@/backend/db/firebase.js";
import { createUser } from "@/backend/lib/users/create-user.js";
import { getUser, getUserByFirebaseId } from "@/backend/lib/users/get-user.js";
import { Request, Response, Router } from "express";
import { getAuth } from "firebase-admin/auth";

const router = Router();

router.post(
  "/",
  async (
    req: Request<{}, {}, { token: string }>,
    res: Response<{ apiKey: string; userId: string }>
  ) => {
    const app = getApp();
    const idToken = req.body.token;

    try {
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
          console.log("Failed to create user");
          res.status(500);
          return;
        }

        res.status(200).json({
          apiKey: user.apiKey,
          userId: user.id,
        });
        return;
      } else {
        res.status(200).json({
          apiKey: user.apiKey,
          userId: user.id,
        });
        return;
      }
    } catch (err) {
      console.error(err);
      res.sendStatus(401);
      return;
    }
  }
);

export { router };
