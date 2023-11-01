import express from "express";
import {
  getAllLectures,
  getNewLecture,
  postNewLecture,
  getOneLecture,
  getNewNotice,
  postOneNotice,
  getNewQuiz,
  postOneQuiz,
  getAllStudents,
  getLectureSubmits,
  showStudentSubmit,
  gradeStudentSubmit,
} from "../controllers/profController";
import { onlyIsLoggedIn, isProf } from "../middleware";

const profRouter = express.Router();

//apply all middle ware to lower routers
profRouter.use(onlyIsLoggedIn, isProf);

profRouter.route("/lecture").get(getAllLectures);
profRouter
  .route("/lecture/newLecture")

  .get(getNewLecture)
  .post(postNewLecture);
profRouter
  .route("/lecture/newNotice/:id")

  .get(getNewNotice)
  .post(postOneNotice);
profRouter
  .route("/lecture/newQuiz/:id")

  .get(getNewQuiz)
  .post(postOneQuiz);
profRouter.route("/lecture/:id").get(getOneLecture);
profRouter.route("/student").get(getAllStudents);
//this is for prof to see all the submit for lecture
profRouter
  .route("/lecture/showLectureSubmits/:lectureId")
  .get(getLectureSubmits);

profRouter
  .route("/lecture/gradeStudentSubmit/:lectureId/:stuId")
  .get(showStudentSubmit)
  .post(gradeStudentSubmit);

export default profRouter;
