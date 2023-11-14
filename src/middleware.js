export const saveSessionToLocal = (req, res, next) => {
  res.locals.isLoggedIn = Boolean(req.session.isLoggedIn);
  res.locals.loggedInUser = req.session.loggedInUser;
  next();
};
export const onlyIsLoggedIn = (req, res, next) => {
  if (req.session.isLoggedIn) {
    return next();
  } else {
    return res.redirect("/auth/login");
  }
};

export const isProf = (req, res, next) => {
  if (req.session.loggedInUser.userType != "professor") {
    return res.redirect("/stu/lecture");
  } else {
    return next();
  }
};

export const isStu = (req, res, next) => {
  if (req.session.loggedInUser.userType != "student") {
    return res.redirect("/prof/lecture");
  } else {
    return next();
  }
};

export const onlyIsLoggedOut = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return next();
  } else {
    return res.redirect("/");
  }
};
