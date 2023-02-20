namespace App {
  //Project State Management
  type Listener<T> = (items: T[]) => void; //in listeners we dont need a return.

  class State<T> {
    protected listeners: Listener<T>[] = []; //array of function references //protected means it is still not accessible from anywhere but from inside the calss and the classes that inherits.
    addListener(listenerFn: Listener<T>) {
      this.listeners.push(listenerFn);
    }
  }

  export class ProjectState extends State<Project> {
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

      this._updateListeners();
    }

    moveProject(projectId: string, newStatus: ProjectStatus) {
      const project = this.projects.find((prj) => prj.id === projectId);
      if (project && project.status !== newStatus) {
        project.status = newStatus;
        this._updateListeners();
      }
    }

    private _updateListeners() {
      for (const listenerFn of this.listeners) {
        listenerFn(this.projects.slice()); //.slice() returns a copy of the original array, in this case, this.projects
      }
    }
  }

  export const projectState = ProjectState.getInstance();
}
