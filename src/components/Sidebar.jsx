import React from "react";
import { NavLink } from "react-router-dom";
import logoIcon from "../assets/logo-light.png";

const Sidebar = () => {
  const linkStyle = {
    display: "block",
    padding: "10px 15px",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "8px",
    transition: "background 0.3s"
  };

  const activeStyle = {
    background: "#6d6157"
  };

  return (
    <aside style={{
      width: "220px",
      background: "#8a7e72",
      color: "#fff",
      padding: "2rem 1rem",
      height: "100vh",
      marginTop: "72px"
    }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
      <h4 style={{ marginBottom: "3rem", fontSize: "1.1rem" }}>Navigation</h4>
      </div>
      <nav>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li style={{ marginBottom: "1rem" }}>
            <NavLink
              to="/dashboard"
              style={({ isActive }) => ({
                ...linkStyle,
                ...(isActive ? activeStyle : {})
              })}
            >
              <img src={logoIcon} alt="Dashboard" style={{ width: "18px", marginRight: "8px", verticalAlign: "middle" }} />
              Dashboard
            </NavLink>
          </li>
          <li style={{ marginBottom: "1rem" }}>
            <NavLink
              to="/profile"
              style={({ isActive }) => ({
                ...linkStyle,
                ...(isActive ? activeStyle : {})
              })}
            >
              <img src={logoIcon} alt="Profil" style={{ width: "18px", marginRight: "8px", verticalAlign: "middle" }} />
              Min profil
            </NavLink>
          </li>
          <li style={{ marginBottom: "1rem" }}>
            <NavLink
              to="/analyser"
              style={({ isActive }) => ({
                ...linkStyle,
                ...(isActive ? activeStyle : {})
              })}
            >
              <img src={logoIcon} alt="Mine analyser" style={{ width: "18px", marginRight: "8px", verticalAlign: "middle" }} />
              Mine analyser
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
