import { Project, ProjectStatus } from "../models/project";

// ------------------------------------------------------------ Listener Type
type Listener<T> = (items: T[]) => void;

// ------------------------------------------------------------ State Class
class State<T> {
  protected listeners: Listener<T>[] = [];

  // 新增監聽 (列表有更動的時候要做的事)
  addListener(listenFn: Listener<T>) {
    this.listeners.push(listenFn);
  }
}

// ------------------------------------------------------------ Project State Management Class
export class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  // 規定只能建立一次
  private constructor() {
    super();
  }

  static getInstance() {
    // 檢查是否已存在此類別
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  // 新增專案
  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(
      // 也可以用別的東西生成不會重複的 id
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      0
    );
    this.projects.push(newProject);
    // 觸發所有監聽事件
    this.updateListeners();
  }

  // 移動專案 (換狀態)
  moveProject(projectId: string, newStatus: ProjectStatus) {
    // 找到正在移動的元素
    const project = this.projects.find((prj) => prj.id === projectId);
    // 判斷狀態是否應該改變
    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListeners();
    }
  }

  // 更新所有監聽器
  private updateListeners() {
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}
export const projectState = ProjectState.getInstance();
