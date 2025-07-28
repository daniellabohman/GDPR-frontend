import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import Layout from "../components/Layout";
import { useNavigate, Link } from "react-router-dom";
import AnalysisResult from "../components/AnalysisResult";
import {
  SearchCheck,
  FileText,
  Zap,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import "../styles/global.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [url, setUrl] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [averageScore, setAverageScore] = useState(null);
  const [showIntro, setShowIntro] = useState(() => {
    return localStorage.getItem("firstLogin") === "true";
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get("/auth/me");
        setUser(res.data);
      } catch (err) {
        navigate("/login");
      }
    };
    fetchMe();
  }, [navigate]);

  useEffect(() => {
    const fetchAverageScore = async () => {
      try {
        const res = await axios.get("/me/average-score");
        setAverageScore(res.data.average_score);
      } catch (err) {
        console.error("Kunne ikke hente compliance score");
      }
    };
    fetchAverageScore();
  }, []);

  const getScoreClass = (score) => {
    if (score >= 90) return "score-good";
    if (score >= 70) return "score-medium";
    return "score-bad";
  };

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

  if (!user) return <p>Indlæser dashboard...</p>;

  return (
    <Layout>
      
      {showIntro && (
        <div className="card" style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.3rem", marginBottom: "1rem" }}>🚀 Kom godt i gang</h2>
          <ol style={{ lineHeight: 1.8, paddingLeft: "1.2rem" }}>
            <li>
              <strong>Trin 1:</strong> <Link to="/analyser">Analyser din hjemmeside</Link>
            </li>
            <li>
              <strong>Trin 2:</strong> <Link to="/ai-generator">Generér en privatlivspolitik</Link>
            </li>
            <li>
              <strong>Trin 3:</strong> Download din politik som PDF
            </li>
            <li>
              <strong>Trin 4:</strong> <Link to="/blog">Se nyeste GDPR-ændringer</Link>
            </li>
          </ol>
          <button
            onClick={() => {
              setShowIntro(false);
              localStorage.setItem("firstLogin", "false");
            }}
            style={{
              marginTop: "1rem",
              padding: "10px 16px",
              backgroundColor: "#2563EB",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: 500
            }}
          >
            ✅ Forstået – vis mig ikke igen
          </button>
        </div>
      )}

      {averageScore !== null && (
        <div className="card" style={{ marginBottom: "2rem", textAlign: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <ShieldCheck size={32} color="#2563EB" />
            <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>
              Din gennemsnitlige compliance score
            </div>
            <span className={`score-badge ${getScoreClass(averageScore)}`}>
              {averageScore}%
            </span>
          </div>
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <Link
              to="/analyser"
              className="cta-link"
              style={{
                backgroundColor: "#2563EB",
                color: "#fff",
                padding: "10px 16px",
                borderRadius: "8px",
                fontWeight: 500,
                display: "inline-block",
                textDecoration: "none"
              }}
            >
              Forbedr din score →
            </Link>
          </div>
        </div>
      )}

      <div className="card" style={{ textAlign: "center", padding: "2.5rem" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          Gør din hjemmeside GDPR-kompatibel
        </h1>
        <p style={{ maxWidth: "700px", margin: "0 auto", fontSize: "1.1rem", color: "#555" }}>
          Nexpertia hjælper dig med at analysere din hjemmeside og identificere overtrædelser af GDPR – hurtigt og nemt.
        </p>
      </div>

      <div className="card" style={{ marginBottom: "2rem" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          justifyContent: "center"
        }}>
          <ShieldCheck size={28} stroke="#2563EB" />
          <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>
            Analyse af hjemmeside
          </div>
        </div>

        <form
          style={{
            marginTop: "1rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
          onSubmit={(e) => {
            e.preventDefault();
            handleAnalyze();
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
            style={{ minWidth: "160px", backgroundColor: "#2563EB" }}
            disabled={loading}
          >
            {loading ? "Analyserer..." : "Start analyse"}
          </button>
        </form>
      </div>

      {analysis && (
        <div className="analysis-layout">
          <AnalysisResult analysis={analysis} withTitle />
        </div>
      )}

      {analysis?.missing?.length > 0 && (
        <div className="card" style={{ marginTop: "2rem" }}>
          <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <AlertCircle size={20} /> Manglende punkter i din analyse
          </h3>
          <ul style={{ marginTop: "0.5rem", paddingLeft: "1rem", color: "#B91C1C" }}>
            {analysis.missing.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="card" style={{ marginTop: "2rem", backgroundColor: "#f9fafb", maxWidth: "960px", marginInline: "auto" }}>
        <h2 style={{ textAlign: "center", fontSize: "1.5rem", marginBottom: "1rem" }}>
          Hvorfor bruge Nexpertia?
        </h2>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
          gap: "2rem"
        }}>
          {[
            {
              icon: <SearchCheck size={32} strokeWidth={1.8} />,
              title: "Automatisk analyse",
              desc: "Opdag GDPR-risici uden manuelle tjek."
            },
            {
              icon: <FileText size={32} strokeWidth={1.8} />,
              title: "Klar rapport",
              desc: "Tydelige anbefalinger og konkrete skridt."
            },
            {
              icon: <Zap size={32} strokeWidth={1.8} />,
              title: "Hurtig opsætning",
              desc: "URL + klik = rapport på ét minut."
            },
            {
              icon: <ShieldCheck size={32} strokeWidth={1.8} />,
              title: "Datasikkerhed",
              desc: "Fortrolig og sikker behandling af dine data."
            }
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ maxWidth: "220px", textAlign: "center" }}>
              <div style={{ marginBottom: "0.5rem", color: "#4F46E5" }}>{icon}</div>
              <h4>{title}</h4>
              <p style={{ fontSize: "0.95rem", color: "#555" }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <Link
          to="/politik-historik"
          style={{
            textDecoration: "none",
            padding: "12px 20px",
            borderRadius: "8px",
            backgroundColor: "#2563EB",
            color: "#fff",
            fontWeight: 500
          }}
        >
          Se dine tidligere politikker
        </Link>
      </div>
    </Layout>
  );
};

export default Dashboard;
