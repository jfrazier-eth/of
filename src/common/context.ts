import { clone } from "@/utils/clone.js";
import { Browsers } from "./index.js";
import { CookieJar } from "tough-cookie";
import got, { ExtendOptions, Got } from "got";
import { HttpsProxyAgent } from "https-proxy-agent";
export interface ContextOptions {
  baseUrl: string | URL;
  browser: Browsers.Browser;
  proxy?: string | URL | null;
}

export class Context {
  protected _baseUrl: URL;

  public get baseUrl() {
    return new URL(this._baseUrl.toString());
  }

  public get browser() {
    return clone(this._browser);
  }

  public get options() {
    return {
      baseUrl: this.baseUrl,
      browser: this.browser,
      proxy: this._proxy,
    };
  }

  public get cookieJar() {
    return this._cookieJar;
  }

  public get client() {
    return this._client;
  }

  protected _browser: Browsers.Browser;
  protected _proxy: URL | null;
  protected _cookieJar: CookieJar;
  protected _client: Got;

  constructor(options: ContextOptions) {
    this._baseUrl = new URL(options.baseUrl.toString());
    this._browser = options.browser;
    this._cookieJar = new CookieJar();

    const clientOptions: Got | ExtendOptions = {
      throwHttpErrors: false,
      responseType: "json",
      cookieJar: this._cookieJar,
    };

    this._proxy = options.proxy ? new URL(options.proxy) : null;
    if (this._proxy) {
      clientOptions.agent = {
        https: new HttpsProxyAgent(this._proxy, {
          keepAlive: true,
        }),
      };

      clientOptions.https = {
        rejectUnauthorized: this._proxy.hostname !== "127.0.0.1",
      };
    }

    this._client = got.extend(clientOptions);
  }

  public getUrl(path: string, searchParams?: URLSearchParams) {
    const url = this.baseUrl;
    url.pathname = path;
    searchParams?.forEach((value, key) => {
      url.searchParams.set(key, value);
    });
    return url;
  }

  public async getHeaders(_url: URL): Promise<Record<string, string>> {
    return Promise.resolve(this.browser.headers);
  }
}
