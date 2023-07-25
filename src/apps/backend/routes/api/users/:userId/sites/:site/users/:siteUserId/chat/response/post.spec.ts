import request from "supertest";

import { app } from "@/backend/app";
import { Site } from "@/backend/lib/accounts/types";

test("It should require auth", async () => {
  const response = await request(app).post(
    `/api/chat/users/test/sites/${Site.OF}/users/test/chat/response`
  );
  expect(response.statusCode).toBe(401);
});
