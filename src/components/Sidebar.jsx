import React from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      width: "200px",
      background: "#8a7e72",
      color: "#fff",
      padding: "2rem 1rem"
    }}>
      <h4 style={{ marginBottom: "2rem" }}>Menu</h4>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li style={{ marginBottom: "1rem", cursor: "pointer" }} onClick={() => navigate("/dashboard")}>
          Dashboard
        </li>
        <li style={{ marginBottom: "1rem", cursor: "pointer" }} onClick={() => navigate("/me")}>
          Min profil
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
