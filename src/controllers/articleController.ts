import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import Article from "../models/articleModel";
import AppError from "../utils/appError";
import mongoose from "mongoose";
import Comment from "../models/commentModel";

export const createArticle = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    let { title, body, tags } = req.body;
    if (!title) {
      return next(new AppError("Please Enter the title of your blog", 400));
    }
    if (!body) {
      return next(new AppError("Please Enter the body of your blog", 400));
    }
    if (tags) tags = JSON.parse(tags);
    const article = await Article.create({
      title,
      body,
      image: req.file?.path,
      tags,
      user: req.user,
    });
    res.status(201).json({
      status: "success",
      result: article,
    });
  }
);

export const lastestArticles = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let page: any = req.query.page ? req.query.page : 1;
    const result = await Article.find()
      .skip((parseInt(page) - 1) * 9)
      .limit(9);
    res.status(200).json({
      status: "success",
      result,
    });
  }
);

export const getArticleById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new AppError("Please enter a valid ID", 400));
    }
    let result: any = await Article.findById(req.params.id);
    if (!result) {
      return next(new AppError("There is no such Blog", 400));
    }
    const comments = await Comment.find({ blog: req.params.id });
    res.status(200).json({
      status: "success",
      result,
      comments,
    });
  }
);

export const deleteArticle = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    let result: any = await Article.findById(req.params.id).populate("user");
    if (!result) return next(new AppError("There is no such Blog", 400));
    if (
      !new mongoose.Types.ObjectId(result.user._id).equals(
        new mongoose.Types.ObjectId(req.user._id)
      )
    )
      return next(new AppError("You are not authorized", 401));
    await Article.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "success",
      result: "Blog Deleted successfully",
    });
  }
);

export const editArticle = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    let { body, title, tags } = req.body;
    if (tags) tags = JSON.parse(tags);
    let image: string = req.file?.path;
    const result = await Article.findByIdAndUpdate(
      req.params.id,
      {
        body,
        title,
        tags,
        image,
      },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      result,
    });
  }
);

export const addComment = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const { body, blog, tag } = req.body;
    if (!body || !blog || !mongoose.Types.ObjectId.isValid(blog))
      return next(new AppError("Please Provide all required information", 400));
    const result = await Comment.create({
      body,
      user: req.user,
      blog,
      tag,
    });
    res.status(201).json({
      status: "success",
      result,
    });
  }
);

export const editComment = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const { id, body } = req.body;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Please Provide the blog ID", 400));
    }
    if (!body) {
      return next(new AppError("Please Provide the blog body", 400));
    }
    const result = await Comment.findById(id);
    if (!result) return next(new AppError("There is no such a comment", 400));
    if (
      !new mongoose.Types.ObjectId(result.user || "").equals(
        new mongoose.Types.ObjectId(req.user._id)
      )
    )
      return next(new AppError("You are not authorized", 401));
    result.body = body;
    await result.save();
    res.status(200).json({
      status: "success",
      result,
    });
  }
);
