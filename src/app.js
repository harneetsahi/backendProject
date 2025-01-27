import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

/// parses json requests
app.use(express.json({ limit: "16kb" }));

/// parses url requests
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

/// to serve static assets from the public directory of your project
app.use(express.static("public"));

/// to save and update cookies
app.use(cookieParser());

export { app };
