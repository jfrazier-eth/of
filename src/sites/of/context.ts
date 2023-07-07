import { Context } from "@/common/context.js";
import { Browsers } from "@/common/index.js";
import { clone } from "@/utils/clone.js";
import { getOFDynamicParams } from "./utils/of-dynamic-params.js";
import { signReq } from "./utils/sign-req.js";

export interface UserParams {
  xbc: string;
}

export interface UserSessionParams {
  xbc: string;
  sess: string;
  authId: string;
  authUid: string | null;
}

export class UserContext extends Context {
  protected _userParams: UserParams;

  public get userParams() {
    return clone(this._userParams);
  }

  constructor(
    baseUrl: string | URL,
    browser: Browsers.Browser,
    userParams: UserParams
  ) {
    super(baseUrl, browser);
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
  constructor(
    baseUrl: string | URL,
    browser: Browsers.Browser,
    sessionParams: UserSessionParams
  ) {
    super(baseUrl, browser, sessionParams);
    this._userParams = clone(sessionParams);
  }

  public async getHeaders(url: URL): Promise<Record<string, string>> {
    const { sign, time, appToken } = await this.getDynamicHeaders(url);

    const cookies = [
      `sess=${this._userParams.sess}`,
      `auth_id=${this._userParams.authId}`,
    ].join("; ");

    return {
      ...this.browser.headers,
      Sign: sign,
      Time: `${time}`,
      "X-Bc": this._userParams.xbc,
      "App-Token": appToken,
      Cookie: cookies,
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
