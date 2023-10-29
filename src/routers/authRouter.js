import express from "express";
import {
    getLogin,
    postLogin,
    getSignup,
    postSignup,
    getLogout,
} from "../controllers/authController";
import { onlyIsLoggedIn, onlyIsLoggedOut } from "../middleware";

const authRouter = express.Router();

authRouter.route("/login").all(onlyIsLoggedOut).get(getLogin).post(postLogin);
authRouter
    .route("/signup")
    .all(onlyIsLoggedOut)
    .get(getSignup)
    .post(postSignup);
authRouter.route("/logout").all(onlyIsLoggedIn).get(getLogout);

export default authRouter;
