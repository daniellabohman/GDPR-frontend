import React from "react";
import "../styles/global.css"; 

const AnalysisResult = ({ analysis, withTitle }) => {
  if (!analysis) return null;

  return (
    <div className="card">
      {withTitle && <h3>Resultat af seneste analyse</h3>}
      <h4 style={{ marginBottom: "0.5rem" }}>
        Compliance Score: {analysis.score}%
      </h4>
      {analysis.missing?.length > 0 ? (
        <p><strong>Mangler:</strong> {analysis.missing.join(", ")}</p>
      ) : (
        <p><strong>Mangler:</strong> Ingen større problemer fundet 🎉</p>
      )}
      <p style={{ marginTop: "1rem" }}><strong>Forslag:</strong></p>
      <ul style={{ paddingLeft: "1.2rem" }}>
        {analysis.suggestions?.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
    </div>
  );
};
export default AnalysisResult;