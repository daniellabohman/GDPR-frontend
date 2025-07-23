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
  ArrowRightCircle
} from "lucide-react";
import "../styles/global.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [url, setUrl] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [averageScore, setAverageScore] = useState(null);
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
        const res = await axios.get("/gdpr/me/average-score");
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

  const getScoreMessage = (score) => {
    if (score >= 90) return "Fantastisk! Du er næsten fuldt compliant.";
    if (score >= 70) return "Godt på vej – men der er plads til forbedring.";
    return "Lav score – du bør tage action nu.";
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
      {averageScore !== null && (
        <div className="card" style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "0.5rem" }}>
            Din gennemsnitlige compliance score
          </div>
          <div className={`score-badge ${getScoreClass(averageScore)}`} style={{ display: "inline-block", fontSize: "1.1rem" }}>
            {averageScore}%
          </div>
          <p style={{ marginTop: "0.5rem", color: "#555" }}>{getScoreMessage(averageScore)}</p>
          <Link to="/analyser" style={{ marginTop: "1rem", display: "inline-block", textDecoration: "none", padding: "10px 16px", backgroundColor: "#2563EB", color: "white", borderRadius: "6px" }}>
            Forbedr min score <ArrowRightCircle size={16} style={{ marginLeft: 6, verticalAlign: "middle" }} />
          </Link>
        </div>
      )}

      <div className="card" style={{ textAlign: "center", padding: "2.5rem" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          Gør din hjemmeside GDPR-kompatibel
        </h1>
        <p style={{ maxWidth: "700px", margin: "0 auto", fontSize: "1.1rem", color: "#555" }}>
          Nexpertia hjælper dig med hurtigt at analysere din hjemmeside for overtrædelser af persondataforordningen. 
          Du får konkrete anbefalinger, bedre compliance og ro i maven – alt sammen med ét klik.
        </p>
      </div>

      <div className="card" style={{ marginTop: "2rem", backgroundColor: "#f9fafb" }}>
        <h2 style={{ textAlign: "center", fontSize: "1.5rem", marginBottom: "1rem" }}>
          Derfor vælger virksomheder Nexpertia
        </h2>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
          gap: "2rem",
          marginTop: "1rem",
        }}>
          {[{
            icon: <SearchCheck size={32} strokeWidth={1.8} />,
            title: "Automatisk analyse",
            desc: "Identificer GDPR-risici på din hjemmeside uden manuelle tjek."
          }, {
            icon: <FileText size={32} strokeWidth={1.8} />,
            title: "Klar rapport",
            desc: "Få tydelige anbefalinger og konkrete næste skridt til compliance."
          }, {
            icon: <Zap size={32} strokeWidth={1.8} />,
            title: "Hurtig opsætning",
            desc: "Indtast din URL og få en rapport på under ét minut."
          }, {
            icon: <ShieldCheck size={32} strokeWidth={1.8} />,
            title: "Datasikkerhed",
            desc: "Dine oplysninger behandles fortroligt og sikkert."
          }].map(({ icon, title, desc }) => (
            <div key={title} style={{ maxWidth: "220px", textAlign: "center" }}>
              <div style={{ marginBottom: "0.5rem", color: "#4F46E5" }}>{icon}</div>
              <h4 style={{ fontSize: "1.1rem", marginBottom: "0.3rem" }}>{title}</h4>
              <p style={{ fontSize: "0.95rem", color: "#555" }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginTop: "2rem", maxWidth: "600px", marginInline: "auto" }}>
        <h3 style={{ marginBottom: "1rem" }}>🔍 Analyser din hjemmeside</h3>
        <p style={{ marginBottom: "1rem", color: "#555" }}>
          Indtast en URL og få en automatiseret GDPR-analyse med det samme.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="text"
            placeholder="https://www.eksempel.dk"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{
              width: "100%",
              height: "44px",
              padding: "10px 14px",
              fontSize: "1rem",
              borderRadius: "6px",
              border: "1px solid #ccc"
            }}
          />

          <button
            onClick={handleAnalyze}
            disabled={loading}
            style={{
              width: "100%",
              height: "44px",
              fontSize: "1rem",
              fontWeight: "bold",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#1E3A8A",
              color: "#fff",
              cursor: "pointer"
            }}
          >
            {loading ? "Analyserer..." : "🔎 Analyser"}
          </button>
        </div>
      </div>

      {analysis && (
        <div className="analysis-layout">
          <AnalysisResult analysis={analysis} withTitle />
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <Link
          to="/politik-historik"
          style={{
            textDecoration: "none",
            padding: "12px 20px",
            borderRadius: "8px",
            backgroundColor: "#2563EB",
            color: "#fff",
            fontWeight: 500,
            display: "inline-block"
          }}
        >
          Se dine tidligere politikker
        </Link>
      </div>
    </Layout>
  );
};

export default Dashboard;
