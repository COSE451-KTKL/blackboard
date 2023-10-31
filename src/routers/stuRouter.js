import express from "express";

import {
  getSugang,
  postSugang,
  getAllLectures,
  getOneLecture,
  postOneQuiz,
} from "../controllers/stuController";
import { onlyIsLoggedIn, isStu } from "../middleware";

const stuRouter = express.Router();

//apply middleware to all users
stuRouter.use(onlyIsLoggedIn, isStu);

stuRouter.route("/sugang").get(getSugang).post(postSugang);
stuRouter.route("/lecture").get(getAllLectures);
stuRouter
  .route("/lecture/:id")

  .get(getOneLecture)
  .post(postOneQuiz);

export default stuRouter;
