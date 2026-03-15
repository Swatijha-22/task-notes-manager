import { useState, useRef, useEffect } from "react";
import { chatWithAI } from "../api/api";

interface Message {
    role: "user" | "ai";
    text: string;
}

interface AiPanelProps {
    notes: { title: string; content: string }[];
}

export default function AiPanel({ notes }: AiPanelProps) {
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
            const data = await chatWithAI(msg, notes);
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
                className="fixed bottom-7 right-7 z-50 w-14 h-14 rounded-full border-none bg-gradient-to-r from-purple-600 to-pink-600 text-white text-2xl cursor-pointer shadow-lg hover:shadow-xl hover:scale-110 transition-transform duration-200 flex items-center justify-center"
            >
                {open ? "✕" : "🤖"}
            </button>

            {/* Chat panel */}
            {open && (
                <div className="fixed bottom-24 right-7 z-40 w-96 h-96 bg-white rounded-2xl shadow-2xl flex flex-col font-sans overflow-hidden animate-slide-up">
                    {/* Header */}
                    <div className="px-5 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                        <div className="font-bold text-sm">🤖 AI Assistant</div>
                        <div className="text-xs opacity-85">Ask anything about your notes</div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={`flex ${
                                    m.role === "user" ? "justify-end" : "justify-start"
                                }`}
                            >
                                <div
                                    className={`max-w-xs px-4 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                                        m.role === "user"
                                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-none"
                                            : "bg-purple-100 text-gray-900 rounded-bl-none"
                                    }`}
                                >
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="px-4 py-2 rounded-2xl rounded-bl-none bg-purple-100 text-purple-600 text-sm">
                                    ✨ Thinking…
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <div className="px-4 py-3 border-t border-gray-200 flex gap-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && send()}
                            placeholder="Ask about your notes…"
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 outline-none text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                        />
                        <button
                            onClick={send}
                            disabled={loading || !input.trim()}
                            className={`px-4 py-2 rounded-lg border-none bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold transition ${
                                loading || !input.trim()
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:shadow-lg cursor-pointer"
                            }`}
                        >
                            ↑
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
