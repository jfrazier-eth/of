import { Context } from "./context";
import { Browsers } from "./index";

describe("context", () => {
  it("getUrl should use correct keys and values", () => {
    const searchParams = new URLSearchParams({
      key: "value",
    });

    const context = new Context({
      baseUrl: "https://onlyfans.com/",
      browser: Browsers.brave,
    });

    const path = "test";
    const url = context.getUrl(path, searchParams);

    const value = url.searchParams.get("key");

    expect(value).toBe("value");
  });
});
