import console from "./console";

// @class-decorators :
function ClasDecroatorExample(constructor: Function) {
  // constructor : console logs : [class IcreamClassComponent]
  // constructor.prototype : console logs : {}

  console.log(constructor);
  console.log(constructor.prototype);

  //   Object.freeze(constructor);
  //   Object.freeze(constructor.prototype);
}

let exampleDecorator = {
  ClasDecroatorExample,
};

export default exampleDecorator;
