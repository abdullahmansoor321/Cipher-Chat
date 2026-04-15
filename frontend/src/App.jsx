import { Navigate, Route, Routes } from "react-router";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import PageLoader from "./components/PageLoader";
import { Toaster } from "react-hot-toast";

function App() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();
  useEffect(() => { checkAuth(); }, [checkAuth]);
  if (isCheckingAuth) return <PageLoader />;

  return (
    <div>
      <Routes>
        <Route path="/"       element={authUser ? <ChatPage />  : <Navigate to="/login" />} />
        <Route path="/login"  element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
      </Routes>

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: "#0f0f13",
            color: "#e4e4e7",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "14px",
            fontSize: "13px",
            fontWeight: "500",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            fontFamily: "'Inter', sans-serif",
          },
          success: {
            iconTheme: { primary: "#f59e0b", secondary: "#000" },
          },
        }}
      />
    </div>
  );
}
export default App;
