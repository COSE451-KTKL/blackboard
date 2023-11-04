import User from "../models/User";
import Lecture from "../models/Lecture";
import Notice from "../models/Notice";
import Quiz from "../models/Quiz";
import fs from "fs";
import path from "path";
import { spawn } from "child_process";

const updateLoggedInUser = async (req, user) => {
  req.session.loggedInUser = user;
  return;
};

const makeFileNames = async (lectureName, lectureId) => {
  try {
    const files = fs.readdirSync(path.join("./uploads", lectureName));
    const filenames = await Promise.all(
      files
        .filter((file) => file.endsWith(".txt"))
        .map(async (file) => {
          const filename = file.slice(0, -4);
          const stuId = file.split("_")[1].split(".")[0];
          const student = await User.findOne({ stuId: stuId });
          const grade = student.grade.find(
            (grade) => grade.lectureId == lectureId
          );
          return { student, filename, grade };
        })
    );
    return filenames;
  } catch (err) {
    console.error(err);
    return;
  }
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
    x;
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
    //makes a directory inside the uploads with the lectureName for submitting txt
    const newDirectory = path.join("uploads", lectureName);
    // const newDirectory = "./uploads";
    console.log(newDirectory);

    fs.mkdirSync(newDirectory, { recursive: true }, (err) => {
      if (err) {
        console.log(err);
      }
      console.log("???");
    });

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
    const lecture = await Lecture.findById(lectureId)
      .populate("noticeIds")
      .populate("quizId");
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
    const newLecture = await Lecture.findById(lectureId).populate("noticeIds");
    res.locals.lecture = newLecture;

    const lectureName = lecture.lectureName;
    const cfileDirectory = path.join(
      "src",
      "controllers",
      "saveNotice",
    );
    const process = spawn(cfileDirectory, [content, lectureName, newNoticeId]);

    const closeProcess = new Promise((resolve, reject) => {
      process.on("close", (code) => {
        if (code != 0) {
          reject(new Error("Non-zero exit code"));
        } else {
          resolve();
        }
      });
      process.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
      });
      process.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
      });
    });

    try {
      await closeProcess;
    } catch (error) {
      return res.status(400).render("lectureDetail", {
        pageTitle: "에러",
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
      pageTitle: "에러",
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
        errorMessage: "이미 퀴즈가 등록되어 있습니다.",
      });
    }
    return res.render("prof/newQuiz.pug", {
      pageTitle: "퀴즈 등록",
    });
  } catch (errorMessage) {
    return res.status(400).render("prof/newQuiz.pug", {
      pageTitle: "에러",
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
    const newQuizId = newQuiz._id;

    lecture.quizId = newQuizId;
    await Lecture.findByIdAndUpdate(lectureId, {
      quizId: newQuizId,
    });
    const newLecture = await Lecture.findById(lectureId).populate("quizId");
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

export const getAllStudents = async (req, res) => {
  try {
    const loggedInUser = req.session.loggedInUser;
    const { lectureIds } = loggedInUser;
    const lectures = await Lecture.find({
      _id: { $in: lectureIds },
    }).populate("stuIds");
    return res.render("prof/students.pug", {
      pageTitle: "수강 학생 관리",
      lectures,
    });
  } catch (errorMessage) {
    return res.status(400).render("prof/students.pug", {
      pageTitle: "에러",
      lectures: null,
      errorMessage,
    });
  }
};

export const getLectureSubmits = async (req, res) => {
  try {
    const lectureId = req.params.lectureId;
    const lecture = await Lecture.findOne({
      _id: lectureId,
    });
    const { lectureName } = lecture;
    console.log(lectureName);
    const filenames = await makeFileNames(lectureName, lectureId);

    return res.render("prof/showLecturesubmits.pug", {
      pageTitle: "제출된 과제 보기",
      filenames: filenames,
      lecture: lecture,
    });
  } catch (errorMessage) {
    return res.status(400).render("prof/students.pug", {
      pageTitle: "에러",
      lectures: null,
      errorMessage,
    });
  }
};

export const showStudentSubmit = async (req, res) => {
  try {
    const lectureId = req.params.lectureId;
    console.log(lectureId);
    const studentId = req.params.stuId;
    console.log(studentId);
    const lecture = await Lecture.findById(lectureId);
    const student = await User.findOne({ stuId: studentId });
    const filepath = path.join(
      "./uploads",
      lecture.lectureName,
      `${lecture.lectureName}_${studentId}.txt`
    );

    const data = fs.readFileSync(filepath, "utf8");

    return res.render("prof/gradeStudentSubmit.pug", {
      pageTitle: "과제 점수 매기기",
      data: data,
      lecture: lecture,
      stuId: studentId,
      stuName: student.name,
    });
  } catch (errorMessage) {
    return res.status(400).render("prof/students.pug", {
      pageTitle: "에러",
      lectures: null,
      errorMessage,
    });
  }
};

export const gradeStudentSubmit = async (req, res) => {
  try {
    const lectureId = req.params.lectureId;
    const stuId = req.params.stuId;
    const { profGrade } = req.body;
    const student = await User.findOne({ stuId: stuId });
    const lecture = await Lecture.findById(lectureId);
    const grade = student.grade.find((grade) => grade.lectureId == lectureId);
    grade.grade = profGrade;
    grade.graded = true;
    await student.save();

    const filenames = await makeFileNames(lecture.lectureName, lecture._id);

    //return to showing all the lecture submits
    return res.render("prof/showLectureSubmits.pug", {
      pageTitle: "제출된 과제 보기",
      filenames: filenames,
      lecture: lecture,
    });
  } catch (errorMessage) {
    return res.status(400).render("prof/students.pug", {
      pageTitle: "에러",
      lectures: null,
      errorMessage,
    });
  }
};
