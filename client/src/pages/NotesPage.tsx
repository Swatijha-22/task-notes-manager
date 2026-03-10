import { useState, useEffect } from "react";
import { getNotes, createNote, deleteNote, updateNote, summarizeNote } from "../api/api";
import AiPanel from "../components/AiPanel";

function NotesPage({ onLogout }: { onLogout: () => void }) {
  const [notes, setNotes] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // AI state per note  { [noteId]: { loading, summary } }
  const [summaries, setSummaries] = useState<Record<string, { loading: boolean; text: string }>>({});

  const token = localStorage.getItem("token") || "";

  const fetchNotes = async () => {
    const data = await getNotes(token);
    setNotes(data.notes || []);
  };

  useEffect(() => { fetchNotes(); }, []);

  const handleCreate = async () => {
    if (!title || !content) return;
    await createNote(token, title, content);
    setTitle(""); setContent("");
    fetchNotes();
  };

  const handleDelete = async (id: string) => {
    await deleteNote(token, id);
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
    await updateNote(token, editId, title, content);
    setEditId(null); setTitle(""); setContent("");
    fetchNotes();
  };

  const handleSummarize = async (note: any) => {
    const id = note._id;
    setSummaries((prev) => ({ ...prev, [id]: { loading: true, text: "" } }));
    try {
      const data = await summarizeNote(token, note.content);
      setSummaries((prev) => ({ ...prev, [id]: { loading: false, text: data.summary || data.message || "No summary returned." } }));
    } catch {
      setSummaries((prev) => ({ ...prev, [id]: { loading: false, text: "Failed to summarize." } }));
    }
  };

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  const inputStyle = {
    width: "100%", padding: "12px 16px", borderRadius: "8px",
    border: "1px solid #e2e8f0", fontSize: "15px",
    marginBottom: "12px", boxSizing: "border-box" as const,
    outline: "none", fontFamily: "inherit",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f8fc", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div style={{
        background: "white", padding: "16px 32px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <h1 style={{ margin: 0, fontSize: "22px", color: "#1a1a2e", fontWeight: "700" }}>
          📝 NoteApp
        </h1>
        <button onClick={onLogout} style={{
          padding: "8px 20px", borderRadius: "8px", border: "1px solid #e2e8f0",
          background: "white", cursor: "pointer", color: "#666", fontSize: "14px"
        }}>Logout</button>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Create/Edit Box */}
        <div style={{
          background: "white", borderRadius: "12px", padding: "24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: "32px"
        }}>
          <h2 style={{ margin: "0 0 20px 0", fontSize: "18px", color: "#1a1a2e" }}>
            {editId ? "✏️ Edit Note" : "➕ New Note"}
          </h2>
          <input placeholder="Title" value={title}
            onChange={(e) => setTitle(e.target.value)} style={inputStyle} />
          <textarea placeholder="Write your note here..."
            value={content} onChange={(e) => setContent(e.target.value)}
            style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }} />
          <button onClick={editId ? handleUpdate : handleCreate} style={{
            padding: "11px 28px", borderRadius: "8px", border: "none",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white", fontSize: "15px", fontWeight: "600", cursor: "pointer"
          }}>
            {editId ? "Update Note" : "Add Note"}
          </button>
          {editId && (
            <button onClick={() => { setEditId(null); setTitle(""); setContent(""); }}
              style={{
                marginLeft: "12px", padding: "11px 20px", borderRadius: "8px",
                border: "1px solid #e2e8f0", background: "white",
                cursor: "pointer", fontSize: "15px", color: "#666"
              }}>Cancel</button>
          )}
        </div>

        {/* Search */}
        <input placeholder="🔍 Search notes..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          style={{
            ...inputStyle, marginBottom: "24px", background: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
          }} />

        {/* Notes count */}
        <p style={{ color: "#888", fontSize: "14px", marginBottom: "16px" }}>
          {filteredNotes.length} note{filteredNotes.length !== 1 ? "s" : ""}
        </p>

        {/* Notes Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
          {filteredNotes.map((note) => {
            const s = summaries[note._id];
            return (
              <div key={note._id} style={{
                background: "white", borderRadius: "12px", padding: "20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                borderTop: "4px solid #667eea"
              }}>
                <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", color: "#1a1a2e" }}>{note.title}</h3>
                <p style={{ margin: "0 0 16px 0", color: "#555", fontSize: "14px", lineHeight: "1.6" }}>{note.content}</p>
                <p style={{ margin: "0 0 16px 0", color: "#aaa", fontSize: "12px" }}>
                  🕒 {new Date(note.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric"
                  })}
                </p>

                {/* AI Summary area */}
                {s && (
                  <div style={{
                    marginBottom: "14px", padding: "10px 12px",
                    background: "linear-gradient(135deg, #f0f2ff 0%, #faf0ff 100%)",
                    borderRadius: "8px", borderLeft: "3px solid #764ba2",
                  }}>
                    {s.loading ? (
                      <p style={{ margin: 0, color: "#764ba2", fontSize: "13px" }}>✨ Summarizing…</p>
                    ) : (
                      <p style={{ margin: 0, color: "#4a4a6a", fontSize: "13px", whiteSpace: "pre-wrap", lineHeight: "1.55" }}>
                        {s.text}
                      </p>
                    )}
                  </div>
                )}

                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button onClick={() => handleEdit(note)} style={{
                    padding: "7px 16px", borderRadius: "6px", border: "1px solid #667eea",
                    background: "white", color: "#667eea", cursor: "pointer", fontSize: "13px"
                  }}>Edit</button>
                  <button onClick={() => handleDelete(note._id)} style={{
                    padding: "7px 16px", borderRadius: "6px", border: "1px solid #fc8181",
                    background: "white", color: "#fc8181", cursor: "pointer", fontSize: "13px"
                  }}>Delete</button>
                  <button onClick={() => handleSummarize(note)} disabled={s?.loading} style={{
                    padding: "7px 16px", borderRadius: "6px", border: "1px solid #764ba2",
                    background: s?.loading ? "#f0f2ff" : "white",
                    color: "#764ba2", cursor: s?.loading ? "not-allowed" : "pointer", fontSize: "13px",
                  }}>
                    {s?.loading ? "…" : "✨ Summarize"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredNotes.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px", color: "#aaa" }}>
            <p style={{ fontSize: "48px" }}>📭</p>
            <p>{search ? "No notes match your search" : "No notes yet. Create your first note!"}</p>
          </div>
        )}
      </div>

      {/* Floating AI Chat Panel */}
      <AiPanel notes={notes} token={token} />
    </div>
  );
}

export default NotesPage;