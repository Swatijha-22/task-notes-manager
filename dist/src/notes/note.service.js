"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNote = createNote;
exports.getNotes = getNotes;
exports.deleteNote = deleteNote;
exports.updateNote = updateNote;
const note_model_1 = require("../models/note.model");
async function createNote(userId, title, content) {
    const note = await note_model_1.Note.create({
        title,
        content,
        user: userId,
    });
    return note;
}
async function getNotes(userId) {
    const notes = await note_model_1.Note.find({ user: userId });
    return notes;
}
async function deleteNote(noteId, userId) {
    const note = await note_model_1.Note.findOneAndDelete({ _id: noteId, user: userId });
    return note;
}
async function updateNote(noteId, userId, title, content) {
    const note = await note_model_1.Note.findOneAndUpdate({ _id: noteId, user: userId }, { title, content }, { new: true });
    return note;
}
