import React, { useState } from "react";
import axios from "../utils/axiosInstance";
import "../styles/privacyform.css";

const PrivacyPolicyForm = () => {
  const [form, setForm] = useState({
    virksomhed_navn: "",
    email: "",
    lokation: "",
    branche: "",
    brugertyper: "",
    kontaktformular: false,
    nyhedsbrev: false,
    webshop: false,
    cookies: false,
  });

  const [generatedHtml, setGeneratedHtml] = useState(null);
  const [generatedId, setGeneratedId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/gdpr/policy/generate", form);
      setGeneratedHtml(res.data.html);
      setGeneratedId(res.data.id); // vigtig: gem id separat til PDF
    } catch (err) {
      alert("Fejl under generering af politik");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const token = localStorage.getItem("token");
    window.open(
      `http://localhost:5000/api/gdpr/policy/${generatedId}/pdf?token=${token}`,
      "_blank"
    );
  };

  return (
    <div className="policy-form-container">
      <div className="policy-form-card">
        <h2>Generér privatlivspolitik</h2>
        <form onSubmit={handleSubmit} className="policy-form">
          <input
            name="virksomhed_navn"
            type="text"
            placeholder="Virksomhedsnavn"
            value={form.virksomhed_navn}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Kontakt-e-mail"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="lokation"
            type="text"
            placeholder="Lokation (by, land)"
            value={form.lokation}
            onChange={handleChange}
          />
          <input
            name="branche"
            type="text"
            placeholder="Branche"
            value={form.branche}
            onChange={handleChange}
          />
          <input
            name="brugertyper"
            type="text"
            placeholder="Brugertyper (fx privatkunder)"
            value={form.brugertyper}
            onChange={handleChange}
          />

          <div className="policy-checkboxes">
            <label>
              <input
                type="checkbox"
                name="kontaktformular"
                checked={form.kontaktformular}
                onChange={handleChange}
              />
              Kontaktformular
            </label>
            <label>
              <input
                type="checkbox"
                name="nyhedsbrev"
                checked={form.nyhedsbrev}
                onChange={handleChange}
              />
              Nyhedsbrev
            </label>
            <label>
              <input
                type="checkbox"
                name="webshop"
                checked={form.webshop}
                onChange={handleChange}
              />
              Webshop
            </label>
            <label>
              <input
                type="checkbox"
                name="cookies"
                checked={form.cookies}
                onChange={handleChange}
              />
              3rd-party cookies
            </label>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Genererer..." : "Generér politik"}
          </button>
        </form>
      </div>

      {generatedHtml && (
        <div className="policy-form-card" style={{ marginTop: "2rem" }}>
          <h3>Din privatlivspolitik</h3>
          <div dangerouslySetInnerHTML={{ __html: generatedHtml }} />

          {generatedId && (
            <button
              onClick={handleDownload}
              className="download-btn"
              style={{ marginTop: "1rem" }}
            >
              📥 Download som PDF
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PrivacyPolicyForm;
