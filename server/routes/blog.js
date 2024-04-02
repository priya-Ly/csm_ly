const Blog = require("../models/blog");
const router = require("express").Router();
router.get("/", async (req, res, next) => {
  try {
    const getBlogs = await Blog.find({});
    console.log(getBlogs);
    return res.status(200).json(getBlogs)
  } catch (error) {
    console.log(error);
    return res.status(500).json(error)

  }
});
router.post("/", async (req, res, next) => {
  try {
    const { title, subtitle, content, author, subFooterTitle } = req.body;
    const newBlog = new Blog({
      ...req.body,
      // title,
      // subtitle,
      // content,
      // author,
      // subFooterTitle
    });
    console.log(newBlog);
    await newBlog.save();
    return res.status(200).json(newBlog)
  } catch (error) {
    console.log(error);
    next(error);
    return res.status(500).json(error)
  }
});
router.get('/:id',async(req,res,next)=>{
  try {
    const getSingleBlog=await Blog.findById(req.params.id)
    console.log(getSingleBlog)
    return res.status(200).json(getSingleBlog.title)

  } catch (error) {
    
  }
})
module.exports = router;
