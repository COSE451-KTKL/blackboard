import express from "express";

import authRouter from "./authRouter";
import stuRouter from "./stuRouter";
import profRouter from "./profRouter";

import { getHome } from "../controllers/rootController";

const rootRouter = express.Router();

rootRouter.route("/").get(getHome);

rootRouter.use("/auth", authRouter);
rootRouter.use("/stu", stuRouter);
rootRouter.use("/prof", profRouter);

export default rootRouter;
