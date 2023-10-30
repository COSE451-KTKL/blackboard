import Lecture from "../models/Lecture";
import User from "../models/User";
import Quiz from "../models/Quiz";

const updateLoggedInUser = async (req, user) => {
    req.session.loggedInUser = user;
    return;
};
