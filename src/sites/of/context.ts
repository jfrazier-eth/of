import { clone } from "@/utils/clone";
import { getOFDynamicParams, signReq } from "./utils";
import { Browsers, Context } from "@/common/index";

export interface UserOFParams {
  xbc: string;
  sess: string;
  authId: string;
  authUid: string | null;
}

export class LoggedInContext extends Context {
  protected _userParams: UserOFParams;

  constructor(
    baseUrl: string | URL,
    browser: Browsers.Browser,
    userParams: UserOFParams
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
      Cookie: `auth_id=${this._userParams.authId}; sess=${this._userParams.sess}`,
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
