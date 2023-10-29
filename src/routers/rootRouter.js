import express from "express";


import { getHome } from "../controllers/rootController";

const rootRouter = express.Router();

rootRouter.route("/").get(getHome);


export default rootRouter;
