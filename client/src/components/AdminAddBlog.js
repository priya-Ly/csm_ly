import React, { useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import CKFinder from "@ckeditor/ckeditor5-ckfinder/src/ckfinder";

// import { EditorState, convertToRaw, ContentState } from "draft-js";
// import { Editor } from "react-draft-wysiwyg";
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

function AdminAddBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");
  const [image, setImage] = useState("");
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [bannerCaption, setBannerCaption] = useState("");
  const [error, setError] = useState(null);
  const [uploadPreset, setUploadPreset] = useState(""); // State to store the upload preset

  // const [editorState, setEditorState] = useState(() =>
  //   EditorState.createEmpty()
  // );

  // const handleEditorStateChange = (editorState) => {
  //   setEditorState(editorState);
  // };

  // const handleEditorStateChange = (editorState) => {
  //   setEditorState(editorState);
  //   const currentContent = editorState.getCurrentContent();

  //   const rawContentState = convertToRaw(currentContent);
  //   const content = JSON.stringify(rawContentState);
  //   setContent(content);
  // };
  const api_url = "http://localhost:7000";
  const upload_endpoint = "blogLy/api/upload";

  function uploadAdapter(loader) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          const body = new FormData();
          loader.file.then((file) => {
            body.append("file", file);
            fetch(`${api_url}/${upload_endpoint}`, {
              method: "post",
              body: body,
            })
              .then((res) => res.json())
              .then((res) => {
                resolve({ default: `${api_url}/${res.url}` });
              })
              .catch((err) => {
                reject(err);
              });
          });
        });
      },
    };
  }
  function CustomUploadAdapterPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return {
        upload: () => {
          return loader.file.then((file) => {
            return new Promise((resolve, reject) => {
              const formData = new FormData();
              formData.append("file", file);

              fetch("http://localhost:7000/blogLy/api/upload", {
                method: "POST",
                body: formData,
              })
                .then((response) => response.json())
                .then((result) => {
                  resolve({ default: result.url });
                })
                .catch((error) => {
                  reject(error);
                });
            });
          });
        },
      };
    };
  }

  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
  }
  const handleInputChange = (e, setState) => {
    console.log(e.target.value);
    setState(e.target.value);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:7000/blogLy/cloudinary-preset"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch upload preset");
        }
        const data = await response.json();
        setUploadPreset(data.upload_preset); // Update the upload preset state
      } catch (error) {
        console.error("Error fetching upload preset:", error);
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const getAuthors = async (e) => {
      try {
        const response = await fetch("http://localhost:7000/blogLy/author");
        if (!response.ok) {
          throw new Error("Failed to fetch authors");
        }
        const data = await response.json();
        setAuthors(data);
      } catch (error) {
        console.error("Error fetching authors:", error);
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
        console.log(data);
      } catch (error) {
        console.log(error);
        console.error("Error fetching categories:", error);
      }
    };
    getCategories();
  }, []);
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("status", status);
    formData.append("bannerCaption", bannerCaption);
    formData.append("authorId", selectedAuthor);
    formData.append("categoryId", selectedCategory);
    formData.append("image", image); // Assuming image is the file input value
    try {
      const response = await fetch("http://localhost:7000/blogLy/blog", {
        method: "POST",
        body: formData,
        // headers: {
        //   "X-Upload-Preset": uploadPreset, // Send the upload preset as a custom header
        // },
      });
      console.log(response, "resp");

      if (response.ok) {
        console.log("Blog saved successfully");
      } else {
        throw new Error("Failed to save blog");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(error.message);
    }
  };
  const editorConfiguration = {
    cloudServices: {
      tokenUrl: "http://localhost:7000/blogLy/cloudinary-preset",
      uploadUrl: "https://api.cloudinary.com/v1_1/dlaahua4u/image/upload",
    },
  };
  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => handleInputChange(e, setTitle)}
          placeholder="Enter Title "
          required
        />
        <h2>Authors:</h2>

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
        {/* <CKEditor
          editor={ClassicEditor}
          // config={
          //   // // plugins: [CKFinder],
          //   // // toolbar: ["ckfinder", "|", "undo", "redo", "|", "bold", "italic"],
          //   {
          //     // ckfinder: {
          //     //   uploadUrl:
          //     //     "https://api.cloudinary.com/v1_1/dlaahua4u/image/upload",
          //     // },
          //     cloudServices: {
          //       tokenUrl: "http://localhost:7000/blogLy/cloudinary-preset",
          //       uploadUrl:
          //         "https://api.cloudinary.com/v1_1/dlaahua4u/image/upload",
          //     },
          //   }
          // }
          config={editorConfiguration}
          data={content}
          onChange={(event, editor) => {
            const data = editor.getData();
            setContent(data);
          }}
        /> */}
        {/* {editorConfiguration ? (
          <CKEditor
            editor={ClassicEditor}
            config={editorConfiguration}
            data={content}
            onChange={(event, editor) => {
              const data = editor.getData();
              setContent(data);
            }}
          />
        ) : (
          <p>Loading editor...</p>
        )}
        {error && <p>Error: {error}</p>} */}
        <CKEditor
          config={{
            extraPlugins: [CustomUploadAdapterPlugin],
          }}
          editor={ClassicEditor}
          // config={editorConfiguration}
          data={content}
          onChange={(event, editor) => {
            const data = editor.getData();
            setContent(data);
          }}
        />
        {/* <Editor
          initialEditorState={editorState}
          onEditorStateChange={setEditorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          placeholder="The message goes here..."
        /> */}

        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          placeholder="Enter Banner Image"
        />
        {/* <input
          type="status"
          value={title}
          onChange={(e) => handleInputChange(e, setStatus)}
          placeholder="Mention Status "
          required
        /> */}
        <input
          type="bannerCaption"
          value={bannerCaption}
          onChange={(e) => handleInputChange(e, setBannerCaption)}
          placeholder="Enter Banner Caption "
          required
        />
        <h2>Select status</h2>
        <select
          value={status}
          onChange={(e) => handleInputChange(e, setStatus)}
        >
          <option value={status}>Select a status</option>

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
        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default AdminAddBlog;
