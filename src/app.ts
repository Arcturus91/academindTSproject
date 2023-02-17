//Project type

enum ProjectStatus {
  Active,
  Finished,
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

//Project State Management
type Listener = (items: Project[]) => void; //in listeners we dont need a return.
class ProjectState {
  private listeners: Listener[] = []; //array of function references
  private projects: Project[] = [];
  private static instance: ProjectState; //static means the property / method belongs to the class itself rather than to instances of the class.

  private constructor() {}

  /* A private constructor in TypeScript can be used to prevent the instantiation of a class from outside of itself. This can be useful in situations where you only want certain parts of your code to have access to the class, or where you want to ensure that a class can only be instantiated a certain way. */

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addListener(listenerFn: Listener) {
    this.listeners.push(listenerFn);
  }
  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.Active
    );
    this.projects.push(newProject);

    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

const projectState = ProjectState.getInstance();

//validation
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatableInput: Validatable) {
  let isValid = true;
  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }
  if (
    validatableInput.minLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length > validatableInput.minLength;
  }

  if (
    validatableInput.maxLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length < validatableInput.maxLength;
  }

  if (
    validatableInput.min != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value > validatableInput.min;
  }

  if (
    validatableInput.max != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value < validatableInput.max;
  }

  return isValid;
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
//JS parses all the typescript before starting the DOM so it will be aware of all the classes, no mather its location
//abstract so nobody can instantiate the class.

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    //el simbolo de pregunta hace referencia a que el valor puede ser undefined.

    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId)! as T;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    ); //document fragment which its only children is the enclosing node that is inside of a template element.
    this.element = importedNode.firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }

    this.attach(insertAtStart);
  }

  private attach(insertAtBeginning: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtBeginning ? "afterbegin" : "beforeend",
      this.element
    );
  }

  abstract configure() : void
  abstract renderContent():void

}

class ProjectList extends Component{

  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    this.assignedProjects = [];

    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((prj) => {
        if (this.type === "active") {
          return prj.status === ProjectStatus.Active;
        }
        return prj.status === ProjectStatus.Finished;
      });
      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });

    this.renderContent();
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;

    listEl.innerHTML = "";

    for (const prjItem of this.assignedProjects) {
      const listItem = document.createElement("li");
      listItem.textContent = prjItem.title;
      listEl.appendChild(listItem);
    }
  }

  private renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }
}

//ProjectInput Class
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
    //this.templateElement.content refers to a document fragment that includes what is inside the template.
    const importedNode = document.importNode(
      this.templateElement.content,
      true //we add true here to indicate we want to copy even the dependants.
    ); //importedNode is a document fragment.

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
const activePrjList = new ProjectList("active");
const finishedPrjList = new ProjectList("finished");
