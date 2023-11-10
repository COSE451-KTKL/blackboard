import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import Lecture from "../models/Lecture";

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
});

const db = mongoose.connection;

const handleOpen = async () => {
  console.log("✅ DB connected");
  const lectures = await Lecture.find({});
  try {
    for (const lecture of lectures) {
      const lectureDir = path.join("uploads", "lectures", lecture.lectureName);
      fs.mkdirSync(lectureDir, { recursive: true });
    }
  } catch (err) {
    console.log(err);
  }
  console.log("db sync complete");
};
const handleError = (error) => console.log("❌ DB connection failed", error);

db.on("error", handleError);
db.once("open", handleOpen);
