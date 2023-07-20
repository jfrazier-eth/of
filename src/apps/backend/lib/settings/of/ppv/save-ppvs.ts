import { pg, pgp } from "@/backend/db/postgres";
import { uid } from "@/utils/uid";

import { transformOFPPV } from "./pg-transformer";
import { OFPPV } from "./types";

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
  const excludedColumns = columns.map((col) => `${col} = EXCLUDED.${col}`).join(", ");
  const query = `${insert} ON CONFLICT (id) of DO UPDATE SET ${excludedColumns}`;

  try {
    await pg.query(query);
  } catch (err) {
    console.error(`Failed to save of ppv`, err);
    throw err;
  }
};