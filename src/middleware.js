export const saveSessionToLocal = (req, res, next) => {
    res.locals.isLoggedIn = Boolean(req.session.isLoggedIn);
    res.locals.loggedInUser = req.session.loggedInUser;
    next();
};
