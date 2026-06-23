export class Note {
  constructor({
    _id,
    title,
    content,
    completed = false,
    createdAt = Date.now(),
    importance = 3,
    dueDate = null,
  }) {
    this._id = _id;
    this.title = title;
    this.content = content;
    this.completed = completed;
    this.createdAt = createdAt;
    this.importance = importance;
    this.dueDate = dueDate;
  }
}
