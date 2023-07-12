import { Context } from "../context.js";

export class RequestError extends Error {
  constructor(url: URL, context: Context, msg: string) {
    const message = `Unexpected Request Error. URL: ${url.toString()} Browser: ${
      context.browser.kind
    } Message: ${msg}`;
    super(message);
  }

  static create(err: Error | unknown, url: URL, context: Context) {
    return new RequestError(
      url,
      context,
      err instanceof Error ? err.message : `non-standard error ${err}`
    );
  }
}

export class UnexpectedStatusCodeError extends Error {
  constructor(url: URL, context: Context, statusCode: number) {
    const message = `Unexpected Status Code: ${statusCode} URL: ${url.toString()} Browser: ${
      context.browser.kind
    }`;
    super(message);
  }
}
