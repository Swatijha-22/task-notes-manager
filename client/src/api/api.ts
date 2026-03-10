const BASE_URL = "http://localhost:5000";

export const signup = async (email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const login = async (email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const getNotes = async (token: string) => {
  const res = await fetch(`${BASE_URL}/notes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const createNote = async (token: string, title: string, content: string) => {
  const res = await fetch(`${BASE_URL}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content }),
  });
  return res.json();
};

export const deleteNote = async (token: string, id: string) => {
  const res = await fetch(`${BASE_URL}/notes/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const updateNote = async (token: string, id: string, title: string, content: string) => {
  const res = await fetch(`${BASE_URL}/notes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content }),
  });
  return res.json();
};

export const summarizeNote = async (token: string, content: string) => {
  const res = await fetch(`${BASE_URL}/ai/summarize`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
  return res.json();
};

export const chatWithAI = async (
  token: string,
  message: string,
  notes: { title: string; content: string }[]
) => {
  const res = await fetch(`${BASE_URL}/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message, notes }),
  });
  return res.json();
};