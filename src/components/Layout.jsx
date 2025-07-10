import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShieldCheck,
  FileText,
  History,
  User,
  LogOut,
  Globe,
  LayoutDashboard,
  Sparkles,
  HelpCircle
} from "lucide-react";
import logo from "../assets/logo-light.png";
import "../styles/global.css";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div>
      {/* Header navigation */}
      <header className="header-bar">
        <div className="nav-left">
          <Link to="/dashboard" style={{ textDecoration: "none" }}>
            <span style={{
              fontSize: "1.5rem",
              fontWeight: 600,
              letterSpacing: "-0.5px",
              color: "#1f2937",
              fontFamily: "'Segoe UI', 'Inter', sans-serif"
            }}>
              Nexpertia<span style={{ color: "#2563EB" }}>.</span>
            </span>
          </Link>
        </div>

        <nav className="nav-right">
          <Link to="/dashboard" className={isActive("/dashboard") ? "active" : ""}>
            Dashboard
          </Link>
          <Link to="/ai-generator" className={isActive("/ai-generator") ? "active" : ""} style={{ fontWeight: 600 }}>
            AI-generator
          </Link>
          <Link to="/blog" className={isActive("/blog") ? "active" : ""}>
            Blog
          </Link>

          <div className="dropdown">
            <button className="dropbtn">Mere ▾</button>
            <div className="dropdown-content">
              <Link to="/analyser" className={isActive("/analyser") ? "active" : ""}>
                <ShieldCheck size={16} style={{ marginRight: 6 }} />
                GDPR-analyse
              </Link>
              <Link to="/privatlivspolitik" className={isActive("/privatlivspolitik") ? "active" : ""}>
                <FileText size={16} style={{ marginRight: 6 }} />
                Privatlivspolitik
              </Link>
              <Link to="/politik-historik" className={isActive("/politik-historik") ? "active" : ""}>
                <History size={16} style={{ marginRight: 6 }} />
                Historik
              </Link>
              <Link to="/profile" className={isActive("/profile") ? "active" : ""}>
                <User size={16} style={{ marginRight: 6 }} />
                Min profil
              </Link>
              <Link to="/support" className={isActive("/support") ? "active" : ""}>
                <HelpCircle size={16} style={{ marginRight: 6 }} />
                Support
              </Link>
            </div>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={16} style={{ marginRight: 6, verticalAlign: "middle" }} />
            Log ud
          </button>
        </nav>
      </header>

      <main className="dashboard">
        <div className="container">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
