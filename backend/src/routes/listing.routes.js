import { Router } from "express"
import { createListing, deleteListing, getListingInfo, getUserListings, updateListing, } from "../controllers/listing.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/create-listing").post(verifyJWT, createListing)
router.route("/user-listings/:id").get(verifyJWT, getUserListings)
router.route("/delete-listing/:id").post(verifyJWT, deleteListing)
router.route("/update-listing/:id").post(verifyJWT, updateListing)
router.route("/get-listing-info/:id").get(getListingInfo)

export default router;