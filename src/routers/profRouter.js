import express from "express";
import { onlyIsLoggedIn, onlyIsLoggedOut } from "../middleware";

const profRouter = express.Router();

export default profRouter;
