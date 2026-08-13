import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <nav className="navbar">
      <div>
        <NavLink to="/customers" className={({ isActive }) => (isActive ? "active" : "")}>Customers</NavLink>
        <NavLink to="/devices" className={({ isActive }) => (isActive ? "active" : "")}>Devices</NavLink>
        <NavLink to="/tickets" className={({ isActive }) => (isActive ? "active" : "")}>Tickets</NavLink>
      </div>
      <div>
        <span style={{ marginRight: 12 }}>{user?.full_name}</span>
        <button onClick={logout}>Log out</button>
      </div>
    </nav>
  );
}
