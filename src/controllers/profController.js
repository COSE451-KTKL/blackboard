import User from "../models/User";
import Lecture from "../models/Lecture";
import Notice from "../models/Notice";
import Quiz from "../models/Quiz";
export const getAllLectures = async (req, res) => {
    try {
        const loggedInUser = req.session.loggedInUser;
        const lectures = await Lecture.find({ profId: loggedInUser._id });
        return res.render("prof/lecture.pug", {
            pageTitle: "강의 목록",
            lectures,
        });
    } catch (errorMessage) {
        return res.status(400).render("prof/lecture.pug", {
            pageTitle: "에러",
            lectures: null,
            errorMessage,
        });
    }
};

export const getNewLecture = async (req, res) => {
    try {
        return res.render("prof/newLecture.pug", { pageTitle: "강의 개설" });
    } catch (errorMessage) {
        return res.status(400).render("prof/newLecture.pug", {
            pageTitle: "에러",
            errorMessage,
        });
    }
};

