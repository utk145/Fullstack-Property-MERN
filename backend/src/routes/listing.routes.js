import { Router } from "express"
import { createListing, } from "../controllers/listing.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/create-listing").post(verifyJWT, createListing)

export default router;