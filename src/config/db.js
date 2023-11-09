import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
});

const db = mongoose.connection;

const handleOpen = () => console.log("✅ DB connected");
const handleError = (error) => console.log("❌ DB connection failed", error);

db.on("error", handleError);
db.once("open", handleOpen);
