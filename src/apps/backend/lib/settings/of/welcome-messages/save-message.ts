import { pg, pgp } from "@/backend/db/postgres";
import { uid } from "@/utils/uid";

import { transformOFWelcomeMessage } from "./pg-transform";
import { OFWelcomeMessage } from "./types";

export type SaveOFWelcomeMessageParams = Pick<OFWelcomeMessage, "message" | "siteUserId" | "userId"> & {
  createdAt?: OFWelcomeMessage["createdAt"];
  updatedAt?: OFWelcomeMessage["updatedAt"];
  id?: OFWelcomeMessage["id"];
};

export const saveMessage = async (params: SaveOFWelcomeMessageParams) => {
  const id = params.id ?? uid();
  const now = Date.now();
  const message: OFWelcomeMessage = {
    id,
    siteUserId: params.siteUserId,
    userId: params.userId,
    createdAt: params.createdAt ?? now,
    updatedAt: params.updatedAt ?? now,
    message: {
      image: params.message.image,
      script: params.message.script,
      price: params.message.price,
    },
  };

  const pgMessage = transformOFWelcomeMessage(message);

  const columns = Object.keys(pgMessage);
  const columnSet = new pgp.helpers.ColumnSet(columns, {
    table: "of_welcome_messages",
  });

  const insert = pgp.helpers.insert(pgMessage, columnSet);
  const query = `${insert} ON CONFLICT (id) of DO UPDATE SET ${columns}`;

  try {
    await pg.query(query);
  } catch (err) {
    console.error(`Failed to save of welcome message`, err);
    throw err;
  }
};
