namespace App {
  export function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
    const originalmethod = descriptor.value; //descriptor.value refers to the original method
    const adjDescriptor: PropertyDescriptor = {
      configurable: true,
      get() {
        //a getter is a special kind of property that allows you to execute some code when a property is accessed.
        const boundFn = originalmethod.bind(this);
        return boundFn;
      },
    };
    return adjDescriptor;
  }
}
