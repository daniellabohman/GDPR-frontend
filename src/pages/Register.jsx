import React, { useState } from "react";
import axios from "axios";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";

const Register = () => {
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [website, setWebsite] = useState("");
  const navigate = useNavigate();

  const register = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        company_name: company,
        email,
        password,
        website_url: website,
      });
      alert("Du er nu registreret – log venligst ind.");
      navigate("/login");
    } catch (err) {
      alert("Registrering fejlede – tjek oplysningerne.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f5f2ef"
    }}>
      <div className="card" style={{ width: "100%", maxWidth: "420px", padding: "2rem" }}>
        <h2 style={{ marginBottom: "1.5rem", fontSize: "1.5rem", textAlign: "center" }}>
          Opret konto
        </h2>

        <Input
          label="Virksomhedsnavn"
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
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
        <Input
          label="Website (valgfrit)"
          type="text"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />

        <button
          onClick={register}
          className="btn"
          style={{ marginTop: "1rem", width: "100%" }}
        >
          Opret konto
        </button>
      </div>
    </div>
  );
};

export default Register;
