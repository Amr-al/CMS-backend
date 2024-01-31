import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
const { promisify } = require("util");
import User from "../models/userModel";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { reqInterface } from "../utils/interfaces";
import {
  generateToken,
  changedPasswordAfter,
  correctPassword,
} from "../utils/helpers";

export const signUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, passwordConfirm } = req.body;
    const user = await User.create({
      name,
      email,
      password,
      passwordConfirm,
    });
    const token: string = generateToken({
      id: user._id,
      name: user.name,
      image: user.image,
    });
    res.status(200).json({
      status: "success",
      user,
      token,
    });
  }
);

export const signIn = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    // validation of the input
    if (!email || !password) {
      return next(new AppError("Please Enter your email and password", 400));
    }

    // check if email and password are correct
    const user = await User.findOne({ email }).select("+password");
    const correct: Boolean = await correctPassword(
      password,
      user?.password || ""
    );
    if (!user || !correct) {
      return next(new AppError("email or password is incorrect", 401));
    }

    // return the response
    const token = generateToken({
      id: user._id,
      name: user.name,
      image: user.image,
    });
    res.status(200).json({
      status: "success",
      token,
    });
  }
);

exports.protect = catchAsync(
  async (req: reqInterface, res: Response, next: NextFunction) => {
    // Getting token and check of it's there.
    let token: string | undefined = undefined;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(
        new AppError("You are not logged in! please log in to get access", 401)
      );
    }

    // verification token
    const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // check if user still exists
    const user = await User.findById(decode.id);
    if (!user) {
      return next(
        new AppError(
          "The token belonging to this user does no longer exists",
          401
        )
      );
    }

    // check if user changed password after the token was issued.
    if (changedPasswordAfter(decode.iat, user.passwordChangedAt)) {
      return next(
        new AppError("User recently changed password! Please log in again", 401)
      );
    }

    // ACCESS TO PROTECTED ROUTE
    req.user = user;
    next();
  }
);
