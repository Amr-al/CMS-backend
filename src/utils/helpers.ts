import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


export const generateToken = (data: Object): string => {
  const token: string = jwt.sign(data, process.env.JWT_SECRET || "secret", {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

export const changedPasswordAfter = (
  JWTTimestamp: number,
  passwordChangedAt
): Boolean => {
  if (passwordChangedAt) {
    const changedTimestamp = parseInt(passwordChangedAt.getTime()) / 1000;
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

export const correctPassword = async  (
    candidatePassword: string,
    userPassword: string
  )=> {
    return await bcrypt.compare(candidatePassword, userPassword);
  };