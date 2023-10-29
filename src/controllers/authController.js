const loginUserToSession = (req, user) => {
    req.session.isLoggedIn = true;
    req.session.loggedInUser = user;
};
