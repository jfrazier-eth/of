import { clone } from "@/utils/clone";

import { Context, ContextOptions } from "../common/context";
import { ParamsHandler } from "./params-handler";
import { signReq } from "./utils/sign-req";

export interface UserSessionParams {
  xbc: string;
  sess: string;
  authId: string;
  authUid: string | null;
}

export class SessionContext extends Context {
  protected _userParams: UserSessionParams;

  public get userId() {
    return this._userParams.authId;
  }

  public get userParams() {
    return clone(this._userParams);
  }

  constructor(
    sessionParams: UserSessionParams,
    options: ContextOptions,
    public ofParams: ParamsHandler
  ) {
    super(options);
    this._userParams = clone(sessionParams);
  }

  public async getHeaders(url: URL): Promise<Record<string, string>> {
    const { sign, time, appToken } = await this.getDynamicHeaders(url);

    const browserHeaders = this.browser ? this.browser.headers : {};

    return {
      ...browserHeaders,
      Sign: sign,
      Time: `${time}`,
      "X-Bc": this._userParams.xbc,
      "App-Token": appToken,
      Cookie: `sess=${this._userParams.sess}; auth_id=${this._userParams.authId}`,
    };
  }

  protected async getDynamicHeaders(url: URL) {
    const time = new Date().getTime();
    const dynamicParams = await this.ofParams.getParams();

    if (!dynamicParams) {
      throw new Error("Dynamic params are not ready");
    }

    let userId = this._userParams.authId;
    if (url.pathname === "/api2/v2/users/me") {
      userId = "0";
    }
    const { sign } = await signReq(url, time, dynamicParams, userId);

    return {
      sign,
      time,
      appToken: dynamicParams.appToken,
    };
  }
}
