import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
    {
        lectureId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lecture",
            required: true,
        },
        quizProblem: { type: String, required: true },
        quizAnswer: { type: String, required: true },
    },
    { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;
