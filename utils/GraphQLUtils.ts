class GraphQLUtils {
  static getNonScalarType(propertyType: string) {
    propertyType = GraphQLUtils.getTrimmedType(propertyType);
    return propertyType;
  }
  static isScalarType(propertyType: string) {
    propertyType = GraphQLUtils.getTrimmedType(propertyType);

    if (
      propertyType.indexOf("string") > -1 ||
      propertyType.indexOf("String") > -1 ||
      propertyType.indexOf("number") > -1 ||
      propertyType.indexOf("Boolean") > -1 ||
      propertyType.indexOf("boolean") > -1 ||
      propertyType.indexOf("bigint") > -1
    ) {
      return true;
    }
    return false;
  }

  static getScalarType(propertyType: string) {
    propertyType = GraphQLUtils.getTrimmedType(propertyType);

    if (!GraphQLUtils.isScalarType(propertyType)) {
      throw "given a non scalar type";
    }

    return propertyType;
  }

  static getTrimmedType(typeName: string) {
    return typeName
      .replace(/\[/g, "")
      .replace(/\]/g, "")
      .replace(/\!/g, "")
      .trim();
  }

  static getTrimmedTypeSafeNull(typeName: string) {
    return typeName.replace("[", "").replace("]", "").trim();
  }
}

export default GraphQLUtils;
