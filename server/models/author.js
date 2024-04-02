const mongoose = require("mongoose");
const { Schema } = mongoose;
const authorLySchema = new Schema(
  {
    firstName: {
      type: Schema.Types.String,
      required: true,
    },
    lastName: {
      type: Schema.Types.String,
    },
  },
  { timestamps: true }
);
const Author = mongoose.model("Author", authorLySchema);
module.exports =Author;
