import { v2 as cloudinary } from "cloudinary";
import { log } from "console";
import fs from "fs";

//// configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//// upload
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // upload file
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // console.log("study this: from cloudinary ", response);

    fs.unlinkSync(localFilePath); // remove locally saved temporary file if upload operation is successful
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove locally saved temporary file if upload operation fails

    console.log("", error);
    return null;
  }
};

export { uploadOnCloudinary };
