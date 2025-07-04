import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo-light.png"; 
import "../styles/global.css";
import Sidebar from "./Sidebar"; 

const Layout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      {/* Header */}
      <header
        style={{
          backgroundColor: "#f4f1ee",
          padding: "1rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 1000
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <img
            src={logo}
            alt="GDPR logo"
            style={{
              height: "60px",
              cursor: "pointer",
              transition: "transform 0.2s"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
          <h1 style={{ fontSize: "1.2rem", color: "#3e3e3e" }}>
            GDPR gjort lettere
          </h1>
        </div>

        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#8a7e72",
            border: "none",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "6px",
            fontSize: "0.95rem",
            cursor: "pointer",
            transition: "background 0.2s"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#6d6157")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#8a7e72")}
        >
          Log ud
        </button>
      </header>


      {/* Sidebar + Main content */}
      {/* Sidebar + Main content */}
      <div style={{ display: "flex" }}>
        <Sidebar />
        <main className="dashboard">
          <div className="container">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
