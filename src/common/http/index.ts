import got from "got";

export function getClient() {
  return got.extend({
    throwHttpErrors: false,
    responseType: "json",
  });
}
