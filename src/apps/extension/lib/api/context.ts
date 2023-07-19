export class Context {
  protected _baseUrl: URL;

  protected _user: { apiKey: string; userId: string } | null;

  public get baseUrl(): URL {
    return new URL(this._baseUrl.toString());
  }

  public get user() {
    return this._user;
  }

  public set user(value: { apiKey: string; userId: string } | null) {
    this._user = value;
  }

  constructor(baseUrl: string | URL) {
    this._baseUrl = new URL(baseUrl);
    this._user = null;
  }

  public getUrl(path: string, searchParams?: URLSearchParams) {
    const url = this.baseUrl;
    url.pathname = path;
    searchParams?.forEach((value, key) => {
      url.searchParams.set(key, value);
    });
    return url;
  }

  public getHeaders(): Record<string, string> {
    if (this.user) {
      return {
        "x-api-key": this.user.apiKey,
        "x-user-id": this.user.userId,
      };
    }
    return {};
  }
}
