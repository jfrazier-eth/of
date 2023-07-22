import { OFDynamicParams } from "./of-dynamic-params";
import { signReq } from "./sign-req";

it("can generate the expected sign header", async () => {
  const url = new URL("https://onlyfans.com/api2/v2/init");

  const time = 1688047708049;
  const dynamicParams: OFDynamicParams = {
    staticParam: "wnD8IOmL9kmkv4qO7T8k1zRZ0OgVYrPB",
    start: "8957",
    end: "649d22c8",
    checksumConstant: -172,
    checksumIndexes: [
      2,
      5,
      5,
      5,
      8,
      9,
      12,
      14,
      15,
      16,
      17,
      19,
      19,
      20,
      22,
      23,
      23,
      26,
      26,
      26,
      27,
      29,
      30,
      31,
      32,
      32,
      32,
      32,
      33,
      34,
      34,
      36,
    ],
    appToken: "33d57ade8c02dbc5a333db99ff9ae26a", // can be found in app.js
    removeHeaders: ["user_id"],
    revision: "202306290620-5cd0b104b9",
    isCurrent: true,
  };
  const authId = "0";

  const { sign } = await signReq(url, time, dynamicParams, authId);

  const expectedSign = "8957:bb0fe3aa1c62f8d4c2f08c8083fba2f0928d933b:78f:649d22c8";

  const [expectedStart, expectedHash, expectedSum, expectedEnd] = expectedSign.split(":");

  const [start, hash, sum, end] = sign.split(":");

  expect(start).toEqual(expectedStart);
  expect(hash).toEqual(expectedHash);
  expect(sum).toEqual(expectedSum);
  expect(end).toEqual(expectedEnd);
});

it("can generate the expected sign header", async () => {
  const url = new URL("https://onlyfans.com/api2/v2/users/me");

  const time = 1690040683193;
  const dynamicParams: OFDynamicParams = {
    staticParam: "MjmDonUMsSUe4IFBC7WGaSeFvRzzNWZd",
    start: "9227",
    end: "64babf4b",
    checksumConstant: -380,
    checksumIndexes: [
      0,
      3,
      5,
      5,
      7,
      8,
      8,
      14,
      15,
      16,
      17,
      17,
      17,
      19,
      19,
      22,
      22,
      22,
      24,
      24,
      24,
      24,
      26,
      26,
      26,
      27,
      28,
      30,
      33,
      33,
      37,
      38,
    ],
    appToken: "33d57ade8c02dbc5a333db99ff9ae26a",
    removeHeaders: ["user_id"],
    revision: "202307211724-763823e6a9",
    isCurrent: true,
  };
  const authId = "19160619";

  const { sign } = await signReq(url, time, dynamicParams, authId);

  const expectedSign = "9227:a76714c494fd0d159d8830db2f8fedb3cdd467d4:791:64babf4b";

  const [expectedStart, expectedHash, expectedSum, expectedEnd] = expectedSign.split(":");

  const [start, hash, sum, end] = sign.split(":");

  expect(start).toEqual(expectedStart);
  expect(hash).toEqual(expectedHash);
  expect(sum).toEqual(expectedSum);
  expect(end).toEqual(expectedEnd);
});
