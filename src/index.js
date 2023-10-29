import "dotenv/config";
import express from "express";
import "./config/db";
import rootRouter from "./routers/rootRouter";

const app = express();

const PORT = 4000;

app.listen(PORT, () => {
    console.log(`✅ ${PORT}번 포트에 서버 연결됨`);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.use("/", rootRouter);
