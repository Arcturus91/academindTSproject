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
type Listener<T> = (items: T[]) => void; //in listeners we dont need a return.

class State<T> {
  protected listeners: Listener<T>[] = []; //array of function references //protected means it is still not accessible from anywhere but from inside the calss and the classes that inherits.
  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState; //static means the property / method belongs to the class itself rather than to instances of the class.

  private constructor() {
    super();
  }

  /* A private constructor in TypeScript can be used to prevent the instantiation of a class from outside of itself. This can be useful in situations where you only want certain parts of your code to have access to the class, or where you want to ensure that a class can only be instantiated a certain way. */

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
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
//TODO: abstract so nobody can instantiate the class.

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T; //el host element
  element: U; // el elemento que vamos a meter al host

  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    //el simbolo de pregunta hace referencia a que el valor puede ser undefined.
    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement; //esto es typecasting
    this.hostElement = document.getElementById(hostElementId)! as T;
    //aqui lo qe yo estoy haciendo es agarra el elemento que le pasan a la clase componente
    // y asignalo como host element. nada más. Esto se hace desde las clases que lo extienden y le pasanel hostelementid como segundo parámetro.
    //más abajo, en this.attach lo que hago es meter "this.element" al host element. Mira como le haces un insertAdjacentElement.
    console.log("i am host element", this.hostElement);
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    ); //document fragment which its only children is the enclosing node that is inside of a template element.
    this.element = importedNode.firstElementChild as U;
    console.log("i am this elemenbt", this.element); // se refiere al elemento form, section active, section finished. Cada uno de estos es un elemento.
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
  abstract configure(): void;
  abstract renderContent(): void; //el ser abstract method te obliga a que lo implementes en las clases que extienden la clase padre.
}

//ProjectItem class
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> {
  private project: Project; //private properties are normally defined with a _ underscore before the name. The underscore is used to indicate the property / method is private and not intented to be shared outside the class.

  get persons() {
    //a getter is like a function for getting certain values from inside the class. it can even be used for getting values from a private property without exposing the class design. This is called "encapsulation"
    if (this.project.people === 1) {
      return "1 person";
    } else {
      return `${this.project.people} persons`; //template literal
    }
  }

  constructor(hostId: string, project: Project) {
    super("single-project", hostId, false, project.id);
    this.project = project;
    this.configure();
    this.renderContent();
  }

  configure(): void {}

  renderContent(): void {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = this.persons + " assigned."; //nota como accedo al getter como si fuera una propiedad.
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}

//ProjectList class

class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);

    this.assignedProjects = [];
    this.configure();
    this.renderContent();
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;

    listEl.innerHTML = "";

    for (const prjItem of this.assignedProjects) {
      console.log(this.element, "from the for loop");
      new ProjectItem(this.element.querySelector("ul")!.id, prjItem);
    }
  }

  configure(): void {
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
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }
}

//ProjectInput Class
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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

const prjInput = new ProjectInput();
const activePrjList = new ProjectList("active");
const finishedPrjList = new ProjectList("finished");
