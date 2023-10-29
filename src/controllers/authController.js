import User from "../models/User";
import bcrypt from "bcrypt";

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

export const postSignup = async (req, res) => {
    try {
        const { id, pw, name, stuId, userType } = req.body;
        if (userType === "professor" && stuId) {
            stuId = "";
        }

        if (userType === "student" && !stuId) {
            return res.render("signup", {
                pageTitle: "회원가입",
                errorMessage:
                    "학생 회원은 학번을 반드시 입력해야 합니다. 다시 시도해주세요.",
            });
        }

        const existsId = await User.exists({ id });
        if (existsId) {
            return res.status(400).render("signup", {
                pageTitle: "회원가입",
                errorMessage:
                    "같은 아이디를 가진 계정이 이미 존재합니다. 다시 시도해주세요.",
            });
        }
        const existsStuId =
            (await User.exists({ stuId })) && userType === "student";
        if (existsStuId) {
            return res.status(400).render("signup", {
                pageTitle: "회원가입",
                errorMessage:
                    "같은 학번을 가진 계정이 이미 존재합니다. 다시 시도해주세요.",
            });
        }

        const user = await User.create({
            id,
            pw,
            name,
            stuId,
            userType,
            lectureIds: [],
        });
        loginUserToSession(req, user);
        return res.redirect("/");
    } catch (errorMessage) {
        return res.status(400).render("signup", {
            pageTitle: "에러",
            errorMessage,
        });
    }
};

export const getLogin = (req, res) => {
    try {
        return res.render("login", { pageTitle: "로그인" });
    } catch (errorMessage) {
        return res
            .status(400)
            .render("login", { pageTitle: "에러", errorMessage });
    }
};

export const postLogin = async (req, res) => {
    try {
        const { id, pw } = req.body;
        const user = await User.findOne({ id });
        if (!user) {
            return res.status(400).render("login", {
                pageTitle: "로그인",
                errorMessage: "계정이 존재하지 않습니다. 다시 시도해주세요.",
            });
        }
        const ok = await bcrypt.compare(pw, user.pw);
        if (!ok) {
            return res.status(400).render("login", {
                pageTitle: "로그인",
                errorMessage:
                    "비밀번호가 올바르지 않습니다. 다시 시도해주세요.",
            });
        }
        loginUserToSession(req, user);
        return res.redirect("/");
    } catch (errorMessage) {
        return res.status(400).render("login", {
            pageTitle: "에러",
            errorMessage,
        });
    }
};

export const getLogout = async (req, res) => {
    try {
        req.session.destroy();
        return res.redirect("/");
    } catch (errorMessage) {
        return res.status(400).render("home", {
            pageTitle: "에러",
            errorMessage,
        });
    }
};
