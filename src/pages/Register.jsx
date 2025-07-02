import React, { useState } from "react";
import axios from "axios";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";

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
        website_url: website
      });
      alert("Registered! Now log in.");
      navigate("/");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <Input label="Company" type="text" value={company} onChange={(e) => setCompany(e.target.value)} />
      <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Input label="Website" type="text" value={website} onChange={(e) => setWebsite(e.target.value)} />
      <button onClick={register}>Register</button>
    </div>
  );
};

export default Register;
