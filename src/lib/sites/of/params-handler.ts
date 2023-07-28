import { ClientOFDynamicParams } from "@/backend/routes/api/users/:userId/sites/:site/users/:siteUserId/sign/params/types";

export interface ParamsHandler {
  getParams: () => Promise<ClientOFDynamicParams | null>;
}
