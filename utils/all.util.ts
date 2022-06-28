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

export { filterObject };
export { removeProperty };
export { addUpdateDate };
export { addCreatedDate };
