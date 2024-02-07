import { NextFunction } from "express";
import bcrypt from "bcrypt";
import {isEmail} from "validator";

import mongoose from "mongoose";
interface User {
  name: string;
  emai: string;
  password: string;
  passwordConfirm: string;
  image?: string;
  passwordChangedAt?: Date;
}
const userModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Provide your email"],
      maxLength: 40,
    },
    email: {
      type: String,
      required: [true, "please provide your email"],
      unique: true,
      maxLength: 40,
      validate: {
        validator: function (el: string) {
          return isEmail(el);
        },
        message: "Email is Invailed",
      },
    },
    password: {
      type: String,
      required: [true, "Please provide your password"],
      maxLength: 50,
      minLenght: 5,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (this: User, el: string) {
          return el == this.password;
        },
        message: "Passwords are not the same",
      },
    },
    image: {
      type: String,
      default:
        "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg",
    },
    passwordChangedAt: Date,
  },
  { timestamps: true }
);
userModel.pre("save", async function (next) {
  const user: any = this;
  // Only run this function if password was modified
  if (!user.isModified("password")) return next();

  // Hash the password with cost of 12
  user.password = await bcrypt.hash(user.password, 12);

  // Delete passwordConfirm field
  user.passwordConfirm = undefined;
  next();
});

const User = mongoose.model("User", userModel);

export default User;
