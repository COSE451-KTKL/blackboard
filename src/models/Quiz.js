import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
    {
        profId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        problem: { type: String, required: true },
        answer: { type: String, required: true },
    },
    { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;
