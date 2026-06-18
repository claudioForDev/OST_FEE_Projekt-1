export function renderNotes(notes, { onToggleCompleted, onEditNote }) {
  const container = document.querySelector(".notes-list");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  notes.forEach((note) => {
    const noteElement = createNoteElement(note, onToggleCompleted, onEditNote);
    container.appendChild(noteElement);
  });
}

function createNoteElement(note, onToggleCompleted, onEditNote) {
  const article = document.createElement("article");
  article.className = `note-card${note.completed ? " note-card--completed" : ""}`;

  const header = document.createElement("header");
  header.className = "note-card__header";

  const title = document.createElement("h3");
  title.className = "note-card__title";
  title.textContent = note.title;

  header.appendChild(title);

  const content = document.createElement("p");
  content.className = "note-card__content";
  content.textContent = note.content;

  const meta = document.createElement("div");
  meta.className = "note-card__meta";

  const importance = document.createElement("p");
  importance.textContent = `Wichtigkeit: ${note.importance}`;

  const dueDate = document.createElement("p");
  dueDate.textContent = note.dueDate
    ? `Fällig bis: ${note.dueDate}`
    : "Kein Fälligkeitsdatum";

  meta.appendChild(importance);
  meta.appendChild(dueDate);

  const footer = document.createElement("footer");
  footer.className = "note-card__footer";

  const editButton = document.createElement("button");
  editButton.className = "btn btn--secondary";
  editButton.textContent = "Bearbeiten";

  editButton.addEventListener("click", () => {
    onEditNote(note.id);
  });

  const toggleButton = document.createElement("button");
  toggleButton.className = "btn btn--primary";
  toggleButton.textContent = note.completed ? "Wieder öffnen" : "Abschliessen";

  toggleButton.addEventListener("click", () => {
    onToggleCompleted(note.id);
  });

  footer.appendChild(editButton);
  footer.appendChild(toggleButton);

  const bottom = document.createElement("div");
  bottom.className = "note-card__bottom";

  bottom.appendChild(meta);
  bottom.appendChild(footer);

  article.appendChild(header);
  article.appendChild(content);
  article.appendChild(bottom);

  return article;
}
