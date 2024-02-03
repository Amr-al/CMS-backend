require('dotenv').config()
const multer = require('multer')
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
  secure: true,
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Blog",
  },
});
const upload = multer({ storage: storage });

export default upload