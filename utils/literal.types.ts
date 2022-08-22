import StringUtil from "./StringUtil";

type Dot = ".";
function Dot(str: Dot) {
  return str;
}

type Empty = "";
function Empty(str: Empty) {
  let empty: any = str;
  return empty;
}

type PathChar = "/" | "//" | "." | "..";
function PathChar(str: PathChar) {
  return str;
}

type NewLine = "\r\n";
type NewLineWithOutCarriageRuturn = "\n";
function NewLine(
  str: NewLine | NewLineWithOutCarriageRuturn,
  length: number = 1
) {
  if (length > 1) {
    const calcLength = str.length * length;
    return StringUtil.paddingStart(str, calcLength, str);
  }

  return str;
}

type Space = " ";
function Space(str: Space, length: number = 1) {
  if (length > 1) {
    const calcLength = str.length * length;
    return StringUtil.paddingStart(str, calcLength, str);
  }

  return str;
}

export { Dot, NewLine, Space, Empty, PathChar };
