import User from "../models/User";
import Lecture from "../models/Lecture";
import Notice from "../models/Notice";
import Quiz from "../models/Quiz";

const updateLoggedInUser = async (req, user) => {
    req.session.loggedInUser = user;
    return;
};

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

export const postNewLecture = async (req, res) => {
    try {
        const { lectureName } = req.body;
        const { loggedInUser } = req.session;
        const { lectureIds } = loggedInUser;

        const newLecture = await Lecture.create({
            profId: loggedInUser._id,
            stuIds: [],
            lectureName,
        });
        if (!lectureIds.includes(newLecture._id)) {
            await lectureIds.push(newLecture._id);
        }

        await User.findByIdAndUpdate(loggedInUser._id, {
            lectureIds,
        });
        const newUser = await User.findById(loggedInUser._id);
        await updateLoggedInUser(req, newUser);

        return res.redirect("/prof/lecture");
    } catch (errorMessage) {
        return res.status(400).render("prof/newLecture.pug", {
            pageTitle: "에러",
            errorMessage,
        });
    }
};

export const getOneLecture = async (req, res) => {
    try {
        const lectureId = req.params.id;
        const lecture = await Lecture.findById(lectureId).populate("noticeIds");
        return res.render("lectureDetail.pug", {
            pageTitle: `${lecture.lectureName}`,
            lecture,
        });
    } catch (errorMessage) {
        return res.status(400).render("lectureDetail.pug", {
            pageTitle: "에러",
            lecture: null,
            errorMessage,
        });
    }
};

export const getNewNotice = async (req, res) => {
    try {
        const lectureId = req.params.id;
        return res.render("prof/newNotice.pug", {
            pageTitle: "게시물 작성",
            lectureId,
        });
    } catch (errorMessage) {
        return res.status(400).render("prof/newNotice.pug", {
            pageTitle: "에러",
            errorMessage,
            lectureId: null,
        });
    }
};

export const postOneNotice = async (req, res) => {
    try {
        const lectureId = req.params.id;
        const { content } = req.body;
        const lecture = await Lecture.findById(lectureId);
        const { noticeIds } = lecture;
        const newNotice = await Notice.create({
            lectureId,
            content,
        });
        const newNoticeId = newNotice._id;
        if (!noticeIds.includes(newNoticeId)) {
            await noticeIds.push(newNoticeId);
        }
        await Lecture.findByIdAndUpdate(lectureId, {
            noticeIds,
        });
        const newLecture = await Lecture.findById(lectureId).populate(
            "noticeIds"
        );
        res.locals.lecture = newLecture;
        return res.render("lectureDetail.pug", {
            pageTitle: `${lecture.lectureName}`,
            lecture: newLecture,
        });
    } catch (errorMessage) {
        return res.status(400).render("lectureDetail.pug", {
            pageTitle: "에러",
            lecture: null,
            errorMessage,
        });
    }
};
