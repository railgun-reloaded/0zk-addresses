import { type ByteLength } from "./types";

const formatUint8ArrayToLength = (
  data: Uint8Array,
  length: ByteLength
): Uint8Array => {
  const buffer = new Uint8Array(length);
  buffer.set(data, length - data.length);
  return buffer;
};

export { formatUint8ArrayToLength };
