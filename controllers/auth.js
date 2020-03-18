const User = require("../models/user");
const { validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");

exports.getConnexion = (req, res, next) => {
    res.render("user-auth/login.ejs");
}

exports.postConnexion = (req, res, next) => {


}

exports.getInscription = (req, res, next) => {

    let message = req.flash('error');

    (message.length > 0) ? message = message[0]: message = null;

    res.render("user-auth/signup", { errorMessage: message });
}

exports.postInscription = async(req, res, next) => {

    const userData = req.body;

    const erros = validationResult(req);

    if (!erros.isEmpty()) {
        res.render("user-auth/signup", { errorMessage: erros.array()[0].msg });
    } else {

        try {
            const userDoc = await User.find({ email: userData.email });
            if (userDoc.length > 0) {
                req.flash("error", "l'email existe deja ");
                return res.redirect("/inscription")
            }

            const encryptedPass = await bcrypt.hash(userData.password, 12);
            const user = new User({
                email: userData.email,
                password: encryptedPass,
                pseudo: userData.pseudo
            });

            const done = await user.save();

            if (done) {
                res.redirect('/connexion');
            }

        } catch (err) {
            console.log(err);
        }




    }
}