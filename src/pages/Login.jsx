import React, { useState } from "react";
import axios from "axios";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password
      }, { withCredentials: true });
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("firstLogin", "true");
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f2ef" }}>
      <div className="card" style={{ width: "100%", maxWidth: "400px", padding: "2rem" }}>
        <h2 style={{ marginBottom: "1.5rem", fontSize: "1.5rem", textAlign: "center" }}>Log ind</h2>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Adgangskode"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={login}
          className="btn"
          style={{ marginTop: "1rem", width: "100%" }}
        >
          Log ind
        </button>
      </div>
    </div>
  );
};

export default Login;
