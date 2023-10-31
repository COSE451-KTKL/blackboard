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
profRouter.route("/lecture/getStudentSubmit/:id").get();
profRouter.route("/student").get(getAllStudents);

export default profRouter;
