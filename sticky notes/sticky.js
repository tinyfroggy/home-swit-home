const notesContainer = document.getElementById('app');
const addNoteBtn = document.querySelector('.add-note');

getNots().forEach(note => {
    const element = createNoteElement(note.id , note.content);
    notesContainer.insertBefore(element, addNoteBtn)
});

addNoteBtn.addEventListener("click" , () => {
    addNote()
})

// getNots
function getNots() {
    return JSON.parse(localStorage.getItem("stickyNotes") || "[]");
}
// saveNots
function saveNots(notes) {
    localStorage.setItem("stickyNotes", JSON.stringify(notes));
}
// createNoteElement
function createNoteElement(id, content) {
    const element = document.createElement("textarea");
    element.spellcheck = false;
    element.classList.add("note-text");
    element.value = content;
    element.placeholder = 'Enter Your Note Or Your Goal Here...';

    element.addEventListener("change", () => {
        updateNote(id, element.value);
    })

    element.addEventListener("dblclick", () => {
        const bool = confirm("Are you sure you want to delete the note?");
        if (bool) {
            deleteNote(id, element)
        }
    })

    return element
}
// addNote
function addNote() {
    const notes = getNots();
    const noteObj = {
        id: Math.floor(Math.random() * 10000),
        content: ""
    }

    const noteElement = createNoteElement(noteObj.id , noteObj.content);
    notesContainer.insertBefore(noteElement , addNoteBtn);

    notes.push(noteObj);
    saveNots(notes);
}
// updateNote
function updateNote(id, newContent) {
    const notes = getNots();
    const targetNote = notes.find(note => note.id === id);
    targetNote.content = newContent
    saveNots(notes);
}
// deleteNote
function deleteNote(id,  element) {
    const notes = getNots().filter(note => note.id != id);
    saveNots(notes);
    notesContainer.removeChild(element);
}