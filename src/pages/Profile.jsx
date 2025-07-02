import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const logout = async () => {
    try {
        await axios.post("http://localhost:5000/api/auth/logout", {}, {
        withCredentials: true
        });
    } catch (e) {
        console.warn("Logout failed on server");
    } finally {
        localStorage.removeItem("token");
        navigate("/");
    }
    };


  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setUser(res.data);
      } catch (err) {
        alert("Unauthorized");
        logout();
      }
    };
    fetchMe();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h2>Welcome, {user.company}</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Profile;
