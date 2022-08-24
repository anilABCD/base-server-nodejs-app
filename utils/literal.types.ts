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

type Tab = "\t";
function Tab(str: Tab, length: number = 1) {
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

type Comment = "//";
let SingleLineComment: RegExp = /\/\//g;
function Comment(str: Comment) {
  let comment: RegExp = SingleLineComment;
  return comment;
}

export { Dot, Tab, NewLine, Space, Empty, PathChar, Comment };
