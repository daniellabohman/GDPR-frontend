import React from "react";
import { useParams } from "react-router-dom";

const PolicyDetails = () => {
  const { policyId } = useParams();

  return (
    <div className="card">
      <h2>Privatlivspolitik #{policyId}</h2>
      <p>Visning af politikindhold kommer her...</p>
    </div>
  );
};

export default PolicyDetails;
