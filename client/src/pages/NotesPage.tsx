import { useState, useEffect } from "react";
import { getNotes, createNote, deleteNote, updateNote, summarizeNote, logout } from "../api/api";
import AiPanel from "../components/AiPanel";

function NotesPage({ onLogout }: { onLogout: () => void }) {
  const [notes, setNotes] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // AI state per note  { [noteId]: { loading, summary } }
  const [summaries, setSummaries] = useState<Record<string, { loading: boolean; text: string }>>({});

  const fetchNotes = async () => {
    const data = await getNotes();
    setNotes(data.notes || []);
  };

  useEffect(() => { fetchNotes(); }, []);

  const handleCreate = async () => {
    if (!title || !content) return;
    await createNote(title, content);
    setTitle(""); setContent("");
    fetchNotes();
  };

  const handleDelete = async (id: string) => {
    await deleteNote(id);
    setSummaries((prev) => { const next = { ...prev }; delete next[id]; return next; });
    fetchNotes();
  };

  const handleEdit = (note: any) => {
    setEditId(note._id);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleUpdate = async () => {
    if (!editId) return;
    await updateNote(editId, title, content);
    setEditId(null); setTitle(""); setContent("");
    fetchNotes();
  };

  const handleSummarize = async (note: any) => {
    const id = note._id;
    setSummaries((prev) => ({ ...prev, [id]: { loading: true, text: "" } }));
    try {
      const data = await summarizeNote(note.content);
      setSummaries((prev) => ({ ...prev, [id]: { loading: false, text: data.summary || data.message || "No summary returned." } }));
    } catch {
      setSummaries((prev) => ({ ...prev, [id]: { loading: false, text: "Failed to summarize." } }));
    }
  };

  const handleLogout = async () => {
    await logout();
    onLogout();
  };

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">📝 NoteApp</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Create/Edit Box */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {editId ? "✏️ Edit Note" : "➕ New Note"}
          </h2>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          />
          <textarea
            placeholder="Write your note here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 min-h-24 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition resize-vertical"
          />
          <div className="flex gap-3">
            <button
              onClick={editId ? handleUpdate : handleCreate}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition"
            >
              {editId ? "Update Note" : "Add Note"}
            </button>
            {editId && (
              <button
                onClick={() => {
                  setEditId(null);
                  setTitle("");
                  setContent("");
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Search */}
        <input
          placeholder="🔍 Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
        />

        {/* Notes count */}
        <p className="text-gray-600 text-sm mb-6">
          {filteredNotes.length} note{filteredNotes.length !== 1 ? "s" : ""}
        </p>

        {/* Notes Grid */}
        {filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => {
              const s = summaries[note._id];
              return (
                <div
                  key={note._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition border-t-4 border-purple-600 p-6"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{note.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{note.content}</p>
                  <p className="text-gray-400 text-xs mb-4">
                    🕒{" "}
                    {new Date(note.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>

                  {/* AI Summary area */}
                  {s && (
                    <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-600 rounded-lg">
                      {s.loading ? (
                        <p className="m-0 text-purple-700 text-sm font-medium">✨ Summarizing…</p>
                      ) : (
                        <p className="m-0 text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                          {s.text}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => handleEdit(note)}
                      className="px-3 py-2 text-sm font-medium text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(note._id)}
                      className="px-3 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleSummarize(note)}
                      disabled={s?.loading}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition ${
                        s?.loading
                          ? "text-gray-400 border border-gray-200 bg-gray-50 cursor-not-allowed"
                          : "text-purple-600 border border-purple-300 hover:bg-purple-50"
                      }`}
                    >
                      {s?.loading ? "…" : "✨ Summarize"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-gray-500 font-medium">
              {search ? "No notes match your search" : "No notes yet. Create your first note!"}
            </p>
          </div>
        )}
      </main>

      {/* Floating AI Chat Panel */}
      <AiPanel notes={notes} />
    </div>
  );
}

export default NotesPage;