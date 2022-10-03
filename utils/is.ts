import GraphQLUtils from "./GraphQLUtils";
import { TS_Scalar } from "./graphql_types";

class is {
  //console.log(fruits instanceof Array);
  //console.log(fruits instanceof Object);
  //console.log(fruits instanceof Number);
  //console.log(fruits instanceof String);

  isArray(obj: any) {
    if (obj instanceof Array) {
      return true;
    }

    return false;
  }

  isObject(obj: any) {
    if (obj instanceof Object) {
      return true;
    }

    return false;
  }

  isNumber(obj: any) {
    if (obj instanceof Number) {
      return true;
    }

    return false;
  }

  isString(obj: any) {
    if (obj instanceof String) {
      return true;
    }

    return false;
  }

  isBoolean(obj: any) {
    if (obj instanceof Boolean) {
      return true;
    }

    return false;
  }
}

class isScalarFromText {
  isNumber(scalar: string) {
    if (TS_Scalar("number") === GraphQLUtils.getTrimmedType(scalar)) {
      return true;
    }

    return false;
  }

  isString(scalar: any) {
    if (TS_Scalar("string") === GraphQLUtils.getTrimmedType(scalar)) {
      return true;
    }

    return false;
  }

  isBoolean(scalar: any) {
    if (TS_Scalar("boolean") === GraphQLUtils.getTrimmedType(scalar)) {
      return true;
    }

    return false;
  }
}

let isProp = new is();

let isPropText = new isScalarFromText();

export { isProp, isPropText };
