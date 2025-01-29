import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // although it's not good to have the original name because user may upload two files with the same name and it can overwrite the file
  },
});

export const upload = multer({ storage });
