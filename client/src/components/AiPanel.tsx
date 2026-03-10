import { useState, useRef, useEffect } from "react";
import { chatWithAI } from "../api/api";

interface Message {
    role: "user" | "ai";
    text: string;
}

interface AiPanelProps {
    notes: { title: string; content: string }[];
    token: string;
}

export default function AiPanel({ notes, token }: AiPanelProps) {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        { role: "ai", text: "👋 Hi! Ask me anything about your notes — like \"What tasks do I have?\" or \"Summarize my notes about work\"." },
    ]);
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, open]);

    const send = async () => {
        const msg = input.trim();
        if (!msg || loading) return;
        setInput("");
        setMessages((prev) => [...prev, { role: "user", text: msg }]);
        setLoading(true);
        try {
            const data = await chatWithAI(token, msg, notes);
            setMessages((prev) => [...prev, { role: "ai", text: data.reply || data.message || "Sorry, I couldn't process that." }]);
        } catch {
            setMessages((prev) => [...prev, { role: "ai", text: "Something went wrong. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating button */}
            <button
                onClick={() => setOpen((o) => !o)}
                title="AI Assistant"
                style={{
                    position: "fixed", bottom: "28px", right: "28px", zIndex: 1000,
                    width: "56px", height: "56px", borderRadius: "50%", border: "none",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white", fontSize: "24px", cursor: "pointer",
                    boxShadow: "0 4px 20px rgba(102,126,234,0.5)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
                {open ? "✕" : "🤖"}
            </button>

            {/* Chat panel */}
            {open && (
                <div style={{
                    position: "fixed", bottom: "96px", right: "28px", zIndex: 999,
                    width: "360px", height: "480px",
                    background: "white", borderRadius: "16px",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
                    display: "flex", flexDirection: "column",
                    fontFamily: "Inter, sans-serif", overflow: "hidden",
                    animation: "slideUp 0.2s ease",
                }}>
                    {/* Header */}
                    <div style={{
                        padding: "16px 20px",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                    }}>
                        <div style={{ fontWeight: "700", fontSize: "15px" }}>🤖 AI Assistant</div>
                        <div style={{ fontSize: "12px", opacity: 0.85 }}>Ask anything about your notes</div>
                    </div>

                    {/* Messages */}
                    <div style={{
                        flex: 1, overflowY: "auto", padding: "16px",
                        display: "flex", flexDirection: "column", gap: "10px",
                    }}>
                        {messages.map((m, i) => (
                            <div key={i} style={{
                                display: "flex",
                                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                            }}>
                                <div style={{
                                    maxWidth: "80%", padding: "10px 14px", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                                    background: m.role === "user" ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "#f0f2ff",
                                    color: m.role === "user" ? "white" : "#1a1a2e",
                                    fontSize: "13.5px", lineHeight: "1.55",
                                    whiteSpace: "pre-wrap",
                                }}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div style={{ display: "flex", justifyContent: "flex-start" }}>
                                <div style={{
                                    padding: "10px 16px", borderRadius: "16px 16px 16px 4px",
                                    background: "#f0f2ff", color: "#667eea", fontSize: "13px",
                                }}>
                                    ✨ Thinking…
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <div style={{
                        padding: "12px 16px", borderTop: "1px solid #e2e8f0",
                        display: "flex", gap: "8px",
                    }}>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && send()}
                            placeholder="Ask about your notes…"
                            style={{
                                flex: 1, padding: "10px 14px", borderRadius: "10px",
                                border: "1px solid #e2e8f0", outline: "none",
                                fontSize: "13.5px", fontFamily: "inherit",
                            }}
                        />
                        <button
                            onClick={send}
                            disabled={loading || !input.trim()}
                            style={{
                                padding: "10px 16px", borderRadius: "10px", border: "none",
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                color: "white", cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                                opacity: loading || !input.trim() ? 0.6 : 1,
                                fontSize: "14px", fontWeight: "600",
                            }}
                        >
                            ↑
                        </button>
                    </div>
                </div>
            )}

            <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </>
    );
}
