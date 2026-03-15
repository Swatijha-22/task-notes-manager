import { useState } from "react";
import { login, setTokens } from "../api/api";

function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const data = await login(email, password);
    setLoading(false);
    if (data.accessToken && data.refreshToken) {
      setTokens(data.accessToken, data.refreshToken);
      onLogin();
    } else {
      setError(data.message || "Login failed");
    }
  };

  const inputStyle = {
    width: "100%", padding: "14px 16px", borderRadius: "10px",
    border: "1.5px solid #e2e8f0", fontSize: "15px",
    marginBottom: "16px", boxSizing: "border-box" as const,
    outline: "none", fontFamily: "inherit", color: "#1a1a2e",
    transition: "border 0.2s",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Inter, -apple-system, sans-serif",
      padding: "24px",
    }}>
      <div style={{
        display: "flex", width: "100%", maxWidth: "900px",
        borderRadius: "24px", overflow: "hidden",
        boxShadow: "0 30px 80px rgba(0,0,0,0.3)",
      }}>
        {/* Left side — branding */}
        <div style={{
          flex: 1, background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)", padding: "60px 48px",
          display: "flex", flexDirection: "column", justifyContent: "center",
          color: "white",
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📝</div>
          <h1 style={{ fontSize: "32px", fontWeight: "800", margin: "0 0 16px 0" }}>NoteApp</h1>
          <p style={{ fontSize: "16px", opacity: 0.85, lineHeight: "1.7", margin: 0 }}>
            Your personal space to capture ideas, tasks, and thoughts — all in one place.
          </p>
          <div style={{ marginTop: "48px" }}>
            {["✅ Secure & Private", "✅ Access anywhere", "✅ Lightning fast"].map(f => (
              <p key={f} style={{ margin: "8px 0", opacity: 0.8, fontSize: "14px" }}>{f}</p>
            ))}
          </div>
        </div>

        {/* Right side — form */}
        <div style={{
          flex: 1, background: "white", padding: "60px 48px",
          display: "flex", flexDirection: "column", justifyContent: "center",
        }}>
          <h2 style={{ margin: "0 0 8px 0", fontSize: "26px", color: "#1a1a2e", fontWeight: "700" }}>
            Welcome back 👋
          </h2>
          <p style={{ margin: "0 0 36px 0", color: "#888", fontSize: "15px" }}>
            Sign in to continue to NoteApp
          </p>

          <label style={{ fontSize: "13px", fontWeight: "600", color: "#555", marginBottom: "6px", display: "block" }}>
            Email address
          </label>
          <input placeholder="you@example.com" value={email}
            onChange={(e) => setEmail(e.target.value)} style={inputStyle} />

          <label style={{ fontSize: "13px", fontWeight: "600", color: "#555", marginBottom: "6px", display: "block" }}>
            Password
          </label>
          <input placeholder="••••••••" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)} style={inputStyle} />

          <button onClick={handleLogin} disabled={loading} style={{
            width: "100%", padding: "14px", borderRadius: "10px", border: "none",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white", fontSize: "16px", fontWeight: "700",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1, marginTop: "8px",
            boxShadow: "0 4px 15px rgba(102,126,234,0.4)",
          }}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>

          {error && (
            <div style={{
              marginTop: "16px", padding: "12px 16px", borderRadius: "8px",
              background: "#fff5f5", border: "1px solid #fc8181", color: "#e53e3e", fontSize: "14px"
            }}>{error}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;