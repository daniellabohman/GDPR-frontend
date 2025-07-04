import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import "../styles/global.css";

const HistoryList = ({ ScoreBadge, withTitle }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get("/gdpr/history");
        setHistory(res.data);
      } catch (err) {
        console.error("Kunne ikke hente historik", err);
      }
    };
    fetchHistory();
  }, []);

  if (history.length === 0)
    return <p style={{ marginTop: "2rem" }}>Ingen tidligere analyser endnu.</p>;

  return (
    <div className="card">
      {withTitle && <h3></h3>}
      <div className="history-grid">
        {history.map((entry) => (
          <div key={entry.id} className="card">
            <p className="timestamp">
              {new Date(entry.created_at).toLocaleString("da-DK")}
            </p>
            <h4>{entry.url}</h4>
            <p>
              <strong>Score:</strong> {entry.score}%
              {ScoreBadge && <ScoreBadge score={entry.score} />}
            </p>
            <p>
              <strong>Mangler:</strong>{" "}
              {entry.missing?.length > 0 ? entry.missing.join(", ") : "Ingen"}
            </p>
            <p>
              <strong>Forslag:</strong>
            </p>
            <ul>
              {entry.suggestions?.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryList;
