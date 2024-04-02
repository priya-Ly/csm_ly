import React, { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
// import Header from "@editorjs/header";
import ImageTool from "@editorjs/image";
// import List from "@editorjs/list";
// import Embed from "@editorjs/embed";
import Paragraph from "@editorjs/paragraph";
import Header from "@editorjs/header";
import Alert from "editorjs-alert";
import List from "@editorjs/list";
import Embed from "@editorjs/embed";
import Underline from "@editorjs/underline";
import ChangeCase from "editorjs-change-case";
import Strikethrough from "@sotaproject/strikethrough";
import Checklist from "@editorjs/checklist";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import ColorPlugin from "editorjs-text-color-plugin";
import AlignmentBlockTune from "editorjs-text-alignment-blocktune";
import axios from "axios";
import TextVariantTune from "@editorjs/text-variant-tune";
import DragDrop from "editorjs-drag-drop";
import NestedList from "@editorjs/nested-list";
import editorjsNestedChecklist from "@calumk/editorjs-nested-checklist";
import Quote from "@editorjs/quote";
import Table from "@editorjs/table";
import AttachesTool from "@editorjs/attaches";

const DEFAULT_INITIAL_DATA = {
  time: new Date().getTime(),
  blocks: [
    {
      type: "header",
      data: {
        level: 1,
        text: "My name is Lakhan",
      },
    },
  ],
};

const CopyEd = () => {
  const ejInstance = useRef();
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [image, setImage] = useState(null); // Changed initial value to null
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
  }, []);
  const initEditor = () => {
    const editor = new EditorJS({
      holder: "editorjs",
      onReady: () => {
        new DragDrop(editor);

        ejInstance.current = editor;
      },
      autofocus: true,
      onChange: async () => {
        try {
          let content = await editor.saver.save();

          console.log(content);
          setContent(content);
        } catch (error) {
          console.error("Error saving data:", error);
        }
      },
      tools: {
        // header: {
        //   class: Header,
        //   inlineToolbar: ["link"],
        // },
        // list: {
        //   class: List,
        //   inlineToolbar: ["link", "bold"],
        // },
        // embed: {
        //   class: Embed,
        //   inlineToolbar: false,
        //   config: {
        //     services: {
        //       youtube: true,
        //       coub: true,
        //     },
        //   },
        // },
        textAlignment: {
          class: AlignmentBlockTune,
          config: {
            default: "left",
            blocks: {
              header: "center",
            },
          },
        },
        paragraph: {
          class: Paragraph,
          tunes: ["textAlignment"],
        },
        header: {
          class: Header,
          inlineToolbar: true,
          tunes: ["textAlignment"],
          config: {
            placeholder: "Enter a header",
            levels: [1, 2, 3, 4, 5],
            defaultLevel: 2,
          },
        },
        attaches: {
          class: AttachesTool,
          config: {
            uploader: {
              async uploadByFile(file) {
                // your own uploading logic here
                const formData = new FormData();
                formData.append("file", file);

                const response = await axios.post(
                  `http://localhost:7000/blogLy/upload`,
                  formData,
                  {
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                    withCredentials: false,
                  }
                );
                console.log(response, "resppp");
                if (response.data.success === 1) {
                  console.log("attches", response.data);
                  return response.data;
                }
              },
            },
          },
        },
        alert: {
          class: Alert,
          config: {
            defaultType: "primary",
            messagePlaceholder: "Enter something",
          },
        },
        list: {
          class: List,
          config: {
            defaultStyle: "unordered",
          },
        },
        list: {
          class: NestedList,
          inlineToolbar: true,
          config: {
            defaultStyle: "unordered",
          },
        },
        nestedchecklist: editorjsNestedChecklist,

        checklist: {
          class: Checklist,
        },
        embed: {
          class: Embed,
          config: {
            services: {
              youtube: true,
              codepen: true,
            },
          },
        },
        underline: {
          class: Underline,
        },
        strikethrough: {
          class: Strikethrough,
        },
        Marker: {
          class: Marker,
        },
        InlineCode: {
          class: InlineCode,
        },
        changeCase: {
          class: ChangeCase,
        },
        Color: {
          class: ColorPlugin,
          config: {
            colorCollections: [
              "#EC7878",
              "#9C27B0",
              "#673AB7",
              "#3F51B5",
              "#0070FF",
              "#03A9F4",
              "#00BCD4",
              "#4CAF50",
              "#8BC34A",
              "#CDDC39",
              "#FFF",
            ],
            defaultColor: "gray",
            type: "text",
            customPicker: true,
          },
        },
        textAlignment: {
          class: AlignmentBlockTune,
          config: {
            default: "left",
            blocks: {
              header: "center",
            },
          },
        },
        textVariant: TextVariantTune,
        quote: {
          class: Quote,
          inlineToolbar: true,
          shortcut: "CMD+SHIFT+O",
          config: {
            quotePlaceholder: "Enter a quote",
            captionPlaceholder: "Quote's author",
          },
        },
        table: {
          class: Table,
          inlineToolbar: true,
          config: {
            rows: 2,
            cols: 3,
          },
        },
        image: {
          class: ImageTool,
          config: {
            uploader: {
              async uploadByFile(file) {
                // your own uploading logic here
                const formData = new FormData();
                formData.append("file", file);
                console.log(formData);
                const response = await axios.post(
                  `http://localhost:7000/blogLy/api/upload`,
                  formData,
                  {
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                    withCredentials: false,
                  }
                );

                if (response.data.success === 1) {
                  console.log(response.data, "filee");
                  return response.data;
                }
              },
              async uploadByUrl(url) {
                const response = await axios.post(
                  `http://localhost:7000/blogLy/uploadUrl`,
                  {
                    url,
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                    withCredentials: false,
                  }
                );

                if (response.data.success === 1) {
                  console.log(response.data, "urll comee");
                  return response.data;
                }
              },
            },
            inlineToolbar: true,
          },
        },
      },
      data: DEFAULT_INITIAL_DATA,
    });
  };

  useEffect(() => {
    if (ejInstance.current === null) {
      initEditor();
    }

    return () => {
      ejInstance?.current?.destroy();
      ejInstance.current = null;
    };
  }, []);
  const handleInputChange = (e, setState) => {
    setState(e.target.value);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const savedData = await ejInstance.current.save();
      console.log(savedData, "sd");
      const formattedContent = {
        blocks: savedData.blocks.map((block) => ({
          type: block.type,
          data: block.data,
        })),
        time: savedData.time,
        version: savedData.version,
      };
      console.log(formattedContent, "fc");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", JSON.stringify(formattedContent));
      formData.append("status", status);
      formData.append("bannerCaption", bannerCaption);
      formData.append("authorId", selectedAuthor);
      formData.append("categoryId", selectedCategory);
      formData.append("image", image); // Append image to formData
      console.log(formData, "formmm");
      const response = await axios.post(
        "http://localhost:7000/blogLy/blog",
        formData
      );
      console.log("Post created:", response.data);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSave}>
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
};

export default CopyEd;
