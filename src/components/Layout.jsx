import React from "react";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial, sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <header style={{ background: "#3e3e3e", color: "#fff", padding: "1rem" }}>
          <h2>GDPR-platform</h2>
        </header>

        <main style={{ background: "#f5f5dc", flex: 1, padding: "2rem" }}>
          {children}
        </main>

        <footer style={{ background: "#3e3e3e", color: "#fff", padding: "1rem", textAlign: "center" }}>
          © 2025 Nexpertia | GDPR gjort nemt
        </footer>
      </div>
    </div>
  );
};

export default Layout;
