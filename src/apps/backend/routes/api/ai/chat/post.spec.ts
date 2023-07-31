import request from "supertest";

import { app } from "@/backend/app";

test("It should require auth", async () => {
  const response = await request(app).post(
    `/api/ai/chat`
  );
  expect(response.statusCode).toBe(401);
});
