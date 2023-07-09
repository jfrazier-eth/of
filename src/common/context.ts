import { clone } from "@/utils/clone.js";
import { Browsers } from "./index.js";
import { CookieJar } from "tough-cookie";
import got, { Got } from "got";

export class Context {
  protected _baseUrl: URL;

  public get baseUrl() {
    return new URL(this._baseUrl.toString());
  }

  public get browser() {
    return clone(this._browser);
  }

  public get cookieJar() {
    return this._cookieJar;
  }

  public get client() {
    return this._client;
  }

  protected _browser: Browsers.Browser;
  protected _cookieJar: CookieJar;
  protected _client: Got;

  constructor(baseUrl: string | URL, browser: Browsers.Browser) {
    this._baseUrl = new URL(baseUrl.toString());
    this._browser = browser;
    this._cookieJar = new CookieJar();
    this._client = got.extend({
      throwHttpErrors: false,
      responseType: "json",
      cookieJar: this._cookieJar,
    });
  }

  public getUrl(path: string) {
    const url = this.baseUrl;
    url.pathname = path;
    return url;
  }

  public async getHeaders(_url: URL): Promise<Record<string, string>> {
    return Promise.resolve(this.browser.headers);
  }
}
