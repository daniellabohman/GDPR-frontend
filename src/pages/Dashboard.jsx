import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [url, setUrl] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, {
        withCredentials: true
      });
    } catch (err) {
      console.error("Logout-fejl", err);
    }
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me");
        setUser(res.data);
      } catch (err) {
        navigate("/");
      }
    };
    fetchMe();
  }, [navigate]);

  const handleAnalyze = async () => {
    if (!url) return alert("Indtast en URL");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/gdpr/analyze", { url });
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
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h2>Hej, {user.company}</h2>
        <p>Du er logget ind som: {user.email}</p>

        <div style={{
          marginTop: "2rem",
          background: "#fff",
          padding: "1.5rem",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}>
          <h3>GDPR-analyse</h3>
          <input
            type="text"
            placeholder="Indtast din hjemmeside-URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{
              padding: "12px",
              width: "70%",
              maxWidth: "400px",
              borderRadius: "6px",
              border: "1px solid #ccc"
            }}
          />
          <button
            onClick={handleAnalyze}
            style={{
              marginLeft: "10px",
              padding: "12px 24px",
              backgroundColor: "#3e3e3e",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            {loading ? "Analyserer..." : "Analyser"}
          </button>

          {analysis && (
            <div style={{
              marginTop: "2rem",
              background: "#f3f3f3",
              padding: "1.5rem",
              borderRadius: "12px",
              borderLeft: "6px solid #8a7e72"
            }}>
              <h4>Compliance Score: {analysis.score}%</h4>
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
        </div>

        <button
          onClick={logout}
          style={{
            marginTop: "3rem",
            padding: "10px 20px",
            backgroundColor: "#8a7e72",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Log ud
        </button>
      </div>
    </Layout>
  );
};

export default Dashboard;
