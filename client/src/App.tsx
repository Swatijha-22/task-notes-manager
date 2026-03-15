import { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NotesPage from "./pages/NotesPage";

function App() {
  const [page, setPage] = useState<"login" | "signup" | "notes">("login");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      setPage("notes");
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {page === "login" && (
        <div className="min-h-screen flex flex-col items-center justify-center">
          <LoginPage onLogin={() => setPage("notes")} />
          <div className="mt-8 text-center text-gray-600">
            <p>
              No account?{" "}
              <button
                onClick={() => setPage("signup")}
                className="text-purple-600 font-semibold hover:text-purple-700 transition"
              >
                Sign up here
              </button>
            </p>
          </div>
        </div>
      )}
      {page === "signup" && (
        <div className="min-h-screen flex flex-col items-center justify-center">
          <SignupPage onSignup={() => setPage("login")} />
          <div className="mt-8 text-center text-gray-600">
            <p>
              Already have an account?{" "}
              <button
                onClick={() => setPage("login")}
                className="text-purple-600 font-semibold hover:text-purple-700 transition"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      )}
      {page === "notes" && (
        <NotesPage
          onLogout={() => {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            setPage("login");
          }}
        />
      )}
    </div>
  );
}

export default App;