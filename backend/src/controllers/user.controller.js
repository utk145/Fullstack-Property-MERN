import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.models.js";
import { uploadOnImagekit } from "../utils/imagekit.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    /* Steps:
    1. get user details from frontend
    2. validation- fields not empty
    3. check if user already exists - username, email
    4. check for image -  avatar
    5. upload to imagekit
    6. check if avatar uploaded successfully
    7. create user object entry in db
    8. remove password and refreshToken field. it shouldnt be available on frontend
    9. check for user creation
    10. if created return response, else error
    */


    const { username, password, email } = req.body;
    console.table([username, password, email])

    // Validation
    if ([username, email, password].some((entry) => entry?.trim() === "")) {
        throw new ApiError(400, "All fields are compulsory..");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with username or email already exists..")
    }



    // multer gives req.files
    const avatarLocalPath = req.files?.avatar[0]?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is compulsory")
    }

    const avatar = await uploadOnImagekit(avatarLocalPath)
    if (!avatar) {
        throw new ApiError(400, "Avatar file is compulsory")
    }

    const user = await User.create({
        username: username.toLowerCase(),
        avatar: avatar.url,
        password,
        email
    })


    const userCreated = await User.findById(user._id).select("-password -refreshToken");
    if (!userCreated) {
        throw new ApiError(500, "Something went wrong while registering the user..")
    }

    return res.status(201).json(
        new ApiResponse(200, userCreated, "User registered successfully..")
    )

})



export { registerUser }