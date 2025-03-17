import { parse, stringify } from "./codec";

class RailgunAddressV2 {
  static parse = parse;
  static stringify = stringify;
}

export { RailgunAddressV2 };
