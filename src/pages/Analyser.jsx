import React, { useState, useEffect, useRef } from "react";
import axios from "../utils/axiosInstance";
import Layout from "../components/Layout";
import "../styles/global.css";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle,
  Info,
  FileText
} from "lucide-react";

const Analyser = () => {
  const [url, setUrl] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savedAnalysis, setSavedAnalysis] = useState(null);
  const resultRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("latestAnalysis");
    const historyList = localStorage.getItem("analysisHistory");
    if (saved) {
      const parsed = JSON.parse(saved);
      setSavedAnalysis(parsed);
      setUrl(parsed.url || "");
      setAnalysis(parsed.analysis || null);
    }
    if (historyList) {
      setHistory(JSON.parse(historyList));
    }
  }, []);

  const handleAnalyze = async () => {
    if (!url) return alert("Indtast en URL");
    setLoading(true);
    try {
      const res = await axios.post("/gdpr/analyze", { url });
      const data = res.data;
      setAnalysis(data);
      const newEntry = { url, analysis: data, timestamp: new Date().toISOString() };
      localStorage.setItem("latestAnalysis", JSON.stringify(newEntry));
      const updatedHistory = [newEntry, ...history].slice(0, 10);
      localStorage.setItem("analysisHistory", JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      alert("Analyse fejlede");
    } finally {
      setLoading(false);
    }
  };

  const handleUseSaved = () => {
    if (savedAnalysis) {
      setUrl(savedAnalysis.url);
      setAnalysis(savedAnalysis.analysis);
      window.location.href = "/generer-dokument";
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "#22C55E";
    if (score >= 70) return "#FACC15";
    return "#EF4444";
  };

  return (
    <Layout>
      <div className="card" style={{ maxWidth: "700px", margin: "0 auto" }}>
        <h2 style={{ marginBottom: "1rem" }}>🔍 Udfør GDPR-analyse</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Indtast din virksomheds eller hjemmesides URL for at tjekke, om den overholder GDPR-krav.
        </p>
        <input
          type="text"
          placeholder="https://www.eksempel.dk"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginBottom: "1rem",
            fontSize: "1rem"
          }}
        />
        <button onClick={handleAnalyze} disabled={loading}>
          {loading ? "Analyserer..." : "🔎 Start analyse"}
        </button>
      </div>

      {analysis && (
        <div ref={resultRef} className="card" style={{ marginTop: "2rem", maxWidth: "700px", margin: "2rem auto" }}>
          <h3>📋 Resultat af seneste analyse</h3>
          <p>
            <strong>Compliance Score:</strong>{" "}
            <span style={{
              backgroundColor: getScoreColor(analysis.score),
              color: "#fff",
              padding: "4px 12px",
              borderRadius: "9999px",
              fontWeight: "bold",
              marginLeft: "0.5rem"
            }}>
              {analysis.score}%
            </span>
          </p>

          <div style={{ marginTop: "1rem" }}>
            <strong>Mangler:</strong>
            {analysis.missing?.length > 0 ? (
              analysis.missing.map((m, i) => (
                <div key={i} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.5rem', minHeight: '40px', lineHeight: '1.4' }}>
                  <AlertTriangle color="#DC2626" size={18} style={{ marginRight: "8px" }} />
                  <span>{m}</span>
                </div>
              ))
            ) : (
              <div style={{ display: "flex", alignItems: "center", color: "#22C55E", marginTop: "0.5rem" }}>
                <CheckCircle size={18} style={{ marginRight: "8px" }} />
                Ingen større problemer fundet
              </div>
            )}
          </div>

          {analysis.suggestions?.length > 0 && (
            <>
              <p style={{ marginTop: "1rem" }}><strong>Forslag til forbedring:</strong></p>
              <ul style={{ paddingLeft: "1.2rem" }}>
                {analysis.suggestions.map((s, i) => (
                  <li key={i} style={{
                    color: 'var(--text-main)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    marginBottom: '0.5rem',
                    background: '#f9fafb',
                    padding: '8px 12px',
                    borderRadius: '6px'
                  }}>
                    <Info color="#EAB308" size={18} style={{ marginRight: "8px" }} />
                    <span style={{ flex: '1 1 auto' }}>{s}</span>
                    <span style={{ marginLeft: "auto", padding: "2px 8px", borderRadius: "6px", fontSize: "0.75rem", backgroundColor: "#EAB308", color: "#fff", whiteSpace: "nowrap" }}>
                      Nice to have
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {analysis.checkedFiles?.length > 0 && (
            <div style={{ marginTop: "1rem" }}>
              <strong>Analyserede elementer:</strong>
              <ul style={{ paddingLeft: "1.2rem" }}>
                {analysis.checkedFiles.map((file, i) => (
                  <li key={i} style={{ color: 'var(--text-main)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <FileText size={18} color="#2563EB" style={{ marginRight: "8px" }} />
                    {file}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {history.length > 0 && (
        <>
          <div className="card" style={{ margin: "2rem auto", maxWidth: "700px" }}>
            {savedAnalysis && (
              <div style={{
                marginBottom: "1rem",
                backgroundColor: "#F3F4F6",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc"
              }}>
                <p style={{ marginBottom: "0.5rem" }}>
                  💾 Der er en tidligere analyse for: <strong>{savedAnalysis.url}</strong>
                </p>
                <button onClick={handleUseSaved} style={{ padding: "6px 12px", borderRadius: "4px", backgroundColor: "#2563EB", color: "white", border: "none" }}>
                  Genbrug analyse
                </button>
              </div>
            )}
            <h3>Tidligere analyser</h3>
            <ul style={{ paddingLeft: "1.2rem" }}>
              {history.map((entry, i) => (
                <li
                  key={i}
                  style={{ color: 'var(--text-main)', cursor: 'pointer', marginBottom: '0.5rem' }}
                  onClick={() => {
                    setUrl(entry.url);
                    setAnalysis(entry.analysis);
                  }}
                >
                  <strong>{entry.url}</strong> – <em>{new Date(entry.timestamp).toLocaleString()}</em>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Link
              to="/politik-historik"
              style={{
                textDecoration: "none",
                padding: "10px 16px",
                borderRadius: "8px",
                backgroundColor: "#2563EB",
                color: "#fff",
                fontWeight: 500,
                display: "inline-block"
              }}
            >
              Gå til politikker
            </Link>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Analyser;