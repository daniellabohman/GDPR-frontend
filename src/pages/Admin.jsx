import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";

const Admin = () => {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    published: true,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await axios.get("/blog");
    setPosts(res.data);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/blog", form);
      setForm({ title: "", slug: "", content: "", published: true });
      fetchPosts();
    } catch (err) {
      alert("Kunne ikke oprette indlæg");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug) => {
    if (!window.confirm("Slet indlægget?")) return;
    try {
      await axios.delete(`/blog/${slug}`);
      fetchPosts();
    } catch (err) {
      alert("Kunne ikke slette indlæg");
    }
  };

  return (
    <div className="container">
      <h2 className="text-xl font-semibold mb-4">🧠 Blog & nyheds-admin</h2>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Titel"
            required
          />
          <input
            type="text"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            placeholder="Slug (fx 'introduktion-til-gdpr')"
            required
          />
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={6}
            placeholder="Indhold..."
            required
          />
          <label>
            <input
              type="checkbox"
              name="published"
              checked={form.published}
              onChange={handleChange}
            />{" "}
            Udgiv med det samme
          </label>
          <br />
          <button type="submit" disabled={loading}>
            {loading ? "Opretter..." : "Opret indlæg"}
          </button>
        </form>
      </div>

      <h3 className="text-lg font-medium mt-6 mb-2">📄 Eksisterende indlæg</h3>
      <ul className="space-y-2">
        {posts.map((post) => (
          <li key={post.id} className="card" style={{ padding: "1rem", marginBottom: "1rem" }}>
            <div>
              <strong>{post.title}</strong>
              <div className="text-sm text-gray-500">/blog/{post.slug}</div>
            </div>
            <div className="mt-2">
              <button
                style={{ marginRight: "1rem", backgroundColor: "#ccc", color: "#000" }}
                onClick={() => navigate(`/blog/${post.slug}/edit`)}
              >
                Rediger
              </button>
              <button
                style={{ backgroundColor: "#dc2626" }}
                onClick={() => handleDelete(post.slug)}
              >
                Slet
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Admin;
