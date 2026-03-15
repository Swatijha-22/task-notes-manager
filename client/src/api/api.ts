const BASE_URL = "http://localhost:5000";

// Token management functions
export const getAccessToken = () => localStorage.getItem("accessToken");
export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

// Auth functions
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

export const refreshTokens = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    clearTokens();
    window.location.href = "/login";
    throw new Error("Token refresh failed");
  }

  const data = await res.json();
  setTokens(data.accessToken, data.refreshToken);
  return data;
};

export const logout = async () => {
  const refreshToken = getRefreshToken();
  const accessToken = getAccessToken();

  if (accessToken && refreshToken) {
    try {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ refreshToken }),
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  clearTokens();
};

// API Fetch Wrapper with automatic token refresh
export const apiFetch = async (url: string, options: RequestInit = {}) => {
  let finalUrl = url;
  if (!url.startsWith("http")) {
    finalUrl = `${BASE_URL}${url}`;
  }

  // Add auth header if access token exists
  const accessToken = getAccessToken();
  const headers = new Headers(options.headers || {});

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  let response = await fetch(finalUrl, { ...options, headers });

  // If 401, try to refresh token and retry
  if (response.status === 401) {
    try {
      await refreshTokens();
      const newAccessToken = getAccessToken();
      if (newAccessToken) {
        headers.set("Authorization", `Bearer ${newAccessToken}`);
        response = await fetch(finalUrl, { ...options, headers });
      }
    } catch (error) {
      clearTokens();
      window.location.href = "/login";
      throw error;
    }
  }

  return response;
};

// Note functions using apiFetch
export const getNotes = async () => {
  const res = await apiFetch(`/notes`);
  return res.json();
};

export const createNote = async (title: string, content: string) => {
  const res = await apiFetch(`/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, content }),
  });
  return res.json();
};

export const deleteNote = async (id: string) => {
  const res = await apiFetch(`/notes/${id}`, {
    method: "DELETE",
  });
  return res.json();
};

export const updateNote = async (id: string, title: string, content: string) => {
  const res = await apiFetch(`/notes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, content }),
  });
  return res.json();
};

export const summarizeNote = async (content: string) => {
  const res = await apiFetch(`/ai/summarize`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });
  return res.json();
};

export const chatWithAI = async (
  message: string,
  notes: { title: string; content: string }[]
) => {
  const res = await apiFetch(`/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, notes }),
  });
  return res.json();
};
