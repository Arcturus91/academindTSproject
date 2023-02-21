export default abstract class Component<
  T extends HTMLElement,
  U extends HTMLElement
> {
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

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    ); //document fragment which its only children is the enclosing node that is inside of a template element.
    this.element = importedNode.firstElementChild as U;
    // se refiere al elemento form, section active, section finished. Cada uno de estos es un elemento.
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
