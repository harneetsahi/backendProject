import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "ok",
  });

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
  console.log("email: ", email);

  if (
    ///.some method is checking if any of the fields after trimming the negative space are empty. If it is empty, it will return true and throw an error. You could also use write different if else statements instead.

    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = User.findOne({
    /// this syntax looks for both email and username in db
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, "Username or Email already exists");
  }

  //// multer provides req.files method like express provides req.body method
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // we write [0] because images have a lot of properties like jpeg, png, size but we need the first property which has an object called path.

  // console.log(avatarLocalPath);

  const coverImageLocalPath = req.files?.coverImage[0]?.path;

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

export { registerUser };
