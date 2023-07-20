let generateHash: (data: string) => Promise<string>;

export const sha1 = async (data: string) => {
  if (!generateHash) {
    generateHash = typeof window === "undefined" ? await nodeSha1() : browserSha1();
  }

  return await generateHash(data);
};

const nodeSha1 = async () => {
  const crypto = await import("crypto");

  const generateSHA1Hash = (msg: string): Promise<string> => {
    const hexHash = crypto.createHash("sha1").update(msg).digest("hex");

    return Promise.resolve(hexHash);
  };

  return generateSHA1Hash;
};

const browserSha1 = () => {
  function arrayBufferToHexString(buffer: ArrayBuffer) {
    return Array.prototype.map
      .call(new Uint8Array(buffer), (byte) => {
        return ("0" + byte.toString(16)).slice(-2);
      })
      .join("");
  }

  // Function to generate SHA-1 hash
  async function generateSHA1Hash(message: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    const hash = arrayBufferToHexString(hashBuffer);
    return hash;
  }

  return generateSHA1Hash;
};
