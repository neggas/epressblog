const User = require("../models/user");
const { validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");

exports.getConnexion = (req, res, next) => {

    let message = req.flash("error");

    (message.length > 0) ? message = message[0]: message = null;
    res.render("user-auth/login.ejs", { errorMessage: message });
}

exports.postConnexion = async(req, res, next) => {

    const error = validationResult(req);


    if (!error.isEmpty()) {
        res.render("user-auth/login", { errorMessage: error.array()[0].msg });
    } else {

        try {
            const authData = req.body;
            const userDoc = await User.findOne({ email: authData.email });

            if (userDoc) {


                const isSame = await bcrypt.compare(authData.password, userDoc.password);
                if (isSame) {
                    req.session.isLoggedIn = true;
                    req.session.user = userDoc;

                    return req.session.save(err => {

                        if (err) console.log(err);
                        res.redirect("/blog");
                    })

                } else {

                    req.flash("error", "email ou mot de passe Invalide");
                    res.redirect("/connexion");
                }

            } else {
                req.flash("error", "Vous n'etes pas dans notre base donnes");
                return res.redirect("/connexion");
            }

        } catch (error) {
            console.log(`erreur ${error}`);
        }

    }

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

exports.getDeconnexion = (req, res, next) => {
    req.session.destroy(err => {
        res.redirect('/blog');
    })
}