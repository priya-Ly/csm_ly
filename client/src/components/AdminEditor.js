import EditorJS from "@editorjs/editorjs";
import { useEffect, useRef, useState } from "react";
import Header from "@editorjs/header";
import ImageTool from "@editorjs/image";
import List from "@editorjs/list";
import Embed from "@editorjs/embed";
import axios from "axios";

function AdminEditor() {
  const ejInstance = useRef(null);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [image, setImage] = useState("");
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bannerCaption, setBannerCaption] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const getAuthors = async () => {
      try {
        const response = await fetch("http://localhost:7000/blogLy/author");
        if (!response.ok) {
          throw new Error("Failed to fetch authors");
        }
        const data = await response.json();
        setAuthors(data);
      } catch (error) {
        console.error("Error fetching authors:", error);
        setError("Failed to fetch authors");
      }
    };
    getAuthors();
  }, []);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await fetch("http://localhost:7000/blogLy/category");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to fetch categories");
      }
    };
    getCategories();
  }, []);

  const initEditor = async () => {
    ejInstance.current = await new EditorJS({
      holder: "editorjs",
      autofocus: true,
      onChange: async () => {
        try {
          const savedData = await ejInstance.current.save();
          console.log("Saved data:", savedData);
          setContent(savedData);
        } catch (error) {
          console.error("Error saving data:", error);
          setError("Error saving data");
        }
      },
      tools: {
        header: {
          class: Header,
          inlineToolbar: ["link"],
        },
        list: {
          class: List,
          inlineToolbar: ["link", "bold"],
        },
        embed: {
          class: Embed,
          inlineToolbar: true,
          config: {
            services: {
              youtube: true,
              coub: true,
            },
          },
        },
        image: {
          class: ImageTool,
          config: {
            uploader: {
              async uploadByUrl(url) {
                try {
                  const response = await axios.post(
                    "http://localhost:7000/blogLy/uploadUrl",
                    { url }
                  );
                  if (response.data.success === 1) {
                    console.log(
                      "Image uploaded by URL:",
                      response.data.file.url
                    );
                    return response.data;
                  } else {
                    console.error(
                      "Failed to upload image by URL:",
                      response.data.error
                    );
                    setError("Failed to upload image by URL");
                  }
                } catch (error) {
                  console.error("Error uploading image by URL:", error);
                  setError("Error uploading image by URL");
                }
              },
              async uploadByFile(file) {
                const formData = new FormData();
                formData.append("file", file);

                try {
                  const response = await fetch(
                    "http://localhost:7000/blogLy/api/upload",
                    {
                      method: "POST",
                      body: formData,
                    }
                  );
                  if (response.ok) {
                    const resData = await response.json();
                    if (resData.success === 1) {
                      console.log("Image uploaded by file:", resData.file.url);
                      return resData;
                    } else {
                      console.error(
                        "Failed to upload image by file:",
                        resData.error
                      );
                      setError("Failed to upload image by file");
                    }
                  } else {
                    console.error("Image upload failed:", response.status);
                    setError("Image upload failed");
                  }
                } catch (error) {
                  console.error("Error uploading image by file:", error);
                  setError("Error uploading image by file");
                }
              },
            },
          },
        },
      },
    });
  };

  useEffect(() => {
    if (!ejInstance.current) {
      initEditor();
    }
    return () => {
      if (ejInstance.current) {
        ejInstance.current.destroy();
      }
    };
  }, []);

  const handleInputChange = (e, setState) => {
    setState(e.target.value);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", JSON.stringify(content));
      formData.append("status", status);
      formData.append("bannerCaption", bannerCaption);
      formData.append("authorId", selectedAuthor);
      formData.append("categoryId", selectedCategory);
      formData.append("image", image);

      const response = await axios.post(
        "http://localhost:7000/blogLy/blog",
        formData
      );
      console.log("Post created:", response.data);
    } catch (error) {
      console.error("Error creating post:", error);
      setError("Error creating post");
    }
  };

  return (
    <div>
      <input
        type="text"
        value={title}
        onChange={(e) => handleInputChange(e, setTitle)}
        placeholder="Enter Title"
        required
      />
      <div id="editorjs"></div>
      <select
        value={selectedAuthor}
        onChange={(e) => handleInputChange(e, setSelectedAuthor)}
      >
        <option value="">Select an author</option>
        {authors.map((author) => (
          <option key={author._id} value={author._id}>
            {author.firstName} {author.lastName}
          </option>
        ))}
      </select>
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        placeholder="Enter Banner Image"
      />
      <input
        type="text"
        value={bannerCaption}
        onChange={(e) => handleInputChange(e, setBannerCaption)}
        placeholder="Enter Banner Caption"
        required
      />
      <h2>Select Status</h2>
      <select value={status} onChange={(e) => handleInputChange(e, setStatus)}>
        <option value="">Select a status</option>
        <option value="Publish">Publish</option>
        <option value="Draft">Draft</option>
      </select>
      <h2>Category:</h2>
      <select
        value={selectedCategory}
        onChange={(e) => handleInputChange(e, setSelectedCategory)}
      >
        <option value="">Select a category</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.categoryName}
          </option>
        ))}
      </select>
      <button className="save-btn" onClick={handleSave}>
        Save
      </button>
      {error && <p>Error: {error}</p>}
    </div>
  );
}

export default AdminEditor;
