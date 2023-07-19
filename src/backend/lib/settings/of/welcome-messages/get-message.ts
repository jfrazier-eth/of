import { pg } from "@/backend/db/postgres";
import { OFWelcomeMessage, PGOFWelcomeMessage } from "./types";
import { transformPGOFWelcomeMessage } from "./pg-transform";

export const getMessage = async (
  messageId: string
): Promise<OFWelcomeMessage | null> => {
  const query = "SELECT * from of_welcome_messages WHERE id = $1";
  const values = [messageId];
  const result = await pg.query<PGOFWelcomeMessage[]>(query, values);

  console.assert(
    result.length <= 1,
    `Received multiple messages with the same id! Query ${query} Values ${values}`
  );

  if (result.length === 1) {
    return transformPGOFWelcomeMessage(result[0]);
  }
  return null;
};
