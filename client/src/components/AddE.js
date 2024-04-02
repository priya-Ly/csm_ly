import { useEffect, useRef, useState } from "react";
import Header from "@editorjs/header";
import ImageTool from "@editorjs/image";
import List from "@editorjs/list";
import Embed from "@editorjs/embed";
import axios from "axios";
import EditorJS from "@editorjs/editorjs";

function AddE() {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authorsResponse = await fetch(
          "http://localhost:7000/blogLy/author"
        );
        const categoriesResponse = await fetch(
          "http://localhost:7000/blogLy/category"
        );

        if (!authorsResponse.ok) {
          throw new Error("Failed to fetch authors");
        }
        if (!categoriesResponse.ok) {
          throw new Error("Failed to fetch categories");
        }

        const authorsData = await authorsResponse.json();
        const categoriesData = await categoriesResponse.json();

        setAuthors(authorsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    initEditor(); // Call initEditor here

    return () => {
      if (ejInstance.current) {
        ejInstance.current.destroy();
      }
    };
  }, []); // Dependency array is empty, so this effect runs only once after the initial render

  const initEditor = async () => {
    ejInstance.current = await new EditorJS({
      holder: "editorjs", // The ID of the element where EditorJS should be rendered
      autofocus: false, // Whether to focus on the editor after initialization
      onChange: async () => {
        // Callback function triggered whenever the content changes
        try {
          const savedData = await ejInstance.current.save();
          console.log("Saved data:", savedData);
          // Update the content state
          setContent(savedData);
        } catch (error) {
          console.error("Error saving data:", error);
        }
      },
      minHeight: 0,
      // Specify the tools configuration
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
          inlineToolbar: false,
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
              async uploadByFile(file) {
                const formData = new FormData();
                formData.append("file", file);

                const response = await fetch(
                  "http://localhost:7000/blogLy/api/upload",
                  {
                    method: "POST",
                    body: formData,
                    headers: {
                      // No need to set Content-Type, it will be automatically set by FormData
                      // "Content-Type": "multipart/form-data",
                    },
                    withCredentials: false,
                  }
                );
                console.log(response, "resp");
                if (response.ok) {
                  const resData = await response.json();
                  if (resData.success === 1) {
                    console.log(resData.file.url, "file");
                    return resData;
                  }
                } else {
                  console.error("Image upload failed:", response.status);
                  // Handle the error accordingly
                }
              },
              async uploadByUrl(url) {
                const response = await axios.post(
                  "http://localhost:7000/blogLy/uploadUrl",
                  {
                    url,
                  }
                );
                if (response.data.success === 1) {
                  console.log(response.data, "dddd");
                  return response.data;
                }
              },
            },
          },
        },
        // Add more tools as needed
      },
    });
  };

  const handleInputChange = (e, setState) => {
    setState(e.target.value);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // Get the raw saved data from EditorJS instance
      const savedData = await ejInstance.current.save();

      // Modify the content to match the expected format by your backend
      const formattedContent = {
        blocks: savedData.blocks.map((block) => ({
          type: block.type,
          data: block.data,
        })),
        time: savedData.time,
        version: savedData.version,
      };

      // Construct form data
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", JSON.stringify(formattedContent));
      formData.append("status", status);
      formData.append("bannerCaption", bannerCaption);
      formData.append("authorId", selectedAuthor);
      formData.append("categoryId", selectedCategory);
      formData.append("image", image);

      // Send form data to API endpoint
      const response = await axios.post(
        "http://localhost:      7000/blogLy/blog",
        formData
      );
      console.log("Post created:", response.data);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div style={{ background: "red" }}>
      <form onSubmit={handleSave}>
        <input
          type="text"
          value={title}
          onChange={(e) => handleInputChange(e, setTitle)}
          placeholder="Enter Title"
          required
        />
        <div id="editorjs" style={{ background: "green" }}></div>
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
        <select
          value={status}
          onChange={(e) => handleInputChange(e, setStatus)}
        >
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
        <button type="submit" className="save-btn">
          Save
        </button>
      </form>
    </div>
  );
}

export default AddE;
