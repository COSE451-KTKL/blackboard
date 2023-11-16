import User from "../models/User";
import Lecture from "../models/Lecture";
import Notice from "../models/Notice";
import Quiz from "../models/Quiz";
import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import cFileController from "./cFileController";
import profRouter from "../routers/profRouter";
import { UPLOADDIR, SRCDIR } from "./dir";

const updateLoggedInUser = async (req, user) => {
  req.session.loggedInUser = user;
  return;
};

//returns all the filenames of the submitted files paired with student , grade
const makeFileNames = async (lectureName, lectureId) => {
  try {
    const files = fs.readdirSync(
      path.join(UPLOADDIR, "lectures", lectureName, "quiz")
    );

    const filePromises = files
      .filter((file) => file.endsWith(".txt"))
      .map(async (file) => {
        const filename = file.slice(0, -4);
        const stuId = file.split("_")[1].split(".")[0];
        const student = await User.findOne({ stuId: stuId });
        if (student) {
          const grade = student.grade.find(
            (grade) => grade.lectureId == lectureId
          );
          return { student, filename, grade };
        } else return null;
      });

    const filenames = (await Promise.all(filePromises)).filter(
      (result) => result !== null
    );

    return filenames;
  } catch (err) {
    console.error(err);
    return;
  }
};

const makeLectureDiretory = (lectureName) => {
  const newDirectory = path.join(UPLOADDIR, "lectures", lectureName);
  fs.mkdirSync(newDirectory, { recursive: true });

  const noticeDirectory = path.join(newDirectory, "notice");
  const quizDirectory = path.join(newDirectory, "quiz");
  fs.mkdirSync(noticeDirectory, { recursive: true });
  fs.mkdirSync(quizDirectory, { recursive: true });
};

export const getAllLectures = async (req, res) => {
  try {
    const loggedInUser = req.session.loggedInUser;
    const lectures = await Lecture.find({ profId: loggedInUser._id });
    return res.render("prof/lecture.pug", {
      pageTitle: "lecture list",
      lectures,
    });
  } catch (errorMessage) {
    return res.status(400).render("prof/lecture.pug", {
      pageTitle: "error",
      lectures: null,
      errorMessage,
    });
  }
};

export const getNewLecture = async (req, res) => {
  try {
    return res.render("prof/newLecture.pug", { pageTitle: "open lecture" });
  } catch (errorMessage) {
    return res.status(400).render("prof/newLecture.pug", {
      pageTitle: "error",
      errorMessage,
    });
  }
};

