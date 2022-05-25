// ------------------------------------------------------------ Component Base Class (only for extending)
export default abstract class Component<
  T extends HTMLElement,
  U extends HTMLElement
> {
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
