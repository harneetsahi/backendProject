import "dotenv/config";
import connectDB from "./db/index.js";

connectDB();

/* 
we are not using this approach for calling express here. But just for reference, here is how it's done if need be:

import express from "express";

const app = express();

(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

    app.on("error", (error) => {
      console.log(error);
      throw error;
    });

    app.listen(process.env.PORT, () => {
      console.log(`App is listening on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("ERRPR: ", error);
  }
})();


*/