export const postNewLecture = async (req, res) => {
  try {
    const { lectureName } = req.body;
    const { loggedInUser } = req.session;
    const { lectureIds } = loggedInUser;

    if (!lectureName || lectureName.trim() === "") {
      return res.status(400).render("prof/newLecture.pug", {
        pageTitle: "error",
        errorMessage: "There is no lecture name",
      });
    }
    if (lectureName.length > 20) {
      //this is the additional countermeasures for too long lecture Name
      return res.status(400).render("prof/newLecture.pug", {
        pageTitle: "error",
        errorMessage: "The lecture name is too long",
      });
    }
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
    //makes a directory inside the uploads with the lectureName for submitting txt
    makeLectureDiretory(lectureName);

    return res.redirect("/prof/lecture");
  } catch (errorMessage) {
    return res.status(400).render("prof/newLecture.pug", {
      pageTitle: "error",
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

    return res.render("lectureDetail.pug", {
      pageTitle: `${lecture.lectureName}`,
      lecture,
    });
  } catch (errorMessage) {
    return res.status(400).render("lectureDetail.pug", {
      pageTitle: "error",
      lecture: null,
      errorMessage,
    });
  }
};

export const getNewNotice = async (req, res) => {
  try {
    const lectureId = req.params.id;
    return res.render("prof/newNotice.pug", {
      pageTitle: "post notice",
      lectureId,
    });
  } catch (errorMessage) {
    return res.status(400).render("prof/newNotice.pug", {
      pageTitle: "error",
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
    const newLecture = await Lecture.findById(lectureId).populate("noticeIds");
    res.locals.lecture = newLecture;

    const lectureName = lecture.lectureName;
    const cfileDirectory = path.join(SRCDIR, "controllers", "saveNotice");
    try {
      await cFileController(cfileDirectory, [
        content,
        lectureName,
        newNoticeId,
      ]);
    } catch (error) {
      return res.status(400).render("lectureDetail", {
        pageTitle: "error",
        lecture: null,
        error,
      });
    }

    return res.render("lectureDetail.pug", {
      pageTitle: `${lecture.lectureName}`,
      lecture: newLecture,
    });
  } catch (errorMessage) {
    return res.status(400).render("lectureDetail.pug", {
      pageTitle: "error",
      lecture: null,
      errorMessage,
    });
  }
};

export const getNewQuiz = async (req, res) => {
  try {
    const lectureId = req.params.id;
    const lecture = Lecture.findById(lectureId);
    if (lecture.quizId) {
      return res.render("lectureDetail.pug", {
        pageTitle: `${lecture.lectureName}`,
        errorMessage: "Quiz is already posted.",
      });
    }
    return res.render("prof/newQuiz.pug", {
      pageTitle: "post quiz",
    });
  } catch (errorMessage) {
    return res.status(400).render("prof/newQuiz.pug", {
      pageTitle: "error",
      errorMessage,
    });
  }
};

export const postOneQuiz = async (req, res) => {
  try {
    const lectureId = req.params.id;
    const { quizProblem, quizAnswer } = req.body;
    const lecture = await Lecture.findById(lectureId);
    const newQuiz = await Quiz.create({
      lectureId,
      quizProblem,
      quizAnswer,
    });
    const professor = req.session.loggedInUser.name;
    const newQuizId = newQuiz._id;
    lecture.quizId = newQuizId;
    await Lecture.findByIdAndUpdate(lectureId, {
      quizId: newQuizId,
    });
    const newLecture = await Lecture.findById(lectureId).populate("quizId");
    const lectureName = newLecture.lectureName;
    const cfileDirectory = path.join(SRCDIR, "controllers", "saveProfQuiz");
    try {
      await cFileController(cfileDirectory, [
        lectureName,
        professor,
        quizProblem,
        quizAnswer,
      ]);
      console.log("complete");
    } catch (error) {
      return res.status(400).render("lectureDetail", {
        pageTitle: "error",
        lecture: null,
        error,
      });
    }

    res.locals.lecture = newLecture;
    return res.render("lectureDetail.pug", {
      pageTitle: `${lecture.lectureName}`,
      lecture: newLecture,
    });
  } catch (errorMessage) {
    return res.status(400).render("lectureDetail.pug", {
      pageTitle: "error",
      lecture: null,
      errorMessage,
    });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const loggedInUser = req.session.loggedInUser;
    const { lectureIds } = loggedInUser;
    const lectures = await Lecture.find({
      _id: { $in: lectureIds },
    }).populate("stuIds");
    return res.render("prof/students.pug", {
      pageTitle: "manage students",
      lectures,
    });
  } catch (errorMessage) {
    return res.status(400).render("prof/students.pug", {
      pageTitle: "error",
      lectures: null,
      errorMessage,
    });
  }
};

//get all the submits for the lecture
export const getLectureSubmits = async (req, res) => {
  try {
    const lectureId = req.params.lectureId;
    const lecture = await Lecture.findOne({
      _id: lectureId,
    });
    const { lectureName } = lecture;
    console.log(lectureName);
    const filenames = await makeFileNames(lectureName, lectureId);

    const validFiles = [];

    if (filenames) {
      for (const file of filenames) {
        const studentId = file.student.stuId;
        const student = User.find({ stuId: studentId });

        // Check if the student is enrolled in the lecture
        const isEnrolled = lecture.stuIds.some((stuId) => {
          return String(stuId) == String(student._id);
        });
        if (isEnrolled) {
          validFiles.push(file);
        }
      }
    }
    console.log(validFiles);

    return res.render("prof/showLectureSubmits.pug", {
      pageTitle: "show submitted assignments",
      filenames: validFiles,
      lecture: lecture,
    });
  } catch (errorMessage) {
    return res.status(400).render("prof/students.pug", {
      pageTitle: "error",
      lectures: null,
      errorMessage,
    });
  }
};

//show submit for particular student for lecture
export const showStudentSubmit = async (req, res) => {
  try {
    const lectureId = req.params.lectureId;
    console.log(lectureId);
    const studentId = req.params.stuId;
    console.log(studentId);
    const lecture = await Lecture.findById(lectureId);
    const student = await User.findOne({ stuId: studentId });
    const filepath = path.join(
      UPLOADDIR,
      "lectures",
      lecture.lectureName,
      "quiz",
      `${lecture.lectureName}_${studentId}.txt`
    );

    const data = fs.readFileSync(filepath, "utf8");

    return res.render("prof/gradeStudentSubmit.pug", {
      pageTitle: "score assignments",
      data: data,
      lecture: lecture,
      stuId: studentId,
      stuName: student.name,
    });
  } catch (errorMessage) {
    return res.status(400).render("prof/students.pug", {
      pageTitle: "error",
      lectures: null,
      errorMessage,
    });
  }
};

//grade the submit
export const gradeStudentSubmit = async (req, res) => {
  try {
    const lectureId = req.params.lectureId;
    const stuId = req.params.stuId;
    const { grading } = req.body;
    const student = await User.findOne({ stuId: stuId });
    const lecture = await Lecture.findById(lectureId);
    const grade = student.grade.find((grade) => grade.lectureId == lectureId);
    grade.grade = grading;
    grade.graded = true;
    await student.save();

    const filenames = await makeFileNames(lecture.lectureName, lecture._id);

    //return to showing all the lecture submits
    return res.render("prof/showLectureSubmits.pug", {
      pageTitle: "show submitted assignments",
      filenames: filenames,
      lecture: lecture,
    });
  } catch (errorMessage) {
    return res.status(400).render("prof/students.pug", {
      pageTitle: "error",
      lectures: null,
      errorMessage,
    });
  }
};
