import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import Layout from "../components/Layout";

const PolicyHistory = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHtml, setSelectedHtml] = useState(null);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await axios.get("/gdpr/policy/history");
        setPolicies(res.data);
      } catch (err) {
        alert("Kunne ikke hente historik");
      } finally {
        setLoading(false);
      }
    };
    fetchPolicies();
  }, []);

  const handleDownload = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/gdpr/policy/${id}/pdf`, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `privatlivspolitik_${id}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Download fejlede");
    }
  };

  const handleView = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/gdpr/policy/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setSelectedHtml(res.data.html_output);
    } catch {
      alert("Kunne ikke hente politik");
    }
  };

  return (
    <Layout>
      <div style={{ textAlign: "center", marginTop: "2rem", marginBottom: "2rem" }}>
        <a href="/dashboard" style={{ textDecoration: "underline", color: "#2563EB" }}>
          ← Tilbage til dashboard
        </a>
      </div>

      <div className="card">
        <h2>Din politik-historik</h2>
        {loading ? (
          <p>Henter data...</p>
        ) : policies.length === 0 ? (
          <p>Ingen tidligere politikker fundet.</p>
        ) : (
          <div className="history-grid">
            {policies.map((p) => (
              <div key={p.id} className="card">
                <p style={{ fontWeight: 600 }}>{p.virksomhed_navn}</p>
                <p className="timestamp">
                  Genereret: {new Date(p.created_at).toLocaleString()}
                </p>
                <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
                  <button onClick={() => handleView(p.id)}>Se politik</button>
                  <button onClick={() => handleDownload(p.id)}>PDF</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedHtml && (
        <div className="card" style={{ marginTop: "2rem" }}>
          <h3>Visning af politik</h3>
          <div dangerouslySetInnerHTML={{ __html: selectedHtml }} />
        </div>
      )}
    </Layout>
  );
};

export default PolicyHistory;
