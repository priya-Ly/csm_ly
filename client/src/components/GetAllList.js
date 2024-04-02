import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const GetAllList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:7000/blogLy/title");
        setPosts(response.data);
        console.log(response.data, "dd"); // Assuming the response.data is an array of blog posts
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchData();
  }, []); // Fetch data on component mount

  return (
    <div>
      <h1>Blog Listing</h1>
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <div key={post._id}>
            {/* Render post title */}
            <Link to={`/list/${post._id}`}>{post.title}</Link>
            {/* Parse and render content */}
          </div>
        ))
      ) : (
        <p>No posts available</p>
      )}
    </div>
  );
};

export default GetAllList;
