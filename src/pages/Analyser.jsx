import React, { useState } from "react";
import axios from "../utils/axiosInstance";
import Layout from "../components/Layout";
import "../styles/global.css";

const Analyser = () => {
  const [url, setUrl] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!url) return alert("Indtast en URL");
    setLoading(true);
    try {
      const res = await axios.post("/gdpr/analyze", { url });
      setAnalysis(res.data);
    } catch (err) {
      alert("Analyse fejlede");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Analyse input card */}
      <div className="card">
        <h3>🔍 Udfør GDPR-analyse</h3>
        <input
          type="text"
          placeholder="Indtast din hjemmeside-URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button onClick={handleAnalyze} disabled={loading}>
          {loading ? "Analyserer..." : "Udfør analyse"}
        </button>
      </div>

      {/* Resultat kort */}
      {analysis && (
        <div className="card">
          <h4>📋 Resultat af seneste analyse</h4>
          <p><strong>Compliance Score:</strong> {analysis.score}%</p>
          {analysis.missing?.length > 0 ? (
            <p><strong>Mangler:</strong> {analysis.missing.join(", ")}</p>
          ) : (
            <p><strong>Mangler:</strong> Ingen større problemer fundet 🎉</p>
          )}
          <p><strong>Forslag:</strong></p>
          <ul>
            {analysis.suggestions?.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </Layout>
  );
};

export default Analyser;
