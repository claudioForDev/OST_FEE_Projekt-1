export class Note {
  constructor({
    id,
    title,
    content,
    completed = false,
    createdAt = Date.now(),
  }) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.completed = completed;
    this.createdAt = createdAt;
  }
}
