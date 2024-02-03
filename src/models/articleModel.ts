import mongoose from "mongoose";

const articleModel = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide blog's title"],
      maxLength: 50,
      minLenght: 2,
    },
    body: {
      type: String,
      required: [true, "Please provide blog's body"],
    },
    image: String,
    tags: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const Article = mongoose.model("Article", articleModel);

export default Article;
