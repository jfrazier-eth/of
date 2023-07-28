import { SessionContext } from "../context";
import { Routes } from "../index";

export async function getFanStats(context: SessionContext, fanHandle: string) {
  try {
    const fanStats = await Routes.V2.Users.user.get(context, fanHandle);
    return fanStats;
  } catch (err) {
    console.error("Failed to get a fan details", err);
  }
}
