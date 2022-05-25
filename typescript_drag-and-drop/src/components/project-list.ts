import { DragTarget } from "../models/drag-drop-interfaces";
import Component from "../components/base-component";
import { Project, ProjectStatus } from "../models/project";
import { Autobind } from "../decorators/autobind";
import { projectState } from "../states/project-state";
import { ProjectItem } from "./project-item";

// ------------------------------------------------------------ ProjectList Class
export class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    // 初始化空的專案陣列
    this.assignedProjects = [];

    // 執行設置和顯示
    this.configure();
    this.renderContent();
  }

  // Drag and Drop functions
  @Autobind
  dragOverHandler(e: DragEvent) {
    // 檢查此處是否是可以被放下的 (只接受文字)
    if (e.dataTransfer && e.dataTransfer.types[0] === "text/plain") {
      // default: not allowed dropping
      e.preventDefault();
      const listEl = this.element.querySelector("ul")!;
      listEl.classList.add("droppable");
    }
  }

  @Autobind
  dropHandler(e: DragEvent) {
    // 取得丟過來的文字
    const prjId = e.dataTransfer!.getData("text/plain");
    projectState.moveProject(
      prjId,
      this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
    );
  }

  @Autobind
  dragLeaveHandler(_: DragEvent) {
    // 離開區域的時候復原顏色
    const listEl = this.element.querySelector("ul")!;
    listEl.classList.remove("droppable");
  }

  configure() {
    // add drap events
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);
    this.element.addEventListener("drop", this.dropHandler);

    // 傳入事件給 projectState
    projectState.addListener((projects: Project[]) => {
      // 過濾
      const relevantProjects = projects.filter((prj) => {
        if (this.type === "active") {
          return prj.status === ProjectStatus.Active;
        }
        return prj.status === ProjectStatus.Finished;
      });

      this.assignedProjects = relevantProjects;
      // 有東西改變時才會觸發
      this.renderProjects();
    });
  }

  // 顯示內容在標籤上
  renderContent() {
    // 初始化列表
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + "PROJECTS";
  }

  // 列印出專案項目
  private renderProjects() {
    // 取得列表元素
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    // 先清空再加入，可以避免顯示重複內容 (做對比比較耗效能)
    listEl.innerHTML = "";
    // render ProjectItems
    for (const prjItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector("ul")!.id, prjItem);
    }
  }
}
