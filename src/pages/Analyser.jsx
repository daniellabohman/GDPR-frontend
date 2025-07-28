import React, { useState, useRef } from "react";
import axios from "../utils/axiosInstance";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import { Globe, Text, UploadCloud, ShieldCheck } from "lucide-react";
import "../styles/global.css";

const Analyser = () => {
  const [url, setUrl] = useState("");
  const [policyText, setPolicyText] = useState("");
  const [textFile, setTextFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [textAnalysis, setTextAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const resultRef = useRef(null);

  const handleURLAnalyze = async () => {
    if (!url) return alert("Indtast en URL");
    setLoading(true);
    try {
      const res = await axios.post("/gdpr/analyze", { url });
      setAnalysis(res.data);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      alert("Analyse fejlede");
    } finally {
      setLoading(false);
    }
  };

  const handleTextAnalyze = async () => {
    if (!policyText.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post("/enhancer/analyze-text", { text: policyText });
      setTextAnalysis(res.data);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      alert("Tekstanalyse fejlede");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setPolicyText(evt.target.result);
    };
    reader.readAsText(file);
    setTextFile(file);
  };

  return (
    <Layout>
      <div className="policy-form-container">

        {/* Intro card */}
        <div className="card" style={{ marginBottom: "2rem", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", justifyContent: "center", marginBottom: "1rem" }}>
            <ShieldCheck size={28} stroke="#2563EB" />
            <div style={{ fontSize: "1.2rem", fontWeight: 600 }}>GDPR-analyseværktøj</div>
          </div>
          <p style={{ maxWidth: "600px", margin: "0 auto", lineHeight: "1.6", color: "#4B5563" }}>
            Her kan du scanne din hjemmeside for GDPR-overholdelse, analysere din privatlivspolitik, 
            og generere en ny – hvis der mangler noget vigtigt.
          </p>
        </div>

        {/* URL Analyse */}
        <div className="card" style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", justifyContent: "center" }}>
            <Globe size={28} stroke="#2563EB" />
            <div>
              <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>Analyse af hjemmeside</div>
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleURLAnalyze();
            }}
            style={{
              marginTop: "1rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            <div style={{ width: "100%", maxWidth: "360px" }}>
              <input
                type="text"
                placeholder="https://www.eksempel.dk"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="form-field"
                style={{
                  width: "100%",
                  textAlign: "center",
                  marginBottom: "1rem"
                }}
              />
            </div>
            <button
              type="submit"
              className="button"
              style={{
                minWidth: "160px",
                backgroundColor: "#2563EB"
              }}
              disabled={loading}
            >
              {loading ? "Analyserer..." : "Start analyse"}
            </button>
          </form>
        </div>

        {/* Tekstanalyse */}
        <div className="card" style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", justifyContent: "center" }}>
            <Text size={28} stroke="#2563EB" />
            <div>
              <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>Analyse af politiktekst</div>
            </div>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleTextAnalyze(); }} className="policy-form" style={{ marginTop: "1rem" }}>
            <div className="upload-center" style={{ textAlign: "center", marginBottom: "1rem" }}>
              <label className="button inline-flex items-center gap-2" style={{ minWidth: "180px", justifyContent: "center", backgroundColor: "#2563EB" }}>
                <UploadCloud size={16} />
                <input type="file" accept=".txt,.md" onChange={handleFileUpload} hidden />
              </label>
            </div>
            <textarea
              rows={8}
              placeholder="Indsæt din nuværende politiktekst her..."
              value={policyText}
              onChange={(e) => setPolicyText(e.target.value)}
              className="form-field"
            />
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <button type="submit" className="button" style={{ minWidth: "180px", backgroundColor: "#2563EB" }} disabled={loading}>
                {loading ? "Analyserer..." : "Analysér tekst"}
              </button>
            </div>
          </form>
        </div>

        {/* Resultatvisning */}
        {(analysis || textAnalysis) && (
          <div ref={resultRef} className="policy-form-card" style={{ marginTop: "2rem" }}>
            {analysis && (
  <>
              <h3>Resultat af URL-analyse</h3>
              <p>
                <strong>Compliance Score:</strong>
                <span className={`score-badge ${
                  analysis.score >= 90 ? "score-good" :
                  analysis.score >= 70 ? "score-medium" :
                  "score-bad"
                }`}>
                  {analysis.score}%
                </span>
              </p>
              <p style={{ marginTop: "0.5rem" }}>
                {analysis.missing?.length > 0
                  ? "Mangler: " + analysis.missing.join(", ")
                  : "Ingen større problemer fundet"}
              </p>
              {analysis.suggestions?.length > 0 && (
                <>
                  <p style={{ marginTop: "1rem", fontWeight: 600 }}>Forslag til forbedring:</p>
                  <ul className="list-disc pl-6 mt-2">
                    {analysis.suggestions.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                  <Link
                    to="/ai-generator"
                    className="button mt-4 full-width text-center"
                    onClick={() => {
                      sessionStorage.setItem("prefill_analysis", JSON.stringify({ type: "url", data: analysis }));
                    }}
                  >
                    Generér privatlivspolitik baseret på analysen
                  </Link>
                </>
              )}
            </>
          )}

          {textAnalysis && (
            <>
              <h3>Analyse af politiktekst</h3>
              <ul className="list-disc pl-6">
                {textAnalysis.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
              <Link
                to="/ai-generator"
                className="button mt-4 full-width text-center"
                onClick={() => {
                  sessionStorage.setItem("prefill_analysis", JSON.stringify({ type: "text", data: policyText }));
                }}
              >
                Forbedr min politik med AI
              </Link>
            </>
          )}

          </div>
        )}
      </div>
    </Layout>
  );
};

export default Analyser;
