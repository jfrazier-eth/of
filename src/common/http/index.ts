import ky from "ky";

export type KyInstance = typeof ky;

export function getClient(): typeof ky {
  return ky.create({
    throwHttpErrors: false,
    parseJson: JSON.parse,
  });
}
