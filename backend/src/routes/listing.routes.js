import { Router } from "express"
import { createListing, deleteListing, getUserListings, } from "../controllers/listing.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/create-listing").post(verifyJWT, createListing)
router.route("/user-listings/:id").get(verifyJWT, getUserListings)
router.route("/delete-listing/:id").post(verifyJWT, deleteListing)

export default router;