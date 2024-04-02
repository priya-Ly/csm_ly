const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const BlogRouter = require("./routes/blog");
const BlogLyRouter = require("./routes/lyBlog");
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.urlencoded({ extended: false }));
app.use("/blog", BlogRouter);
app.use("/blogLy", BlogLyRouter);
app.get("/", (req, res) => {
  res.send("helloo");
});
let port = 7000;
async function start() {
  try {
    mongoose.connect(
      "mongodb+srv://admin:admin@cluster0.s3icvpv.mongodb.net/blog?retryWrites=true&w=majority"
    );

    app.listen(port, () => {
      console.log("server listeningggg");
    });
  } catch (error) {
    console.log(error);
  }
}

start();
