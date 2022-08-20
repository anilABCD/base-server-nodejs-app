import console from "./console";

// @class-decorators :
function ClasDecroatorExample(constructor: Function) {
  // constructor : console logs : [class IcreamClassComponent]
  // constructor.prototype : console logs : {}

  // console.log(constructor);
  // console.log(constructor.prototype);
  console.decorator("\n@Class Decorator Called\n");
}

// @property-decorator :
function PropertyDecoratorExampleEmoji() {
  return function (target: Object, key: string | symbol) {
    // @ts-ignore
    let val = target[key];

    const getter = () => {
      return val;
    };

    const setter = (next: any) => {
      console.decorator(`${key.toString()}  :updated`);
      val = `🥰  ${val} `;
    };
    console.decorator("\n@Property Decorator Called\n");
  };
}

// @method-decorator :
function MethodDecoratorExampleComfirmable(message: string) {
  return function (
    target: Object,
    key: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    //
    const original = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const allow = true;

      if (allow) {
        // console.log(message + "done" + String(allow));
        const result = original.apply(this, args);
        return result;
      } else {
        return null;
      }
    };

    console.decorator("\n@Method Decorator Called\n");
    return descriptor;
  };
}

let exampleDecorator = {
  ClasDecroatorExample,
  PropertyDecoratorExampleEmoji,
};

@ClasDecroatorExample
class DecoratorExampleClass {
  @PropertyDecoratorExampleEmoji()
  amount: string = "";

  @MethodDecoratorExampleComfirmable("Confirm Payemnt!")
  payment(message: string) {}

  //////
  //
  // For method : expression decorator wont work  ...
  //
  // Works :  payment(message: string) {}
  // Wont Work :  payment2 = (message: string) =>{}
  //
  // Below doesn't work :
  //
  // @MethodDecoratorExampleComfirmable("ehllo")
  // payment2 = (message: string) =>{}
  //
  //////
}

let decoratorExample = new DecoratorExampleClass();
decoratorExample.payment("10000");

export default exampleDecorator;
