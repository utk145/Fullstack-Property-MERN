import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        // required:true,
        required: [true, "Password is mandatory"]
    },
    avatar: {
        type: String, // we will use 3rd party url 
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    },

}, { timestamps: true })



export const User = mongoose.model("User", userSchema)