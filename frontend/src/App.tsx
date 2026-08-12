import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import CustomersPage from "./pages/CustomersPage";
import DevicesPage from "./pages/DevicesPage";
import TicketsPage from "./pages/TicketsPage";

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <div className="app-shell">
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Everything below requires a valid token (ProtectedRoute redirects to /login otherwise) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/devices" element={<DevicesPage />} />
            <Route path="/tickets" element={<TicketsPage />} />
          </Route>

          <Route path="/" element={<Navigate to="/customers" replace />} />
          <Route path="*" element={<Navigate to="/customers" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}
