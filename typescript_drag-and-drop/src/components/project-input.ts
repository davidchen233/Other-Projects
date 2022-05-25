import Component from "../components/base-component";
import { Autobind } from "../decorators/autobind";
// import { validate, Validatable } from "../utils/validation.js";
import * as Validation from "../utils/validation"; // 做成物件
import { projectState } from "../states/project-state";

// ------------------------------------------------------------ ProjectInput Class
// 設計方式 - 在 constuctor 做初始化宣告，用方法做設置和事件監聽
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
    const titleValidatable: Validation.Validatable = {
      value: enteredTitle,
      required: true,
    };
    const descriptionValidatable: Validation.Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };
    const peopleValidatable: Validation.Validatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 5,
    };
    if (
      !Validation.validate(titleValidatable) ||
      !Validation.validate(descriptionValidatable) ||
      !Validation.validate(peopleValidatable)
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
