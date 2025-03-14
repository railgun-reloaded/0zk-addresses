import { type ByteLength, type BytesData } from "./types";

/**
 * The function `isPrefixed` checks if a given string starts with "0x" and returns a boolean value.
 * @param {string} str - A string that you want to check if it starts with "0x".
 */
export const isPrefixed = (str: string): boolean => str.startsWith("0x");

/**
 * The function `prefix0x` adds a '0x' prefix to a string if it is not already prefixed.
 * @param {string} str - A string value that may or may not be prefixed with "0x".
 */
export const prefix0x = (str: string): string =>
  isPrefixed(str) ? str : `0x${str}`;

/**
 * The `strip0x` function removes the "0x" prefix from a given string if it is present.
 * @param {string} str - The `str` parameter is a string that may or may not have a "0x" prefix at the
 * beginning. The function `strip0x` is designed to remove the "0x" prefix if it exists in the input
 * string.
 */
export const strip0x = (str: string): string =>
  isPrefixed(str) ? str.slice(2) : str;

/**
 * Coerces BytesData into hex string format
 * @param data - bytes data to coerce
 * @param prefix - prefix with 0x
 * @returns hex string
 */
export const hexlify = (data: BytesData, prefix = false): string => {
  let hexString = "";

  if (typeof data === "string") {
    // If we're already a string return the string
    // Strip leading 0x if it exists before returning
    hexString = strip0x(data);
  } else if (typeof data === "bigint" || typeof data === "number") {
    hexString = data.toString(16);
    if (hexString.length % 2 === 1) {
      hexString = `0${hexString}`;
    }
  } else {
    // We're an ArrayLike
    // Coerce ArrayLike to Array
    const dataArray: number[] = Array.from(data);

    // Convert array of bytes to hex string
    hexString = dataArray
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  // Return 0x prefixed hex string if specified
  if (prefix) {
    return `0x${hexString}`.toLowerCase();
  }

  // Else return plain hex string
  return hexString.toLowerCase();
};

/**
 * convert hex string to BigInt, prefixing with 0x if necessary
 * @param {string} str
 * @returns {bigint}
 */
export const hexToBigInt = (str: string): bigint => {
  return BigInt(prefix0x(str));
};

/**
 * Convert hex string to Uint8Array. Handles prefixed or non-prefixed.
 * @param {bigint} value
 * @returns {Uint8Array}
 */
export const hexStringToBytes = (hex: string): Uint8Array => {
  return hexToBytes(strip0x(hex));
};

function _hexToBytes(hex: string) {
  if (typeof hex !== "string") {
    throw new TypeError("hexToBytes: expected string, got " + typeof hex);
  }
  if (hex.length % 2)
    throw new Error("hexToBytes: received invalid unpadded hex");
  const array = new Uint8Array(hex.length / 2);
  for (let i = 0; i < array.length; i++) {
    const j = i * 2;
    const hexByte = hex.slice(j, j + 2);
    const byte = Number.parseInt(hexByte, 16);
    if (Number.isNaN(byte) || byte < 0)
      throw new Error("Invalid byte sequence");
    array[i] = byte;
  }
  return array;
}

export const hexToBytes = (data: string) => {
  const sliced = data.startsWith("0x") ? data.substring(2) : data;
  return _hexToBytes(sliced);
};

/**
 * XOR two Uint8Arrays of equal length.
 *
 * @param a - The first input array.
 * @param b - The second input array.
 * @returns A new Uint8Array where each byte is the XOR of the corresponding bytes in a and b.
 * @throws Error if the input arrays are not of the same length.
 */

export const xor = (a: Uint8Array, b: Uint8Array) => {
  var length = Math.max(a.length, b.length);
  var buffer = new Uint8Array(length);

  for (var i = 0; i < length; ++i) {
    // Since the value can be undefined due to different lengths we default to 0, xor of 0 is the same value
    const av = a[i] ?? 0;
    const bv = b[i] ?? 0;
    buffer[i] = av ^ bv;
  }

  return buffer;
};

/**
 * Format through hexlify, trim and padToLength given a number of bytes.
 * @param data - data to format
 * @param length - length to format to
 * @returns formatted data
 */
export const formatToByteLength = (
  data: BytesData,
  length: ByteLength,
  prefix = false
): string => {
  const hex = hexlify(data, prefix);
  const padded = padToLength(hex, length);
  const trimmed = trim(padded, length) as string;
  return trimmed;
};

/**
 * Pads BytesData to specified length
 * @param data - bytes data
 * @param length - length in bytes to pad to
 * @param side - whether to pad left or right
 * @returns padded bytes data
 */
export const padToLength = (
  data: BytesData,
  length: number,
  side: "left" | "right" = "left"
): string | number[] => {
  if (typeof data === "bigint" || typeof data === "number") {
    if (side === "left") {
      return data.toString(16).padStart(length * 2, "0");
    }
    return data.toString(16).padEnd(length * 2, "0");
  }

  if (typeof data === "string") {
    const dataFormattedString = strip0x(data);

    // If we're requested to pad to left, pad left and return
    if (side === "left") {
      return data.startsWith("0x")
        ? `0x${dataFormattedString.padStart(length * 2, "0")}`
        : dataFormattedString.padStart(length * 2, "0");
    }

    // Else pad right and return
    return data.startsWith("0x")
      ? `0x${dataFormattedString.padEnd(length * 2, "0")}`
      : dataFormattedString.padEnd(length * 2, "0");
  }

  // Coerce data into array
  const dataArray = Array.from(data);

  if (side === "left") {
    // If side is left, unshift till length
    while (dataArray.length < length) {
      dataArray.unshift(0);
    }
  } else {
    // If side is right, push till length
    while (dataArray.length < length) {
      dataArray.push(0);
    }
  }

  return dataArray;
};

/**
 * Trim to length of bytes
 * @param data - data to trim
 * @param length - length to trim to
 * @param side - side to trim from
 * @returns trimmed data
 */
export const trim = (
  data: BytesData,
  length: number,
  side: "left" | "right" = "left"
): BytesData => {
  if (typeof data === "bigint" || typeof data === "number") {
    const stringData = data.toString(16);
    const trimmedString = trim(stringData, length, side) as string;
    return BigInt(`0x${trimmedString}`);
  }

  if (typeof data === "string") {
    const dataFormatted = data.startsWith("0x") ? data.slice(2) : data;

    if (side === "left") {
      // If side is left return the last length bytes
      return data.startsWith("0x")
        ? `0x${dataFormatted.slice(dataFormatted.length - length * 2)}`
        : dataFormatted.slice(dataFormatted.length - length * 2);
    }

    // Side is right, return the start of the string to length
    return data.startsWith("0x")
      ? `0x${dataFormatted.slice(0, length * 2)}`
      : dataFormatted.slice(0, length * 2);
  }

  // Coerce to array
  const dataFormatted = Array.from(data);

  if (side === "left") {
    // If side is left return the last length bytes
    return dataFormatted.slice(data.length - length);
  }

  // Side is right, return the start of the array to length
  return dataFormatted.slice(0, length);
};

/**
 * Convert bigint to hex string, 0-padded to even length
 * @param {bigint} n - a bigint
 * @param {boolean} prefix - prefix hex with 0x
 * @return {string} even-length hex
 */
export const nToHex = (
  n: bigint,
  byteLength: ByteLength,
  prefix: boolean = false
): string => {
  if (n < 0) throw new Error("bigint must be positive");
  const hex = formatToByteLength(n.toString(16), byteLength, prefix);
  return prefix ? prefix0x(hex) : hex;
};

export const hexStringToUint8Array = (hexString: string) => {
  const bytes = [];
  for (let i = 0; i < hexString.length; i += 2) {
    bytes.push(parseInt(hexString.substr(i, 2), 16));
  }
  return new Uint8Array(bytes);
};

export const utf8StringToUint8Array = (utf8String: string): Uint8Array => {
  const encoder = new TextEncoder();
  const string = encoder.encode(utf8String);
  return string;
};

const HEX_CHARACTER_ARRAY = "0123456789abcdef".split("");

export const uint8ArrayToHex = (buffer: Uint8Array) => {
  let out = "";
  for (let idx = 0; idx < buffer.length; idx++) {
    let n = buffer[idx] ?? 0;

    out += `${HEX_CHARACTER_ARRAY[(n >>> 4) & 0xf]}${
      HEX_CHARACTER_ARRAY[n & 0xf]
    }`;
  }
  return out;
};
