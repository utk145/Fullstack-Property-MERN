import { Listing } from "../models/listing.models.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js"

const createListing = asyncHandler(async (req, res) => {
    try {
        const { name, description, address, regularPrice, discountPrice, bathrooms, bedrooms, parking, type, offer, furnished, userRef } = req.body;

        if ([name, description, address, type, userRef].some((entry) => !entry || entry?.trim() === "")) {
            throw new ApiError(400, "All fields are required")
        }

        if (typeof regularPrice !== 'number' || typeof discountPrice !== 'number' ||
            typeof bathrooms !== 'number' || typeof bedrooms !== 'number' ||
            typeof parking !== 'boolean' || typeof offer !== 'boolean') {
            throw new ApiError(400, "Invalid data types for some fields");
        }

        if (regularPrice < 0 || discountPrice < 0 || bathrooms < 0 || bedrooms < 0) {
            throw new ApiError(400, "Numeric fields must be non-negative");
        }

        const imageUrls = ["fh", "gf"]
        const listing = await Listing.create({
            name, description, address, regularPrice, discountPrice, bathrooms, bedrooms, parking, type, offer, furnished, userRef, imageUrls
        })

        const listingCreated = await Listing.findById(listing._id)
        if (!listingCreated) {
            throw new ApiError(500, "Something went wrong while creating a listing..")
        }

        return res
            .status(201)
            .json(new ApiResponse(200, listingCreated, "Listing created successfully"))

    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong while creating a listing")
    }
})

export { createListing }