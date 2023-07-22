import { clone } from "@/utils/clone";

import { Context, ContextOptions } from "../common/context";
import { getOFDynamicParams } from "./utils/of-dynamic-params";
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

  constructor(sessionParams: UserSessionParams, options: ContextOptions) {
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
      Cookie: `sess=${this._userParams.sess}`,
    };
  }

  protected async getDynamicHeaders(url: URL) {
    const time = new Date().getTime();
    const dynamicParams = await getOFDynamicParams(this);
    const { sign } = await signReq(url, time, dynamicParams, this._userParams.authId);

    return {
      sign,
      time,
      appToken: dynamicParams.appToken,
    };
  }
}
