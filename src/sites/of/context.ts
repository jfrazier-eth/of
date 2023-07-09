import { Context, ContextOptions } from "@/common/context.js";
import { Browsers } from "@/common/index.js";
import { clone } from "@/utils/clone.js";
import { getOFDynamicParams } from "./utils/of-dynamic-params.js";
import { signReq } from "./utils/sign-req.js";

export interface UserParams {
  xbc: string;
}

export interface UserSessionParams {
  xbc: string;
  authId: string;
  authUid: string | null;
}

export class UserContext extends Context {
  protected _userParams: UserParams;

  public get userParams() {
    return clone(this._userParams);
  }

  constructor(userParams: UserParams, options: ContextOptions) {
    super(options);
    this._userParams = clone(userParams);
  }

  public async getHeaders(url: URL): Promise<Record<string, string>> {
    const { sign, time, appToken } = await this.getDynamicHeaders(url);

    return {
      ...this.browser.headers,
      Sign: sign,
      Time: `${time}`,
      "X-Bc": this._userParams.xbc,
      "App-Token": appToken,
    };
  }

  protected async getDynamicHeaders(url: URL) {
    const time = new Date().getTime();
    const dynamicParams = await getOFDynamicParams(this);
    const { sign } = signReq(url, time, dynamicParams);

    return {
      sign,
      time,
      appToken: dynamicParams.appToken,
    };
  }
}

export class SessionContext extends UserContext {
  protected _userParams: UserSessionParams;
  constructor(sessionParams: UserSessionParams, options: ContextOptions) {
    super(sessionParams, options);
    this._userParams = clone(sessionParams);
  }

  public async getHeaders(url: URL): Promise<Record<string, string>> {
    const { sign, time, appToken } = await this.getDynamicHeaders(url);

    return {
      ...this.browser.headers,
      Sign: sign,
      Time: `${time}`,
      "X-Bc": this._userParams.xbc,
      "App-Token": appToken,
    };
  }

  protected async getDynamicHeaders(url: URL) {
    const time = new Date().getTime();
    const dynamicParams = await getOFDynamicParams(this);
    const { sign } = signReq(url, time, dynamicParams, this._userParams.authId);

    return {
      sign,
      time,
      appToken: dynamicParams.appToken,
    };
  }
}
