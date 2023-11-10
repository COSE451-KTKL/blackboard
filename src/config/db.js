import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017", {
    useNewUrlParser: true,
});

const db = mongoose.connection;

const handleOpen = () => console.log("✅ DB connected");
const handleError = (error) => console.log("❌ DB connection failed", error);

db.on("error", handleError);
db.once("open", handleOpen);
