import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.models.js";
import { uploadOnImagekit } from "../utils/imagekit.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

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

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })


        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh tokens.. ")
    }
}

const loginUser = asyncHandler(async (req, res) => {
    /* Algorithm:
    1. get data from req.body
    2. login using email or username
    3. find the user
    4. if user exists, password check
    5. if password correct then generate both access and refresh token
    6. send them in secure cookies
    7. success response 
    */

    const { email, password } = req.body;
    console.log(email);

    if (!email) {
        throw new ApiError(400, "Email is compulsorily required")
    }

    const existedUser = await User.findOne({ email })
    if (!existedUser) {
        throw new ApiError(400, "User doesn't exist")
    }

    const isPasswordValid = await existedUser.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Entered password isn't valid credential")
    }

    const { refreshToken, accessToken } = await generateAccessAndRefreshToken(existedUser._id)

    const loggedInUser = await User.findById(existedUser._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }; // these options so that cookies could be modified only from the server, because they are by default modifiable by client

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200,
            { user: loggedInUser, accessToken, refreshToken },
            "User logged-in successfully"
        ))

})


const logOutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully.."))

})

// This will act as an endpoint for frontend to update access token instead of re-signin the session if error 401 is received
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized access")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }


        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user?._id)

        const options = {
            httpOnly: true,
            secure: true
        }


        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, user, "Access token refreshed successfully"));

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    // console.log("oldpass",oldPassword);

    try {
        const user = await User.findById(req.user?._id)

        const isPasswordValid = await user.isPasswordCorrect(oldPassword)
        if (!isPasswordValid) {
            throw new ApiError(400, "Incorrect old password ")
        }

        user.password = newPassword;
        await user.save({ validateBeforeSave: false })

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Password changed successfully"))
    } catch (error) {
        console.error(error);
    }

})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "Current user fetched successfully"))
})

export { registerUser, loginUser, logOutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser }