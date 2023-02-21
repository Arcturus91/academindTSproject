import Component from "./base-component";
import { Draggable } from "../models/drag-drop";
import { Project } from "../models/project";
import { autobind } from "../decorator/autobind";

//ProjectItem class :nota como podemos extender la clase desde un padre y podemos implementar una interfaz; es decir, indicar que seguiremos un contrato.
export class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
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

  @autobind
  dragStartHandler(event: DragEvent): void {
    console.log("drag start", event);
    event.dataTransfer!.setData("text/plain", this.project.id);
    event.dataTransfer!.effectAllowed = "move";
  }
  dragEndHandler(event: DragEvent): void {
    console.log("drag end", event);
  }

  configure(): void {
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragEndHandler);
  }

  //The this keyword inside an event listener refers to the element that the event listener is attached to. Always remember

  renderContent(): void {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = this.persons + " assigned."; //nota como accedo al getter como si fuera una propiedad.
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}
