//validation
interface Validatable {
  value: string | number;
  required: boolean;
  minLength: number;
  maxLength: number;
}

function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
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

class ProjectInput {
  element: HTMLFormElement;
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement; //type casting
    this.hostElement = document.getElementById("app")! as HTMLDivElement;

    const importedNode = document.importNode(
      this.templateElement.content,
      true //we add true here to indicate we want to copy even the dependants.
    );
    this.element = importedNode.firstElementChild as HTMLFormElement; //we are getting the form element here
    //this is the form element
    this.element.id = "user-input"; //we asociate the form element to an id so we can pass it properties from app.css

    this.titleInputElement = this.element.querySelector(
      "#title"
    )! as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    )! as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      "#people"
    )! as HTMLInputElement;

    this.configure();
    this.attach(); //remember all constructor function gets executed when class is instantiated.
  }
  //event object is provided by DOM
  //first type is a tuple and second type is void. This means method can either return a tuple or void.
  //notice the union type.
  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;
    /* 
    enteredTitle.trim().length === 0 ||
    enteredDescription.trim().length === 0 ||
    enteredPeople.trim().length === 0 */

    if (
      validate({ value: enteredTitle, required: true, minLength: 5 }) &&
      validate({ value: enteredDescription, required: true, minLength: 5 }) &&
      validate({ value: enteredPeople, required: true, minLength: 5 })
    ) {
      alert("invalid input");
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  private clearInput() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault(); //default behavior is a render of a new page after sending the http request
    //console.log(this); this always makes reference to the context of where the property is called.
    //currently the this is in the context of the event listener which is inside of this.element.
    //therefore console.log(this) returns the form element (whici is this.element.)

    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      console.log(title, desc, people);
      this.clearInput();
    }
  }

  private configure() {
    this.element.addEventListener(
      "submit",
      this.submitHandler /* .bind(this) */
    );
    //the this here refers to the class // so we are binging the this = class to the sumbithandler
    //in an event listener, the second argument is the function we want to call when the event occurs
    //
  }

  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
    //afterbegin: Inserts the element as the first child of the current element.
  }
}

const prjInput = new ProjectInput();
