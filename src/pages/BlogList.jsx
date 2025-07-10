import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../utils/axiosInstance";

const BlogList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    document.title = "Blog & nyheder | Nexpertia";
    setMetaDescription("Læs de seneste artikler om GDPR, cookies og privatlivspolitik.");
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await axios.get("/blog/");
    setPosts(res.data);
  };

  const setMetaDescription = (desc) => {
    let tag = document.querySelector("meta[name='description']");
    if (!tag) {
      tag = document.createElement("meta");
      tag.name = "description";
      document.head.appendChild(tag);
    }
    tag.content = desc;
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">📚 Seneste blogindlæg</h1>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.id} className="border-b pb-4">
            <Link to={`/blog/${post.slug}`}>
              <h2 className="text-xl font-bold text-blue-700 hover:underline">{post.title}</h2>
            </Link>
            <p className="text-sm text-gray-500">
              {new Date(post.created_at).toLocaleDateString("da-DK", { dateStyle: "long" })}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogList;
