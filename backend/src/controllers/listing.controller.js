import { Listing } from "../models/listing.models.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js"

const createListing = asyncHandler(async (req, res) => {
    try {
        const { name, description, address, regularPrice, discountPrice, bathrooms, bedrooms, parking, type, offer, furnished, userRef, imageUrls } = req.body;

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

const getUserListings = asyncHandler(async (req, res) => {

    const listings = await Listing.find({ userRef: req.params.id })
    if (!listings) {
        throw new ApiError(404, "Listings associated with this account not found")
    }

    return res.status(200).json(new ApiResponse(200, listings, "Listings fetched successfully"))

})

const deleteListing = asyncHandler(async (req, res) => {
    // console.log(req.user);
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        throw new ApiError(404, "Listing not found")
    }

    if (req.user.id !== listing.userRef) {
        throw new ApiError(401, "You are unauthorized to perform this action")
    }
    /* In Mongoose, when you define a schema, the _id field is automatically added to the schema as an ObjectId. Mongoose also
       provides a virtual getter for the id field, which returns a string representation of the _id. 
       This is why req.user.id works while req.user._id might not work as expected in some cases.
    */

    await Listing.findByIdAndDelete(req.params.id);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Listing deleted successfully"))


})

const updateListing = asyncHandler(async (req, res) => {

    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        throw new ApiError(404, "Listing couldn't be found")
    };

    if (req.user.id !== listing.userRef) {
        throw new ApiError(401, "Unauthorized to access this request of editing a listing")
    };

    const updatedListing = await Listing.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, updatedListing, "Listing has been successfully updated"))

})

const getListingInfo = asyncHandler(async (req, res) => {
    const listingDetails = await Listing.findById(req.params.id);
    if (!listingDetails) {
        throw new ApiError(404, "No listing found with that id")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, listingDetails, "Listing info fetched successfully"))
})

const getAllListings = asyncHandler(async (req, res) => {

    try {
        const limit = parseInt(req.query.limit) || 8;
        const startIndex = parseInt(req.query.startIndex) || 0;

        let offer = req.query.offer;
        if (offer === undefined || offer === 'false') {
            offer = { $in: [true, false] }
        }

        let furnished = req.query.furnished;
        if (furnished === undefined || furnished === 'false') {
            furnished = { $in: [true, false] }
        }


        let parking = req.query.parking;
        if (parking === undefined || parking === 'false') {
            parking = { $in: [true, false] }
        }
        let type = req.query.type;
        if (type === undefined || type === 'all') {
            type = { $in: ["rent", "sell"] }
        }


        const searchTerm = req.query.searchTerm || "";
        const sort = req.query.sort || "createdAt";
        const order = req.query.order || "desc";

        const listings = await Listing.find(
            {
                name: {
                    $regex: searchTerm, /* regex will enable find everywhere in the data */
                    $options: 'i' /* ignores upper and lower case */
                },
                offer,
                furnished,
                parking,
                type
            }
        )
            .sort({ [sort]: order })
            .limit(limit)
            .skip(startIndex);


        return res
            .status(200)
            .json(new ApiResponse(200, listings, "Fetched"))

    } catch (error) {
        throw new ApiError(400, error.message)
    }


})

export { createListing, getUserListings, deleteListing, updateListing, getListingInfo, getAllListings }