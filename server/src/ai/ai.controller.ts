import { Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AuthRequest } from "../middleware/auth.middleware";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/** POST /ai/summarize
 *  body: { content: string }
 *  Returns a bullet-point summary of the note content.
 */
export const summarize = async (req: AuthRequest, res: Response) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: "content is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Summarize the following note in 3-5 concise bullet points. Be brief and clear. Only return the bullet points, no extra text.\n\nNote:\n${content}`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    res.json({ summary });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "AI summarization failed" });
  }
};

/** POST /ai/chat
 *  body: { message: string, notes: Array<{ title: string; content: string }> }
 *  Returns an AI answer grounded in the user's notes.
 */
export const chat = async (req: AuthRequest, res: Response) => {
  try {
    const { message, notes } = req.body;
    if (!message) {
      return res.status(400).json({ message: "message is required" });
    }

    const notesContext =
      Array.isArray(notes) && notes.length > 0
        ? notes
            .map((n: { title: string; content: string }, i: number) =>
              `Note ${i + 1} – "${n.title}":\n${n.content}`
            )
            .join("\n\n")
        : "No notes available.";

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are a helpful assistant for a notes app. The user's notes are listed below. Answer the user's question based on their notes. Be concise and friendly.\n\n--- User Notes ---\n${notesContext}\n\n--- User Question ---\n${message}`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    res.json({ reply });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "AI chat failed" });
  }
};
