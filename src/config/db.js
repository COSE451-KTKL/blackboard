import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
});

const db = mongoose.connection;

const handleOpen = () => console.log("✅ DB 연결 성공");
const handleError = (error) => console.log("❌ DB 연결 실패", error);

db.on("error", handleError);
db.once("open", handleOpen);
