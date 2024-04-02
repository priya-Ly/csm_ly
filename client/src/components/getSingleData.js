import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const GetSingleData = () => {
  const [post, setPost] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/blogLy/title/${id}`
        );
        setPost(response.data);
        console.log(response.data, "dd"); // Assuming the response.data is an array of blog posts
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchData();
  }, [id]); // Fetch data on component mount

  return (
    <div>
      <h1>Blog Posts</h1>
      {post ? (
        <div key={post._id}>
          {/* Render post title */}
          <h2>{post.title}</h2>
          {/* Parse and render content */}
          {post.content && (
            <div>
              {JSON.parse(post.content).blocks.map((block, index) => {
                switch (block.type) {
                  case "header":
                    return (
                      <div
                        key={index}
                        dangerouslySetInnerHTML={{ __html: block.data.text }}
                      />
                    );
                  case "attaches":
                    return (
                      <a key={index} href={block.data.file.url}>
                        {block.data.title}
                      </a>
                    );
                  case "alert":
                    return (
                      <div
                        key={index}
                        className={`alert-${block.data.type}`}
                        dangerouslySetInnerHTML={{
                          __html: block.data.message,
                        }}
                      ></div>
                    );
                  case "list":
                    return (
                      <ul key={index}>
                        {block.data.items.map((item, i) => (
                          <li key={i}>{item.content}</li>
                        ))}
                      </ul>
                    );

                  case "nestedchecklist":
                    const renderNestedChecklist = (items, level = 0) => (
                      <ul key={index}>
                        {items.map((item, i) => (
                          <li key={i}>
                            {item.content}
                            {item.items &&
                              item.items.length > 0 &&
                              renderNestedChecklist(item.items, level + 1)}
                          </li>
                        ))}
                      </ul>
                    );

                    return renderNestedChecklist(block.data.items);

                  case "quote":
                    return (
                      <blockquote key={index}>
                        <p
                          dangerouslySetInnerHTML={{ __html: block.data.text }}
                        ></p>
                        <cite
                          dangerouslySetInnerHTML={{
                            __html: block.data.caption,
                          }}
                        ></cite>
                      </blockquote>
                    );
                  case "table":
                    return (
                      <table key={index}>
                        <tbody>
                          {block.data.content.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {row.map((cell, cellIndex) => (
                                <td key={cellIndex}>{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    );

                  case "image":
                    return (
                      <div key={index}>
                        <img
                          src={block.data.file.url}
                          alt={block.data.caption}
                        />
                        <p>{block.data.caption}</p>
                      </div>
                    );
                  case "paragraph":
                    return (
                      <p
                        key={index}
                        dangerouslySetInnerHTML={{ __html: block.data.text }}
                      />
                    );
                  default:
                    return null;
                }
              })}
            </div>
          )}
          {/* Render other post details */}
          <p>Status: {post.status}</p>
          {post.image && <img src={post.image} alt="Data" />}
          <p>Banner Caption: {post.bannerCaption}</p>
          <p>
            Category:
            {post.categoryId?.categoryName
              ? post.categoryId.categoryName
              : null}
          </p>
          <p>
            Author: {post.authorId?.firstName} {post.authorId?.lastName}
          </p>
        </div>
      ) : (
        <p>No posts available</p>
      )}
    </div>
  );
};

export default GetSingleData;
