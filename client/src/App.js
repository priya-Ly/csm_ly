import logo from "./logo.svg";
import "./App.css";
import AddBlog from "./components/AddBlog";
import BlogList from "./components/getBlog";
import AdminAddBlog from "./components/AdminAddBlog";
import AdminBlogList from "./components/AdminBlogList";
import AddBlogA from "./components/AddBlogA";
import EditorAdd from "./components/EditorAdd";
import AdminEditor from "./components/AdminEditor";
import CopyEd from "./components/CopyEd";
import ContentGets from "./components/AdminBlogList";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserBlogList from "./components/UserBlogList";
import GetAllList from "./components/GetAllList";
import GetSingleData from "./components/getSingleData";
function App() {
  return (
    <div className="App">
      {/* <EditorAdd /> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CopyEd />} />
          <Route path="/admin" element={<ContentGets />} />
          <Route path="/user" element={<UserBlogList />} />
          <Route path="/list" element={<GetAllList />} />
          <Route path="/list/:id" element={<GetSingleData />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
//   {/* <AddBlog/>
// <BlogList/> */}
//   {/* <AdminAddBlog />
//   <AdminBlogList /> */}
//   {/* <AddBlogA /> */}
//         {/* <AdminEditor /> */}
