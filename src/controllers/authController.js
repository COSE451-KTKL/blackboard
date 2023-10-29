import User from "../models/User";
const loginUserToSession = (req, user) => {
    req.session.isLoggedIn = true;
    req.session.loggedInUser = user;
};

export const getSignup = (req, res) => {
    try {
        return res.render("signup", { pageTitle: "회원가입" });
    } catch (errorMessage) {
        return res
            .status(400)
            .render("signup", { pageTitle: "에러", errorMessage });
    }
};
