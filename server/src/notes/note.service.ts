import { Note } from "../models/note.model";

export async function createNote(userId: string, title: string, content: string) {
  const note = await Note.create({
    title,
    content,
    user: userId,
  });
  return note;
}

export async function getNotes(userId: string) {
  const notes = await Note.find({ user: userId });
  return notes;
}

export async function deleteNote(noteId: string, userId: string) {
  const note = await Note.findOneAndDelete({ _id: noteId, user: userId });
  return note;
}

export async function updateNote(noteId: string, userId: string, title: string, content: string) {
  const note = await Note.findOneAndUpdate(
    { _id: noteId, user: userId },
    { title, content },
    { new: true }
  );
  return note;
}