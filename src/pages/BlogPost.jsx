import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axiosInstance";

const setOpenGraph = (post) => {
  const metaTags = [
    { property: "og:title", content: post.title },
    { property: "og:description", content: post.content.slice(0, 150) },
    { property: "og:type", content: "article" },
    { property: "og:url", content: window.location.href },
    { property: "og:site_name", content: "Nexpertia" },
    // Tilføj evt. image
    // { property: "og:image", content: "https://nexpertia.dk/cover.jpg" }
  ];

  metaTags.forEach(({ property, content }) => {
    let tag = document.querySelector(`meta[property='${property}']`);
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("property", property);
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", content);
  });
};

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
  if (post) {
    setOpenGraph(post);
  }
  }, [post]);

  const fetchPost = async () => {
    const res = await axios.get(`/blog/${slug}`);
    setPost(res.data);
    document.title = `${res.data.title} | Nexpertia Blog`;
    setMetaDescription(res.data.content.slice(0, 160));
    insertStructuredData(res.data);
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

  const insertStructuredData = (data) => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": data.title,
      "datePublished": data.created_at,
      "author": {
        "@type": "Person",
        "name": data.author
      },
      "articleBody": data.content.slice(0, 300)
    });
    document.head.appendChild(script);
  };

  if (!post) return <p className="p-6">Indlæser...</p>;

  return (
    <article className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        Skrevet af {post.author} – {new Date(post.created_at).toLocaleDateString("da-DK", { dateStyle: "long" })}
      </p>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
};

export default BlogPost;
