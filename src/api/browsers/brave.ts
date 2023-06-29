import { Browser } from "./types";

export const headers = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
  "Sec-Ch-Ua": '"Not.A/Brand";v="8", "Chromium";v="114", "Brave";v="114"',
  "Sec-Ch-Ua-Mobile": "?0",
  "Sec-Ch-Ua-Platform": '"macOS"',
  "Upgrade-Insecure-Requests": "1",
  "Sec-Gpc": "1",
  "Accept-Language": "en-US,en;q=0.9",
  "Sec-Fetch-Site": "same-origin",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Dest": "empty",
  "Accept-Encoding": "gzip, deflate",
};

export const brave: Browser = {
  kind: "brave",
  headers,
};
