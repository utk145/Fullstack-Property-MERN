import { Router } from "express"
import { changeCurrentPassword, deleteUser, getCurrentUser, logOutUser, loginUser, refreshAccessToken, registerUser, updateAccountDeatils, updateUserAvatar } from "../controllers/user.controller.js";
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
router.route("/update-details").post(verifyJWT, updateAccountDeatils)
router.route("/update-avatar").post(upload.fields([{ name: "avatar" }]), updateUserAvatar)
router.route("/delete-user").post(verifyJWT, deleteUser)
export default router;