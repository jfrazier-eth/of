import { Browser } from "./types";

export const headers = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
  "Sec-Ch-Ua": '"Not/A)Brand";v="99", "Brave";v="115", "Chromium";v="115"',
  "Sec-Ch-Ua-Mobile": "?0",
  "Sec-Ch-Ua-Platform": '"macOS"',
  "Sec-Gpc": "1",
  "Accept-Language": "en-US,en;q=0.7",
  "Sec-Fetch-Site": "same-origin",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Dest": "empty",
  "Accept-Encoding": "gzip, deflate",
};

export const brave: Browser = {
  kind: "brave",
  headers,
};
