import { Browsers, Context } from "@/common/index";
import { clone } from "@/utils/clone";

export interface UserFanslyParams {
  userId: string;
  auth: string;
}

export class LoggedInContext extends Context {
  protected _userParams: UserFanslyParams;

  constructor(
    baseUrl: string | URL,
    browser: Browsers.Browser,
    userParams: UserFanslyParams
  ) {
    super(baseUrl, browser);
    this._userParams = clone(userParams);
  }

  public get userId() {
    return this._userParams.userId;
  }

  public async getHeaders(url: URL): Promise<Record<string, string>> {
    return Promise.resolve({
      ...this.browser.headers,
      Authorization: this._userParams.auth,
    });
  }
}
