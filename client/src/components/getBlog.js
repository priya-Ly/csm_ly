import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    // Fetch blog data from backend API
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:7000/blog", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json(); // Parse response body as JSON
          console.log(data, "d get");
          setBlogs(data); // Set the fetched data to state
        } else {
          console.log("Failed to fetch blog data");
        }
      } catch (error) {
        console.error("Error fetching blog data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures that the effect runs only once after initial render

  return (
    <div>
      <h1>Blog List</h1>
      {blogs.map((blog) => (
        <div key={blog._id}>
          <h2>{blog.title}</h2>
          <h3>{blog.subtitle}</h3>
          <p>Author: {blog.author}</p>
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          <p>Subfooter Title: {blog.subFooterTitle}</p>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
