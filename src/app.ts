/// <reference path="components/project-input.ts" />
/// <reference path="components/project-list.ts" />

namespace App {
  //JS parses all the typescript before starting the DOM so it will be aware of all the classes, no mather its location
  //TODO: abstract so nobody can instantiate the class.

  new ProjectInput();
  new ProjectList("active");
  new ProjectList("finished");
}
