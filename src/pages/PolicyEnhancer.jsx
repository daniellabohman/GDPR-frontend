import React, { useState } from "react";
import Layout from "../components/Layout";
import axios from "../utils/axiosInstance";

const PolicyEnhancer = () => {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post("/api/enhancer/analyze-text", { text });
      setSuggestions(res.data.recommendations);
    } catch (err) {
      alert("Noget gik galt med analysen");
    } finally {
      setLoading(false);
    }
  };

  const goToGenerator = () => {
    sessionStorage.setItem("prefill_content", text);
    window.location.href = "/ai-generator";
  };

  return (
    <Layout>
      <div className="card" style={{ maxWidth: 800, margin: "2rem auto", padding: "2rem" }}>
        <h1 className="text-2xl font-bold mb-4">🧾 Forbedr din politiktekst</h1>

        <textarea
          rows={10}
          className="form-field"
          placeholder="Indsæt din nuværende politiktekst her..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "1rem",
            fontFamily: "inherit"
          }}
        />

        <button
          onClick={handleAnalyze}
          disabled={loading}
          style={{
            marginTop: "1rem",
            padding: "10px 18px",
            borderRadius: "8px",
            backgroundColor: "#1E3A8A",
            color: "white",
            fontWeight: 500,
            border: "none",
            cursor: "pointer"
          }}
        >
          {loading ? "Analyserer..." : "🔍 Analyser tekst"}
        </button>

        {suggestions && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">🔧 Anbefalinger:</h2>
            <ul style={{ paddingLeft: "1.5rem", lineHeight: 1.6 }}>
              {suggestions.map((rec, i) => (
                <li key={i}>✔️ {rec}</li>
              ))}
            </ul>
            <button
              style={{
                marginTop: "1.5rem",
                padding: "10px 16px",
                backgroundColor: "#2563EB",
                color: "#fff",
                borderRadius: "8px",
                fontWeight: 500,
                cursor: "pointer",
                border: "none"
              }}
              onClick={goToGenerator}
            >
              Gå til AI Generatoren for forbedring →
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PolicyEnhancer;
