import { Router } from "express"
import { changeCurrentPassword, getCurrentUser, logOutUser, loginUser, refreshAccessToken, registerUser, updateAccountDeatils } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/register")
    .post(
        upload.fields([{ name: "avatar" }]),
        registerUser
    )

router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logOutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/update-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").post(verifyJWT, getCurrentUser)
router.route("/update-details").post(verifyJWT,updateAccountDeatils)

export default router;