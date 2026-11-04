const form = document.querySelector("#note-form");
const idField = document.querySelector("#note-id");
const titleField = document.querySelector("#note-title");
const textField = document.querySelector("#note-text");
const statusField = document.querySelector("#note-status");
const saveButton = document.querySelector("#save-button");
const searchField = document.querySelector("#search-field");
const notesContainer = document.querySelector("#notes-container");

let allNotes = JSON.parse(localStorage.getItem("uzrasai")) || [];

function saveToStorage() {
  localStorage.setItem("uzrasai", JSON.stringify(allNotes));
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function statusOptions(current) {
  const statuses = ["aktyvus", "atlikta", "svarbu"];
  let options = "";
  for (let i = 0; i < statuses.length; i++) {
    const selected = statuses[i] === current ? "selected" : "";
    options += `<option value="${statuses[i]}" ${selected}>${statuses[i]}</option>`;
  }
  return options;
}

function showNotes() {
  const query = searchField.value.trim().toLowerCase();
  let html = "";

  for (let i = 0; i < allNotes.length; i++) {
    const note = allNotes[i];
    const matches =
      note.title.toLowerCase().includes(query) ||
      note.text.toLowerCase().includes(query);

    if (matches) {
      html += `
        <article class="card ${note.status}">
          <h3>${escapeHtml(note.title)}</h3>
          <div class="date">${note.createdAt}</div>
          <p>${escapeHtml(note.text)}</p>
          <div class="actions">
            <select data-action="status" data-id="${note.id}">
              ${statusOptions(note.status)}
            </select>
            <button data-action="edit" data-id="${note.id}">Redaguoti</button>
            <button class="delete-btn" data-action="delete" data-id="${note.id}">Ištrinti</button>
          </div>
        </article>
      `;
    }
  }

  notesContainer.innerHTML = html || "<p>Užrašų nerasta.</p>";
}

function findNote(id) {
  return allNotes.find(function (note) {
    return note.id === id;
  });
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  if (idField.value === "") {
    allNotes.push({
      id: Date.now(),
      title: titleField.value,
      text: textField.value,
      createdAt: new Date().toLocaleString("lt-LT"),
      status: statusField.value
    });
  } else {
    const note = findNote(Number(idField.value));
    note.title = titleField.value;
    note.text = textField.value;
    note.status = statusField.value;
  }

  saveToStorage();
  showNotes();
  form.reset();
  idField.value = "";
  saveButton.textContent = "Pridėti";
});

notesContainer.addEventListener("click", function (event) {
  const action = event.target.dataset.action;
  const id = Number(event.target.dataset.id);

  if (action === "delete") {
    allNotes = allNotes.filter(function (note) {
      return note.id !== id;
    });
    saveToStorage();
    showNotes();
  }

  if (action === "edit") {
    const note = findNote(id);
    idField.value = note.id;
    titleField.value = note.title;
    textField.value = note.text;
    statusField.value = note.status;
    saveButton.textContent = "Išsaugoti";
    titleField.focus();
  }
});

notesContainer.addEventListener("change", function (event) {
  if (event.target.dataset.action === "status") {
    const note = findNote(Number(event.target.dataset.id));
    note.status = event.target.value;
    saveToStorage();
    showNotes();
  }
});

searchField.addEventListener("input", showNotes);

showNotes();
