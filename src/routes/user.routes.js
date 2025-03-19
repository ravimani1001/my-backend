import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

//register route
router.route("/register").post(
    upload.fields([
        {
            //This name will be used to access this file
            //The frontend code (the form field) should have the same name
            name : "avatar",
            maxCount : 1
        },
        {
            name : "coverImage",
            maxCount : 1
        }
    ]),
    registerUser
)

//login route
router.route("/login").post(loginUser)

//logout route - secured
router.route("/logout").post(verifyJWT, logoutUser)

//refresh-token route - secured route
router.route("/refresh-token").post(refreshAccessToken)

export default router