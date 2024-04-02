import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function AddBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };
  const handleContentChange = (html) => {
    setContent(html);
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:7000/blog/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });
      console.log(response)
      if (response.ok) {
        console.log(response.dataa,'dd')
        console.log("blog created successfully");
      } else {
        console.log("Failed to craete blog post");
      }
    } catch (error) {
      console.log(error, "error");
    }
  };
  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter title"
          required
        />
        <ReactQuill
          value={content}
          onChange={handleContentChange}
          placeholder="Write your blog post"
        />
        <button type="submit">Publish</button>
      </form>
    </div>
  );
}

export default AddBlog;
