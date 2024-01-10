import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createListing = asyncHandler(async (req, res) => {
    try {
        
    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong while creating a listing")
    }
})

export { createListing }