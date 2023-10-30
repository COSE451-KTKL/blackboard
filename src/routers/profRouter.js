import express from "express";
import {
    getAllLectures,
    getNewLecture,
    postNewLecture,
    getOneLecture,
    getNewNotice,
    postOneNotice,
    // getNewQuiz,
    // postOneQuiz,
    getAllStudents,
} from "../controllers/profController";
import { onlyIsLoggedIn } from "../middleware";

const profRouter = express.Router();

profRouter.route("/lecture").all(onlyIsLoggedIn).get(getAllLectures);
profRouter
    .route("/lecture/newLecture")
    .all(onlyIsLoggedIn)
    .get(getNewLecture)
    .post(postNewLecture);
profRouter
    .route("/lecture/newNotice/:id")
    .all(onlyIsLoggedIn)
    .get(getNewNotice)
    .post(postOneNotice);
// profRouter
//     .route("/lecture/newQuiz/:id")
//     .all(onlyIsLoggedIn)
//     .get(getNewQuiz)
//     .post(postOneQuiz);
profRouter.route("/lecture/:id").all(onlyIsLoggedIn).get(getOneLecture);
profRouter
    .route("/student")
    .all(onlyIsLoggedIn)
    .get(getAllStudents)

export default profRouter;
