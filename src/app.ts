import { ProjectInput } from "./components/project-input";
import { ProjectList } from "./components/project-list";

//JS parses all the typescript before starting the DOM so it will be aware of all the classes, no mather its location
//TODO: abstract so nobody can instantiate the class.

new ProjectInput();
new ProjectList("active");
new ProjectList("finished");
