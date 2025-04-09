export class UpdateDTO {
  constructor(
    public readonly title: string,
    public readonly subtitle: string,
    public readonly content: string,
    public readonly imgpost: string[]
  ) {}

  static create(object: { [key: string]: any }): [string?, UpdateDTO?] {
    const { title, subtitle, content, imgpost } = object;
    if (!title) {
      return ["El titulo es necesario"];
    }
    if (!subtitle) {
      return ["El subtítulo es necesario"];
    }
    if (!content) {
      return ["El contenido es necesario"];
    }
    return [undefined, new UpdateDTO(title, subtitle, content, imgpost)];
  }
}
