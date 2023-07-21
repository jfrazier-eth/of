import request from "supertest";

import { app } from "@/backend/app";
import { Site } from "@/backend/lib/accounts/types";

test("It should require auth", async () => {
  const response = await request(app).get(`/api/users/userId/sites/${Site.OF}/login`);
  expect(response.statusCode).toBe(401);
});
