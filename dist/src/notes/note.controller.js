"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.remove = exports.getAll = exports.create = void 0;
const note_service_1 = require("./note.service");
const create = async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.user.id;
        const note = await (0, note_service_1.createNote)(userId, title, content);
        res.json({ message: "Note created", note });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.create = create;
const getAll = async (req, res) => {
    try {
        const userId = req.user.id;
        const notes = await (0, note_service_1.getNotes)(userId);
        res.json({ notes });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.getAll = getAll;
const remove = async (req, res) => {
    try {
        const userId = req.user.id;
        const noteId = req.params.id;
        const note = await (0, note_service_1.deleteNote)(noteId, userId);
        res.json({ message: "Note deleted", note });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.remove = remove;
const update = async (req, res) => {
    try {
        const userId = req.user.id;
        const noteId = req.params.id;
        const { title, content } = req.body;
        const note = await (0, note_service_1.updateNote)(noteId, userId, title, content);
        res.json({ message: "Note updated", note });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.update = update;
