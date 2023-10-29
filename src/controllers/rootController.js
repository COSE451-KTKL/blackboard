export const getHome = async (req, res) => {
    res.render("home", { pageTitle: "Home" });
};
