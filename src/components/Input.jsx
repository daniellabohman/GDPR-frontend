import React from "react";

const Input = ({ label, type, value, onChange }) => (
  <div style={{ marginBottom: "10px" }}>
    <label>{label}</label><br />
    <input
      type={type}
      value={value}
      onChange={onChange}
      style={{ padding: "8px", width: "100%" }}
    />
  </div>
);

export default Input;
