const BlogLy = require("../models/blogLy");
const addBlog = async (req, res, next) => {
  try {
    console.log("hiiii");
    const { title, authorId, content, status, bannerCaption, categoryId } =
      req.body;
    const image = req.file;
    if (!image) {
      return res.status(400).json({ message: "File or filename is missing" });
    }
    const filePath = `/${image.destination}/${image.filename}`;
    console.log(filePath, "fp");
    const newBlog = new BlogLy({
      title,
      authorId,
      content,
      status,
      image: filePath,
      bannerCaption,
      categoryId,
    });

    await newBlog.save();
    console.log(newBlog);

    return res.status(201).json(newBlog);
  } catch (error) {
    console.log(error, error.message);
    return res.status(500).json({ error: error.message });
  }
};
module.exports = addBlog;
