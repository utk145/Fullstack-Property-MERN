import mongoose from "mongoose";


const listingSchema = new mongoose.Schema({}, { timestamps: true })



export const Listing = mongoose.model("Listing", listingSchema)