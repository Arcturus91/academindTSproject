//Drag and drop interfaces
namespace App {
   export interface Draggable {
        dragStartHandler(event: DragEvent): void;
        dragEndHandler(event: DragEvent): void;
      }
      
      //recuerda que al usar interfaces, obligas a la clase a tener dichas propiedades o métodos.
      
      export interface DragTarget {
        dragOverHandler(event: DragEvent): void;
        dropHandler(event: DragEvent): void;
        dragLeaveHandler(event: DragEvent): void;
      }

}



