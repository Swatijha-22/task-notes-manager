import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NotesPage from "./pages/NotesPage";

function App() {
  const [page, setPage] = useState<"login" | "signup" | "notes">(
    localStorage.getItem("token") ? "notes" : "login"
  );

  return (
    <div>
      {page === "login" && (
        <>
          <LoginPage onLogin={() => setPage("notes")} />
          <p style={{ paddingLeft: "40px" }}>
            No account? <button onClick={() => setPage("signup")}>Signup</button>
          </p>
        </>
      )}
      {page === "signup" && (
        <>
          <SignupPage onSignup={() => setPage("login")} />
          <p style={{
            position: "fixed", bottom: "24px", left: "50%",
            transform: "translateX(-50%)",
            color: "white", fontSize: "15px", textAlign: "center"
          }}>
            Already have an account?{" "}
            <span onClick={() => setPage("login")}
              style={{ textDecoration: "underline", cursor: "pointer", fontWeight: "600" }}>
              Sign In
            </span>
          </p>
        </>
      )}
      {page === "notes" && (
        <NotesPage onLogout={() => {
          localStorage.removeItem("token");
          setPage("login");
        }} />
      )}
    </div>
  );
}

export default App;