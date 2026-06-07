export function renderNotes(notes, { onToggleCompleted }) {
  const container = document.querySelector(".notes-list");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  notes.forEach((note) => {
    const noteElement = createNoteElement(note, onToggleCompleted);
    container.appendChild(noteElement);
  });
}

function createNoteElement(note, onToggleCompleted) {
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

  const footer = document.createElement("footer");
  footer.className = "note-card__footer";

  const editButton = document.createElement("button");
  editButton.className = "btn btn--secondary";
  editButton.textContent = "Bearbeiten";

  const toggleButton = document.createElement("button");
  toggleButton.className = "btn btn--primary";
  toggleButton.textContent = note.completed ? "Wieder öffnen" : "Abschliessen";

  toggleButton.addEventListener("click", () => {
    onToggleCompleted(note.id);
  });

  footer.appendChild(editButton);
  footer.appendChild(toggleButton);

  article.appendChild(header);
  article.appendChild(content);
  article.appendChild(footer);

  return article;
}
