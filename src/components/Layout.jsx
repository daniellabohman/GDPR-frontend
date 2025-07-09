import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo-light.png";
import "../styles/global.css";

const Layout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      {/* Header navigation */}
      <header className="header-bar">
        <div className="nav-left">
          <Link to="/dashboard">
            <img src={logo} alt="GDPR logo" className="nav-logo" />
          </Link>
          <h1 className="nav-title">GDPR gjort lettere</h1>
        </div>

        <nav className="nav-right">
          <div className="dropdown">
            <button className="dropbtn">Menu ▾</button>
            <div className="dropdown-content">
              <Link to="/dashboard">Analyse</Link>
              <Link to="/privatlivspolitik">Dokumenter</Link>
              <Link to="/profile">Min profil</Link>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
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
