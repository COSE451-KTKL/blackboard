import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
    {
        profId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        stuIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        lectureName: { type: String, required: true },
        noticeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notice" }],
        quizId: {type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
    },
    { timestamps: true }
);

const Lecture = mongoose.model("Lecture", lectureSchema);
export default Lecture;
