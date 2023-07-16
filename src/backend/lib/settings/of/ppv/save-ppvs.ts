import { uid } from "@/utils/uuid.js";
import { OFPPV } from "./types.js";
import { transformOFPPV } from "./pg-transformer.js";
import { pg, pgp } from "@/backend/db/postgres.js";

export type SaveOFPPVParams = Pick<OFPPV, "userId" | "siteUserId" | "ppv"> & {
  id?: string;
  createdAt?: number;
  updatedAt?: number;
};

export const savePPV = async (params: SaveOFPPVParams) => {
  const now = Date.now();
  const ppv: OFPPV = {
    ...params,
    id: params.id ?? uid(),
    createdAt: params.createdAt ?? now,
    updatedAt: now,
  };

  const pgPPV = transformOFPPV(ppv);

  const columns = Object.keys(pgPPV);
  const columnSet = new pgp.helpers.ColumnSet(columns, {
    table: "of_ppvs",
  });

  const insert = pgp.helpers.insert(pgPPV, columnSet);
  const query = `${insert} ON CONFLICT (id) of DO UPDATE SET ${columns}`;

  try {
    await pg.query(query);
  } catch (err) {
    console.error(`Failed to save of ppv`, err);
    throw err;
  }
};
