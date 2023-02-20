/// <reference path="base-component.ts" />
/// <reference path="../util/validation.ts" />
/// <reference path="../decorator/autobind.ts" />
/// <reference path="../state/project.ts" />

namespace App {
  //ProjectInput Class
  export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;
    constructor() {
      super("project-input", "app", true, "user-input");

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
    }

    configure() {
      this.element.addEventListener(
        "submit",
        this.submitHandler /* .bind(this) */
      );
      //the this here refers to the class // so we are binging the this = class to the sumbithandler
      //in an event listener, the second argument is the function we want to call when the event occurs
      //
    }

    renderContent(): void {}

    //event object is provided by DOM
    //first type is a tuple and second type is void. This means method can either return a tuple or void.
    //notice the union type.
    private gatherUserInput(): [string, string, number] | void {
      const enteredTitle = this.titleInputElement.value;
      const enteredDescription = this.descriptionInputElement.value;
      const enteredPeople = this.peopleInputElement.value;

      const titleValidatable: Validatable = {
        value: enteredTitle,
        required: true,
      };

      const descriptionValidatable: Validatable = {
        value: enteredDescription,
        required: true,
        minLength: 5,
      };

      const peopleValidatable: Validatable = {
        value: enteredPeople,
        required: true,
        min: 1,
        max: 5,
      };

      if (
        !validate(titleValidatable) ||
        !validate(descriptionValidatable) ||
        !validate(peopleValidatable)
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

        projectState.addProject(title, desc, people);
        this.clearInput();
      }
    }
  }
}
