import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { createNote, getNotes, deleteNote, updateNote } from "./note.service";

export const create = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    const note = await createNote(userId, title, content);
    res.json({ message: "Note created", note });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAll = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const notes = await getNotes(userId);
    res.json({ notes });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const remove = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const noteId = req.params.id as string;

    const note = await deleteNote(noteId, userId);
    res.json({ message: "Note deleted", note });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const update = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const noteId = req.params.id as string;
    const { title, content } = req.body;

    const note = await updateNote(noteId, userId, title, content);
    res.json({ message: "Note updated", note });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};