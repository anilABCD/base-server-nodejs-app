const filterObject = (bodyObj: any, propertyKeysToUpdate: [string]) => {
  let newObj: any = {};

  Object.keys(bodyObj).forEach((el) => {
    propertyKeysToUpdate.forEach((key) => {
      if (key === el) {
        if (bodyObj[el]) {
          newObj[el] = bodyObj[el];
        }
      }
    });
  });

  return newObj;
};

const removeProperty = (bodyObj: any, propertyKeysToRemove: [string]) => {
  propertyKeysToRemove.forEach((property) => {
    delete bodyObj[property];
  });

  return bodyObj;
};

const addUpdateDate = (bodyObj: any) => {
  bodyObj.updatedDate = Date.now();
  return bodyObj;
};

const addCreatedDate = (bodyObj: any) => {
  bodyObj.createdDate = Date.now();
  return bodyObj;
};

const hasDuplicates = (arry: Array<any>): boolean | null => {
  let duplicates = findDuplicates(arry);

  if (!duplicates) {
    return null;
  }

  if (duplicates.length > 0) {
    return true;
  } else {
    return false;
  }
};

const findDuplicates = (arry: Array<any>): Array<any> | null => {
  if (!arry || arry.length == 0) {
    return null;
  }

  let duplicates = arry.filter((item, index) => arry.indexOf(item) !== index);
  return duplicates;
};

export { filterObject };
export { removeProperty };
export { addUpdateDate };
export { addCreatedDate };
export { findDuplicates };
export { hasDuplicates };
