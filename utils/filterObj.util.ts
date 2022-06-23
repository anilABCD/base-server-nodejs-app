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

export default filterObject;
