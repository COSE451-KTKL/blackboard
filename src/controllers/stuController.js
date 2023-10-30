import Lecture from "../models/Lecture";
import User from "../models/User";
import Quiz from "../models/Quiz";

const updateLoggedInUser = async (req, user) => {
    req.session.loggedInUser = user;
    return;
};

export const getSugang = async (req, res) => {
    try {
        const loggedInUser = req.session.loggedInUser;
        const sugangLectureIds = loggedInUser.lectureIds;
        const lectures = await Lecture.find({})
            .sort({ createdAt: "desc" })
            .populate("profId");

        res.render("stu/sugang", {
            pageTitle: "수강신청",
            lectures,
            sugangLectureIds,
        });
    } catch (errorMessage) {
        return res.status(400).render("stu/sugang", {
            pageTitle: "에러",
            lectures: null,
            errorMessage,
        });
    }
};

