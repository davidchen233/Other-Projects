import { Draggable } from "../models/drag-drop-interfaces";
import Component from "../components/base-component";
import { Project } from "../models/project";
import { Autobind } from "../decorators/autobind";

// ------------------------------------------------------------ ProjectItem Class
export class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  private project: Project;

  // 為人數的單數或多數做一個 getter 處理字串
  get persons() {
    if (this.project.people === 1) {
      return "1 person";
    } else {
      return `${this.project.people} persons`;
    }
  }

  constructor(hostId: string, project: Project) {
    super("single-project", hostId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  // Drag and Drop functions
  @Autobind
  dragStartHandler(e: DragEvent) {
    // 拖曳時帶上 projectId
    e.dataTransfer!.setData("text/plain", this.project.id);
    e.dataTransfer!.effectAllowed = "move";
  }
  dragEndHandler(_: DragEvent) {
    console.log("DragEnd");
  }

  configure() {
    // Listen to dragstart Event
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragEndHandler);
  }

  // 列出專案內容
  renderContent() {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = this.persons + " assigned";
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}
