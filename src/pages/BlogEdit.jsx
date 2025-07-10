import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";

const BlogEdit = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    id: null,
    title: "",
    slug: "",
    content: "",
    published: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/blog/${slug}`);
        setForm({
          id: res.data.id,
          title: res.data.title,
          slug: res.data.slug,
          content: res.data.content,
          published: true,
        });
      } catch (err) {
        alert("Kunne ikke hente indlæg");
        navigate("/admin");
      }
    };
    fetchPost();
  }, [slug, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`/blog/${form.id}`, form);
      navigate("/admin");
    } catch (err) {
      alert("Fejl under opdatering");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="text-xl font-semibold mb-4">✏️ Redigér blogindlæg</h2>

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
            placeholder="Slug"
            required
          />
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={8}
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
            Udgivet
          </label>
          <br />
          <button type="submit" disabled={loading}>
            {loading ? "Gemmer..." : "Gem ændringer"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BlogEdit;
