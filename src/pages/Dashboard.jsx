import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import HistoryList from "../components/HistoryList";
import AnalysisResult from "../components/AnalysisResult";
import "../styles/global.css";

const ScoreBadge = ({ score }) => {
  const getColorClass = () => {
    if (score >= 90) return "score-good";
    if (score >= 70) return "score-medium";
    return "score-bad";
  };

  const label = score >= 90 ? "God" : score >= 70 ? "OK" : "Lav";

  return (
    <span className={`score-badge ${getColorClass()}`}>{label}</span>
  );
};

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [url, setUrl] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
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
      {/* GDPR-analyse input som card */}
      <div className="card">
        <h3>Udfør GDPR-analyse</h3>
        <input
          type="text"
          placeholder="Indtast din hjemmeside-URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button onClick={handleAnalyze} disabled={loading}>
          {loading ? "Analyserer..." : "Analyser"}
        </button>
      </div>

      <div className="analysis-layout">
        {analysis && (
          <AnalysisResult analysis={analysis} withTitle />
        )}

        {/* Tidligere analyser vises altid, også hvis tom */}
        <HistoryList ScoreBadge={ScoreBadge} withTitle />
      </div>
    </Layout>
  );
};

export default Dashboard;
