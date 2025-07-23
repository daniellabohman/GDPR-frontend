import React from "react";
import axios from "../utils/axiosInstance";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import {
  ShieldCheck,
  FileText,
  History,
  User,
  LogOut,
  HelpCircle
} from "lucide-react";
import "../styles/global.css";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
    } catch (err) {
      console.error("Logout fejlede (fortsætter alligevel)");
    }
    localStorage.removeItem("token");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div>
      <header className="header-bar">
        <div className="nav-left">
          <Link to="/" style={{ textDecoration: "none" }}>
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
          {/* Blog vises altid */}
          <Link to="/blog" className={isActive("/blog") ? "active" : ""}>
            Blog
          </Link>

          {isAuthenticated() ? (
            <>
              <Link to="/dashboard" className={isActive("/dashboard") ? "active" : ""}>
                Dashboard
              </Link>
              <Link to="/ai-generator" className={isActive("/ai-generator") ? "active" : ""} style={{ fontWeight: 600 }}>
                AI-generator
              </Link>

              <div className="dropdown">
                <button className="dropbtn">Mere ▾</button>
                <div className="dropdown-content">
                  <Link to="/analyser" className={isActive("/analyser") ? "active" : ""}>
                    <ShieldCheck size={16} style={{ marginRight: 6 }} />
                    GDPR-analyse
                  </Link>
                  <Link to="/privatlivspolitik" className={isActive("/AIGenerator") ? "active" : ""}>
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
            </>
          ) : (
            <>
              <Link to="/login" className="dropbtn">
                Log ind
              </Link>
              <Link to="/register" className="dropbtn">
                Opret konto
              </Link>
            </>
          )}
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
