const mongoose = require("mongoose");
const { Schema } = mongoose;
const categoryLySchema = new Schema(
  {
    categoryName: {
      type: Schema.Types.String,
      required: true,
    },
  },
  { timestamps: true }
);
const Category = mongoose.model("Category", categoryLySchema);
module.exports = Category;
