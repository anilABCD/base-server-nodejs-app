import GraphQLUtils from "./GraphQLUtils";
import {
  ExportSyntax,
  TypeInfo,
  TypeNewDefaultObj,
  TypeNewDefaultTypeNameStartingExpression,
} from "./graphql_types";
import { isPropText } from "./is";
import { NewLine } from "./literal.types";

function default_GraphQL_Object_Text(type: TypeInfo) {
  let resultDefaultTypeText = "";

  const startingObjText = TypeNewDefaultTypeNameStartingExpression(
    "let new_TYPE_NAME_ : _TYPE_NAME_ = { ",
    type.typeName
  );

  let allScalarAndNonScalarAndScallarNonNullPropsTypes: {
    propertyName: string;
    propteryValue: string;
  }[] = [];

  type.properties.forEach((prop) => {
    const propertyName = prop.propertyName;
    if (prop.isNull === true) {
      return;
    }

    if (propertyName.includes("(")) {
      throw "property is a function name from defaultObject()";
    }

    // if ( prop.propertyType ) then this is not a scalar type guarantee ...
    if (prop.propertyType) {
      let nonScalarType = GraphQLUtils.getNonScalarType(prop.typeName);
      allScalarAndNonScalarAndScallarNonNullPropsTypes.push({
        propertyName: propertyName,
        propteryValue: defaultValueFromType(nonScalarType),
      });
    } else {
      let scalarType = GraphQLUtils.getScalarType(prop.typeName);
      allScalarAndNonScalarAndScallarNonNullPropsTypes.push({
        propertyName: propertyName,
        propteryValue: defaultValueFromType(scalarType),
      });
    }
  });

  allScalarAndNonScalarAndScallarNonNullPropsTypes.forEach((prop) => {
    //
    resultDefaultTypeText += `${NewLine("\n")}${prop.propertyName} : ${
      prop.propteryValue
    };${NewLine("\n")}`;
  });

  const exportText = ExportSyntax(
    "export { TYPE_NAME } ",
    GraphQLUtils.getTrimmedType(type.typeName)
  );

  const result = startingObjText + resultDefaultTypeText + exportText;

  return result;
}

function defaultValueFromType(propTypeName: string) {
  //
  if (!GraphQLUtils.isScalarType(propTypeName)) {
    return TypeNewDefaultObj(
      "new_TYPE_NAME_",
      GraphQLUtils.getTrimmedType(propTypeName)
    );
  }

  //
  let isBoolean = isPropText.isBoolean(propTypeName);
  let isNumber = isPropText.isNumber(propTypeName);
  let isString = isPropText.isString(propTypeName);

  if (isBoolean === true) {
    return "false";
  }

  if (isNumber === true) {
    return "0";
  }

  if (isString === true) {
    return "";
  }

  throw "Not a scalar type , not a non scalar type . from : defaultValueFromType()";

  return "";
}

export { default_GraphQL_Object_Text };
