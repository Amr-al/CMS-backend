import mongoose from "mongoose";
import User from "./userModel";
import Article from "./articleModel";

const commentModel = new mongoose.Schema(
  {
    body: {
      type: String,
      required: [true, "Please provide comment's body"],
    },
    blog: { type: mongoose.Schema.Types.ObjectId, ref: Article },
    tag: { type: mongoose.Schema.Types.ObjectId, ref: User },
    user: { type: mongoose.Schema.Types.ObjectId, ref: User },
    reacts: [{ type: mongoose.Schema.Types.ObjectId, ref: User }],
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentModel);

export default Comment;
