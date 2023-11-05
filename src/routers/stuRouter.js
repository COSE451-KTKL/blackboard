import express from "express";

import {
  getSugang,
  postSugang,
  getAllLectures,
  getOneLecture,
  postOneQuiz,
} from "../controllers/stuController";
import { onlyIsLoggedIn, isStu } from "../middleware";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "./uploads/temp";
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "_" + Math.round(Math.random() * 1000);
    cb(null, "file_" + unique + ".txt");
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "text/plain") {
    cb(null, true);
  } else {
    cb(new Error("Not a .txt file"), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

const stuRouter = express.Router();

//apply middleware to all users
stuRouter.use(onlyIsLoggedIn, isStu);

stuRouter.route("/sugang").get(getSugang).post(postSugang);
stuRouter.route("/lecture").get(getAllLectures);
//apply middelware to store the txt file to the uploads/temp
stuRouter
  .route("/lecture/:id")
  .get(getOneLecture)
  .post(upload.single("txtFile"), postOneQuiz);

export default stuRouter;
