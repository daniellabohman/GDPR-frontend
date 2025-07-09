// src/components/ProfileForm.jsx
import React, { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import "../styles/privacyform.css";

const ProfileForm = () => {
  const [form, setForm] = useState({
    company_name: "",
    website_url: "",
    cvr: "",
    contact_email: ""
  });

  const [loading, setLoading] = useState(false);

  // Hent eksisterende brugerdata
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/auth/me");
        setForm({
          company_name: res.data.company_name || "",
          website_url: res.data.website_url || "",
          cvr: res.data.cvr || "",
          contact_email: res.data.contact_email || ""
        });
      } catch (err) {
        console.error("Kunne ikke hente profiloplysninger");
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put("/auth/me", form);
      alert("Profil opdateret");
    } catch (err) {
      alert("Fejl under opdatering");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="policy-form-container">
      <div className="policy-form-card">
        <h2>Virksomhedsprofil</h2>
        <form onSubmit={handleSubmit} className="policy-form">
          <input
            name="company_name"
            type="text"
            placeholder="Virksomhedsnavn"
            value={form.company_name}
            onChange={handleChange}
            required
          />
          <input
            name="website_url"
            type="text"
            placeholder="Website (https://...)"
            value={form.website_url}
            onChange={handleChange}
          />
          <input
            name="cvr"
            type="text"
            placeholder="CVR-nummer"
            value={form.cvr}
            onChange={handleChange}
          />
          <input
            name="contact_email"
            type="email"
            placeholder="Kontakt-e-mail"
            value={form.contact_email}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Gemmer..." : "Gem ændringer"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
