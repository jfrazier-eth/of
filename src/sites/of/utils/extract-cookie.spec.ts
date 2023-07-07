import { extractCookie } from "./extract-cookie.js";

it("can extract the sess cookie", () => {
  const sess = "hout0vs4gjevkse70g4jgr3bei";
  const cookies = `sess=${sess}; expires=Mon, 17-Jul-2023 15:34:37 GMT; Max-Age=864000; path=/; domain=.onlyfans.com; secure; HttpOnly, csrf=wmCmm5Br2aa0db0ec4f78de312eac4c79b472255; expires=Thu, 02-Apr-2026 15:34:37 GMT; Max-Age=86400000; path=/; domain=.onlyfans.com; secure; HttpOnly`;

  const cookie = extractCookie("sess", cookies);
  expect(cookie).toEqual(sess);
});
