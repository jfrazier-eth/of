import { AdminAuthResponse, PostRequest } from "@/backend/controllers/types";

export const post = async (req: PostRequest, res: AdminAuthResponse<null>) => {
  try {
    return res.sendStatus(200);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};
