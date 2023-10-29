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
