// Project Type
enum ProjectStatus {
  Active,
  Finished,
}
class Project {
  // 這邊把屬性設為公開
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

// Listener Type
type Listener<T> = (items: T[]) => void;

// State Class
class State<T> {
  protected listeners: Listener<T>[] = [];

  // 新增監聽 (列表有更動的時候要做的事)
  addListener(listenFn: Listener<T>) {
    this.listeners.push(listenFn);
  }
}

// ------------------------------------------------------------ Project State Management Class
class ProjectState extends State<Project> {
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
    for (const listenFn of this.listeners) {
      // 使用複製出來的 (避免從外部更動到原本的陣列)
      listenFn(this.projects.slice());
    }
  }
}

const projectState = ProjectState.getInstance();

// ------------------------------------------------------------ Validation
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}
function validate(validatableInput: Validatable) {
  // 驗證有錯誤時會變 false
  let isValid = true;
  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }
  if (
    validatableInput.minLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length >= validatableInput.minLength;
  }
  if (
    validatableInput.maxLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length <= validatableInput.maxLength;
  }
  // 檢查 min 和 max 前記得把數字字串轉為數字
  if (
    validatableInput.min != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }
  if (
    validatableInput.max != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value <= validatableInput.max;
  }
  return isValid;
}

// ------------------------------------------------------------ Autobind Decorator (method decorator)
function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}

// ------------------------------------------------------------ Component Base Class (only for extending)
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    // 選用的屬性記得放最後
    newElementId?: string
  ) {
    // 取得此 template 元素
    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    // 把 template 顯示出來的地方
    this.hostElement = document.getElementById(hostElementId)! as T;

    // import 欲顯示的列表 section
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as U;
    // 幫元素加上 id (for css)
    if (newElementId) {
      this.element.id = newElementId;
    }

    this.attach(insertAtStart);
  }

  // 執行顯示
  private attach(insertAtBeginning: boolean) {
    // 把內容放進指定位置 insertAdjacentElement(元素的位置, 要放的東西)
    this.hostElement.insertAdjacentElement(
      insertAtBeginning ? "afterbegin" : "beforeend",
      this.element
    );
  }

  // 必須存在，由延伸的 class 自行加上去
  abstract configure(): void;
  abstract renderContent(): void;
}

// ------------------------------------------------------------ ProjectItem Class
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> {
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

  configure() {}

  // 列出專案內容
  renderContent() {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = this.persons + " assigned";
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}

// ------------------------------------------------------------ ProjectList Class
class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    // 初始化空的專案陣列
    this.assignedProjects = [];

    // 執行設置和顯示
    this.configure();
    this.renderContent();
  }

  configure() {
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

// ------------------------------------------------------------ ProjectInput Class
// 設計方式 - 在 constuctor 做初始化宣告，用方法做設置和事件監聽
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputELement: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");

    // 取得表單裡面的輸入
    this.titleInputElement = this.element.querySelector(
      "#title"
    )! as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    )! as HTMLInputElement;
    this.peopleInputELement = this.element.querySelector(
      "#people"
    )! as HTMLInputElement;

    // 執行設置和顯示
    this.configure();
    this.renderContent();
  }

  // 綁定設置
  configure() {
    // 記得用 bind 把事件的 this 綁定到 class 上
    this.element.addEventListener("submit", this.submitHandler);
  }

  // 因為在 base component 上面規定一定要有
  renderContent() {}

  // 取得表單輸入內容
  private gatherUserInputs(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputELement.value;

    // 驗證
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
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 5,
    };
    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert("Invalid input, please try again!");
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  // 清空表單
  private clearInputs() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputELement.value = "";
  }

  // 表單 submit 事件
  @Autobind
  private submitHandler(e: Event) {
    e.preventDefault();
    // 取得表單輸入內容
    const userInput = this.gatherUserInputs(); // type: tuple | undefined
    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput;
      projectState.addProject(title, description, people);
      this.clearInputs();
    }
  }
}

const prjInput = new ProjectInput();
const activePrjList = new ProjectList("active");
const finishedPrjList = new ProjectList("finished");
