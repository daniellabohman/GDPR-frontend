import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";
import Layout from "../components/Layout";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axios.post("/auth/logout", {}, {
        withCredentials: true
      });
    } catch (e) {
      console.warn("Logout failed on server");
    } finally {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get("/auth/me");
        setUser(res.data);
      } catch (err) {
        logout();
      }
    };
    fetchMe();
  }, []); // <-- afhænger ikke af navigate

  if (!user) return <p>Indlæser profil...</p>;

  return (
    <Layout>
      <div className="card">
        <h2>Min profil</h2>
        <p><strong>Virksomhed:</strong> {user.company}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Rolle:</strong> {user.role}</p>
        <button onClick={logout} style={{ marginTop: "1rem" }}>Log ud</button>
      </div>
    </Layout>
  );
};

export default Profile;
