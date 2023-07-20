import { SessionContext } from "../context";
import { Routes } from "../index";

export async function getUserDetails(context: SessionContext) {
  try {
    const meResponse = await Routes.V2.Users.me.get(context);
    console.log(`Retrieved details for user ${meResponse.name}`);
    console.log(meResponse);
  } catch (err) {
    console.error("Failed to get a user details", err);
  }
}