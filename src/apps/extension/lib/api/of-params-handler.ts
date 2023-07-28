import { ClientOFDynamicParams } from "@/backend/routes/api/users/:userId/sites/:site/users/:siteUserId/sign/params/types";
import { ParamsHandler } from "@/sites/of/params-handler";

import { sendMessage } from "../extension/messages";

export class BrowserOFParamsHandler implements ParamsHandler {
  protected _revision: string | null;
  protected _dynamicParams: ClientOFDynamicParams | null;

  public isReady: Promise<void>;

  public async getParams(): Promise<ClientOFDynamicParams | null> {
    await this.isReady;
    if (!this._dynamicParams) {
      return Promise.resolve(null);
    }

    return Promise.resolve({
      staticParam: this._dynamicParams.staticParam,
      start: this._dynamicParams.start,
      end: this._dynamicParams.end,
      checksumConstant: this._dynamicParams.checksumConstant,
      checksumIndexes: [...this._dynamicParams.checksumIndexes],
      revision: this._dynamicParams.revision,
      appToken: this._dynamicParams.appToken,
    });
  }

  public set params(params: ClientOFDynamicParams | null) {
    this._dynamicParams = params;
    if (params) {
      this._revision = params.revision;
    }
  }

  constructor(revision: string | null) {
    this._revision = revision;
    this._dynamicParams = null;
    this.isReady = this._init();
  }

  protected async _init() {
    const response = await sendMessage({
      kind: "GET_OF_DYNAMIC_PARAMS",
    });

    if (response.data.success) {
      this.params = response.data.params;
    } else {
      console.error(response.data.message);
    }
  }

  public async refresh() {
    if (this._dynamicParams === null) {
      console.log(`Refreshing dynamic params`);
      try {
        const response = await sendMessage({
          kind: "GET_OF_DYNAMIC_PARAMS",
        });

        if (response.data.success) {
          this.params = response.data.params;
        } else {
          console.error(response.data.message);
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      console.log(`Skipping refreshing dynamic params`);
    }
  }
}
