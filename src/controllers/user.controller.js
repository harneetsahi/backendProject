import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

////!SECTION register user

const registerUser = asyncHandler(async (req, res) => {
  //// Logic Building
  // - get user details from frontend
  // - validate details to make it's not empty and is in correct format
  // - check if user already exists (via username or email)
  // - check for images and avatar
  // - upload them to cloudinary
  // - create user object to send to mongoDB
  // - create entry in DB. It sends us a response
  // - remove password and refresh token field from response
  // - check if user is successfully created
  // - return response or error if no creation

  const { fullname, username, email, password } = req.body;

  // console.log("study this: req.body ", req.body);

  if (
    ///.some method is checking if any of the fields after trimming the negative space are empty. If it is empty, it will return true and throw an error. You could also use write different if else statements instead.

    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({
    /// this syntax looks for both email and username in db
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, "Username or Email already exists");
  }

  // console.log("study this: req.files ", req.files);

  //// multer provides req.files method like express provides req.body method
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;

  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  //
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  //
  if (!avatar) {
    throw new ApiError(400, "Avatar is required");
  }

  //
  const user = await User.create({
    fullname,
    avatar: avatar.url, // we only want to save the url of avatar in db
    coverImage: coverImage?.url || "", // because we didn't write validation for coverimage since its not required
    email,
    password,
    username: username.toLowerCase(),
  });

  // checking if user was indeed created and removing password and refreshToken from it.
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  //
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

////!SECTION generate tokens (go through the login user method first)

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateRefreshToken();
    const refreshToken = user.generateAccessToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

////!SECTION login user

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, "Username or email is required");
  }

  const userExists = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!userExists) {
    throw new ApiError(
      400,
      "User does not exist. Please register before logging in"
    );
  }

  const isPasswordValid = await userExists.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials- wrong password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    userExists._id
  );

  const loggedInUser = await User.findById(userExists._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("access token", accessToken, options)
    .cookie("refresh token", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

////!SECTION logout user

const logoutUser = asyncHandler(async (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

export { registerUser, loginUser, logoutUser };
