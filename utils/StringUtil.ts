import console from "./console";

class StringUtil {
  static paddingStart = (str: string, length: number, pad_string: string) => {
    return str.padStart(length, pad_string);
  };

  static isNullOrEmpty = (str: string) => {
    if (str === undefined || str === null) {
      return true;
    }

    if (str.trim() === "") {
      return true;
    }

    return false;
  };
}

export default StringUtil;
