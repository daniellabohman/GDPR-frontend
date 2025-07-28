import React, { useState } from "react";
import axios from "../utils/axiosInstance";
import Layout from "../components/Layout";
import { useEffect } from "react";

import "../styles/privacyform.css";
import {
  FileText,
  Mail,
  Building,
  MapPin,
  Briefcase,
  Users,
  ToggleLeft,
  Download,
  ShieldCheck
} from "lucide-react";

const mapMissingToForm = (missing = []) => {
  return {
    kontaktformular: missing.includes("Kontaktformular"),
    nyhedsbrev: missing.includes("Nyhedsbrev"),
    webshop: missing.includes("Webshop"),
    cookies: missing.includes("Cookiepolitik"),
    trackingværktøjer: missing.includes("Cookiepolitik") ? "Google Analytics" : "",
    fritekst_beskrivelse: "Baseret på analyse – følgende områder var utilstrækkelige: " + missing.join(", ")
  };
};


const AIGenerator = () => {
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
    trackingværktøjer: "",
    databehandlere: "",
    opbevaringsperiode: "",
    målgruppe: "",
    særlige_hensyn: "",
    fritekst_beskrivelse: ""
  });

  const [generatedHtml, setGeneratedHtml] = useState(null);
  const [generatedId, setGeneratedId] = useState(null);
  const [loading, setLoading] = useState(false);


useEffect(() => {
  const saved = sessionStorage.getItem("prefill_analysis");
  if (!saved) return;

  const { type, data } = JSON.parse(saved);

  if (type === "url") {
    const updates = mapMissingToForm(data.missing);
    setForm((prev) => ({ ...prev, ...updates }));
  }

  if (type === "text") {
    setForm((prev) => ({
      ...prev,
      fritekst_beskrivelse: data,
    }));
  }

  sessionStorage.removeItem("prefill_analysis");
}, []);



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
      setGeneratedId(res.data.id);
    } catch (err) {
      alert("Fejl under generering af politik");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/gdpr/policy/${generatedId}/pdf`, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `privatlivspolitik_${generatedId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Kunne ikke hente PDF – måske din login-session er udløbet.");
    }
  };

  const exampleSuggestions = {
    trackingværktøjer: ["Google Analytics", "Meta Pixel"],
    databehandlere: ["Mailchimp", "Stripe"],
    opbevaringsperiode: ["12 måneder", "24 måneder"]
  };

  return (
    <Layout>
      <div className="policy-form-container">
        <div className="policy-form-card">
          <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <ShieldCheck size={20} /> Generér GDPR-dokument
          </h2>

          <form onSubmit={handleSubmit} className="policy-form">
            <textarea
              className="form-field"
              name="fritekst_beskrivelse"
              placeholder="Skriv en kort beskrivelse af din virksomhed, fx: 'Vi er en webshop med kontaktformular og nyhedsbrev'"
              value={form.fritekst_beskrivelse}
              onChange={handleChange}
              rows={3}
            />

            <input className="form-field" name="virksomhed_navn" type="text" placeholder="Virksomhedsnavn" value={form.virksomhed_navn} onChange={handleChange} required />
            <input className="form-field" name="email" type="email" placeholder="Kontakt-e-mail" value={form.email} onChange={handleChange} required />
            <input className="form-field" name="lokation" type="text" placeholder="Lokation (by, land)" value={form.lokation} onChange={handleChange} />
            <input className="form-field" name="branche" type="text" placeholder="Branche" value={form.branche} onChange={handleChange} />
            <input className="form-field" name="brugertyper" type="text" placeholder="Brugertyper (fx privatkunder, erhverv)" value={form.brugertyper} onChange={handleChange} />
            <input className="form-field" name="målgruppe" type="text" placeholder="Primær målgruppe (fx danske brugere, EU)" value={form.målgruppe} onChange={handleChange} />

            <textarea className="form-field" name="trackingværktøjer" placeholder="Hvilke trackingværktøjer bruges? (fx Google Analytics, Meta Pixel)" value={form.trackingværktøjer} onChange={handleChange} />
            <div className="suggestions">
              {exampleSuggestions.trackingværktøjer.map((s, i) => (
                <span key={i} className="suggestion-chip" onClick={() => setForm({ ...form, trackingværktøjer: s })}>{s}</span>
              ))}
            </div>

            <textarea className="form-field" name="databehandlere" placeholder="Nævn eksterne databehandlere (fx Mailchimp, Stripe)" value={form.databehandlere} onChange={handleChange} />
            <div className="suggestions">
              {exampleSuggestions.databehandlere.map((s, i) => (
                <span key={i} className="suggestion-chip" onClick={() => setForm({ ...form, databehandlere: s })}>{s}</span>
              ))}
            </div>

            <textarea className="form-field" name="opbevaringsperiode" placeholder="Hvor længe opbevares data typisk? (fx 12 mdr)" value={form.opbevaringsperiode} onChange={handleChange} />
            <div className="suggestions">
              {exampleSuggestions.opbevaringsperiode.map((s, i) => (
                <span key={i} className="suggestion-chip" onClick={() => setForm({ ...form, opbevaringsperiode: s })}>{s}</span>
              ))}
            </div>

            <textarea className="form-field" name="særlige_hensyn" placeholder="Evt. særlige forhold (fx følsomme data, børn)" value={form.særlige_hensyn} onChange={handleChange} />

            <div className="policy-checkboxes">
              <label><input type="checkbox" name="kontaktformular" checked={form.kontaktformular} onChange={handleChange} /> Kontaktformular</label>
              <label><input type="checkbox" name="nyhedsbrev" checked={form.nyhedsbrev} onChange={handleChange} /> Nyhedsbrev</label>
              <label><input type="checkbox" name="webshop" checked={form.webshop} onChange={handleChange} /> Webshop</label>
              <label><input type="checkbox" name="cookies" checked={form.cookies} onChange={handleChange} /> 3rd-party cookies</label>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Genererer..." : "Generér politik"}
            </button>
          </form>
        </div>

        {generatedHtml && (
          <div className="policy-form-card" style={{ marginTop: "2rem" }}>
            <h3>Din politik</h3>
            <div dangerouslySetInnerHTML={{ __html: generatedHtml }} />
            {generatedId && (
              <button onClick={handleDownload} className="download-btn" style={{ marginTop: "1rem" }}>
                <Download size={16} style={{ marginRight: 6, verticalAlign: "middle" }} />
                Download som PDF
              </button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AIGenerator;
