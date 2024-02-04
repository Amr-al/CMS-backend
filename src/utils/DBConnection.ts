import mongoose from "mongoose";
export const conect = async () => {
  try {
  
    mongoose
      .connect(process.env.DB_URL!, {})
      .then(() => {
        console.log("database Connected");
      })
      .catch((error: any) => {
        console.log(error);
      });
  } catch (err) {
    console.log(err);
  }
};
