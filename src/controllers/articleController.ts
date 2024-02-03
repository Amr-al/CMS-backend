import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import Article from "../models/articleModel";

export const createArticle = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    let { title, body, tags } = req.body;
    if (!title) {
      return res.status(400).json({
        status: "fail",
        message: "Please Enter the title of your blog",
      });
    }
    if (!body) {
      return res.status(400).json({
        status: "fail",
        message: "Please Enter the body of your blog",
      });
    }
    if (tags) tags = JSON.parse(tags);
    const article = await Article.create({
      title,
      body,
      image: req.file?.path,
      tags,
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
    const result = await Article.findById(req.params.id);
    res.status(200).json({
      status: "success",
      result,
    });
  }
);

export const deleteArticle = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await Article.findByIdAndDelete(req.params.id);
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
