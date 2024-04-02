import React, { useRef, useState } from "react";
import JoditEditor from "jodit-react";
function AddBlogA() {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  return <div>
    <label for='content' >Pots content</label>
    <JoditEditor
    ref={editor}
    value={content}
    onChange={newContent=>setContent(newContent)}
    />
  </div>;
}

export default AddBlogA;
