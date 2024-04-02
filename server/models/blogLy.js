const mongoose = require("mongoose");
const { Schema } = mongoose;
const blogLySchema = new Schema(
  {
    title: {
      type: Schema.Types.String,
      required: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "Author",
    },
    content: {
      type: Schema.Types.String,
      required: true,
    },
    status: {
      type: Schema.Types.String,
      enum: ["Draft", "Publish"],
      required: true,
    },
    image: {
      type: Schema.Types.String,
    },
    bannerCaption: {
      type: Schema.Types.String,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref:"Category"
    },
  },
  { timeStamps: true }
);
const BlogLy = mongoose.model("BlogLy", blogLySchema);
module.exports = BlogLy;
