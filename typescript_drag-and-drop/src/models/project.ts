// ------------------------------------------------------------ Project Class
export enum ProjectStatus {
  Active,
  Finished,
}
export class Project {
  // 這邊把屬性設為公開
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}
