const authSecure = (req, res, next) => {
    if (req.session.isLoggedIn) {
        next();
    } else {
        res.redirect("/connexion");
    }
}

module.exports = authSecure;