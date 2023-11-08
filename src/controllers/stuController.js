import Lecture from "../models/Lecture";
import User from "../models/User";
import Quiz from "../models/Quiz";
import { spawn } from "child_process";
import path from "path";
import cFileController from "./cFileController";

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

export const postSugang = async (req, res) => {
  try {
    const newLectureId = req.body.lectureId;

    const loggedInUser = req.session.loggedInUser;
    const { lectureIds } = loggedInUser;

    if (!lectureIds.includes(newLectureId)) {
      await lectureIds.push(newLectureId);
    }

    await User.findByIdAndUpdate(loggedInUser._id, {
      lectureIds,
    });
    const newUser = await User.findById(loggedInUser._id);
    await updateLoggedInUser(req, newUser);

    const { stuIds } = await Lecture.findById(newLectureId);
    if (!stuIds.includes(loggedInUser._id)) {
      await stuIds.push(loggedInUser._id);
    }
    await Lecture.findByIdAndUpdate(newLectureId, { stuIds });

    return res.redirect("/stu/sugang");
  } catch (errorMessage) {
    return res.status(400).render("stu/sugang", {
      pageTitle: "에러",
      lectures: null,
      errorMessage,
    });
  }
};

export const getAllLectures = async (req, res) => {
  try {
    const loggedInUser = req.session.loggedInUser;
    const lectureIds = loggedInUser.lectureIds;
    const lectures = await Lecture.find({ _id: { $in: lectureIds } });
    return res.render("stu/lecture", {
      pageTitle: "수강중인 강의",
      lectures,
    });
  } catch (errorMessage) {
    return res.status(400).render("stu/lecture", {
      pageTitle: "에러",
      lectures: null,
      errorMessage,
    });
  }
};

export const getOneLecture = async (req, res) => {
  try {
    const lectureId = req.params.id;
    const lecture = await Lecture.findById(lectureId)
      .populate("noticeIds")
      .populate("quizId");

    const user = req.session.loggedInUser;
    //checking for user grade
    if (user.grade) {
      const lectureGrade = user.grade.find(
        (grade) => grade.lectureId === lectureId
      );

      var submitted = false;
      if (lectureGrade) submitted = true;

      return res.render("lectureDetail.pug", {
        pageTitle: `${lecture.lectureName}`,
        lecture,
        submitted: submitted, //checks whether user submitted
        grade: lectureGrade,
      });
    }
    //no grade
    return res.render("lectureDetail.pug", {
      pageTitle: `${lecture.lectureName}`,
      lecture,
      submitted: false,
    });
  } catch (errorMessage) {
    return res.status(400).render("lectureDetail", {
      pageTitle: "에러",
      lecture: null,
      errorMessage,
    });
  }
};

export const postOneQuiz = async (req, res) => {
  try {
    const lectureId = req.params.id;
    const lecture = await Lecture.findById(lectureId)
      .populate("noticeIds")
      .populate("quizId");
    console.log(req.session.loggedInUser);
    const userId = req.session.loggedInUser._id;
    const user = await User.findById(userId);
    const filename = req.file.filename;
    const lectureName = lecture.lectureName;
    const studentId = user.stuId;
    console.log("studentId", studentId);
    const cfileDirectory = path.join(
      "src",
      "controllers",
      "saveQuizsubmit"
    );
    //runs the saveQuizSubmit => saves temp file submite to letureName folder
    try {
      await cFileController(cfileDirectory, [filename, lectureName, studentId]);
    } catch (error) {
      return res.status(400).render("lectureDetail", {
        pageTitle: "에러",
        lecture: null,
        error,
      });
    }
    const grade = {
      lectureId: lectureId,
      quizId: lecture.quizId,
      graded: false,
      grade: 0,
    };

    user.grade.push(grade);
    await user.save();

    await updateLoggedInUser(req, user);
    console.log(user);
    return res.render("lectureDetail.pug", {
      pageTitle: `${lecture.lectureName}`,
      lecture,
      submitted: true,
      grade: grade,
    });
  } catch (errorMessage) {
    return res.status(400).render("lectureDetail", {
      pageTitle: "에러",
      lecture: null,
      errorMessage,
    });
  }
};
