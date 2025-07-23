import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import { ShieldCheck, SearchCheck, FileText, Zap, Lock } from "lucide-react";
import Layout from "../components/Layout";
import "../styles/global.css";
import { useState } from "react";
import axios from "../utils/axiosInstance"; // brug din instance med baseURL


const Landing = () => {
  const [url, setUrl] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <Layout>
      <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
        <ShieldCheck size={40} color="#2563EB" style={{ marginBottom: "1rem" }} />
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          Gør din hjemmeside GDPR-sikker
        </h1>
        <p style={{ fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto", color: "#555" }}>
          Nexpertia hjælper dig med at analysere, forbedre og sikre din online tilstedeværelse – automatisk, præcist og uden kompleksitet.
        </p>
        <Link to="/login">
          <button style={{ marginTop: "2rem" }}>
            🚀 Kom i gang gratis
          </button>
        </Link>
      </div>
      <div className="card" style={{ marginTop: "2rem", maxWidth: "600px", marginInline: "auto", textAlign: "center" }}>
        <h3 style={{ marginBottom: "1rem" }}> Tjek din hjemmeside gratis</h3>
        <p style={{ marginBottom: "1rem", color: "#555" }}>
          Indtast din URL for at se om du overholder GDPR – helt uden login.
        </p>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!url) return alert("Indtast en URL");
            setLoading(true);
            try {
              const res = await axios.post("/gdpr/analyze", { url });
              setAnalysis(res.data);
              localStorage.setItem("latestAnalysis", JSON.stringify({ url, analysis: res.data }));

            } catch {
              alert("Analyse fejlede. Prøv igen.");
            } finally {
              setLoading(false);
            }
          }}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <input
            type="text"
            placeholder="https://www.eksempel.dk"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              fontSize: "1rem",
              borderRadius: "6px",
              border: "1px solid #ccc"
            }}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Analyserer..." : "🔎 Tjek nu"}
          </button>
        </form>

        {analysis && (
          <div style={{
              marginTop: "1.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#F0FDF4",
              color: "#15803D",
              borderRadius: "8px",
              fontWeight: "bold"
            }}>
              ✅ Din compliance score: {analysis.score}%
            </div>
        )}
      </div>


      <div className="card" style={{ marginTop: "2rem", backgroundColor: "#f9fafb" }}>
        <h2 style={{ textAlign: "center", fontSize: "1.5rem", marginBottom: "1rem" }}>
          Hvorfor vælge Nexpertia?
        </h2>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
          gap: "2rem",
          marginTop: "1rem",
        }}>
          {[
            {
              icon: <SearchCheck size={32} />,
              title: "Automatisk analyse",
              desc: "Opdag GDPR-problemer uden manuel gennemgang.",
            },
            {
              icon: <FileText size={32} />,
              title: "Klar rapport",
              desc: "Du får konkrete anbefalinger – klar til handling.",
            },
            {
              icon: <Zap size={32} />,
              title: "Hurtig start",
              desc: "Indtast din URL og få resultater med det samme.",
            },
            {
              icon: <Lock size={32} />,
              title: "Datasikkerhed først",
              desc: "Vi prioriterer dit privatliv og datasikkerhed.",
            },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ maxWidth: "220px", textAlign: "center" }}>
              <div style={{ marginBottom: "0.5rem", color: "#4F46E5" }}>{icon}</div>
              <h4 style={{ fontSize: "1.1rem", marginBottom: "0.3rem" }}>{title}</h4>
              <p style={{ fontSize: "0.95rem", color: "#555" }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Landing;
