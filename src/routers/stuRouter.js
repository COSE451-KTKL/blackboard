import express from "express";
import { onlyIsLoggedIn, onlyIsLoggedOut } from "../middleware";

const stuRouter = express.Router();

export default stuRouter;
