import mongoose from "mongoose";
import User from "./userModel";

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
    user:{type: mongoose.Schema.Types.ObjectId, ref: User}
  },
  { timestamps: true }
);

const Article = mongoose.model("Article", articleModel);

export default Article;
