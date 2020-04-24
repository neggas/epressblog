const User = require("../models/user");
const Article = require("../models/article");
const { validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");

exports.getConnexion = (req, res, next) => {
    let message = req.flash("error");

    message.length > 0 ? (message = message[0]) : (message = null);
    res.render("user-auth/login.ejs", { errorMessage: message });
};

exports.getAdmin = (req, res) => {
    let error = req.flash("errorAdmin");
    if (req.session.Admin) {
        res.redirect("admin/dashboard");
    } else {
        res.render("admin-auth/login", { error: error });
    }
};

exports.pageRemoveArticle = (req, res) => {
    AdminConnect(req, res);
    let artId = req.params.id;
    res.render("admin-auth/remove", {
        artId: artId,
        infoUser: req.session.Admin
    });
};

exports.removeArticle = async(req, res) => {
    AdminConnect(req, res);
    let del = await Article.deleteOne({ _id: req.params.id });
    if (del) {
        res.redirect("/admin/dashboard");
    }
};

exports.getaddArticle = (req, res) => {
    AdminConnect(req, res);
    res.render("admin-auth/add", {
        infoUser: req.session.Admin,
        error: req.flash("errorAdd")
    });
};

exports.postaddArticle = async(req, res) => {
    AdminConnect(req, res);
    if (req.body.titre != "" && req.body.article != "") {
        if (req.file != undefined) {
            let art = new Article({
                titre: req.body.titre,
                article: req.body.article,
                comments: {},
                image: req.file.filename
            });

            let addArt = await art.save();
            if (addArt) {
                res.redirect("/admin/dashboard");
            } else {
                req.flash("errorAdd", "not add");
                res.redirect("/admin/add");
            }
        } else {
            req.flash("errorAdd", "veuillez selectionné une image");
            res.redirect("/admin/add");
        }
    } else {
        req.flash("errorAdd", "tout les champs sont obligatoires");
        res.redirect("/admin/add");
    }
};

exports.postModArticle = async(req, res) => {
    AdminConnect(req, res);
    let art = req.body;
    let modArt = await Article.updateOne({ _id: req.params.id }, { $set: { titre: art.titre, article: art.article } });

    if (modArt) {
        res.redirect("/admin/dashboard");
    } else {
        res.render("/admin/mod/" + req.params.id, { error: "not modified" });
    }
};

exports.getModArticle = async(req, res, next) => {
    AdminConnect(req, res);
    try {
        let article = await Article.findOne({ _id: req.params.id });
        if (Article) {
            res.render("admin-auth/mod", {
                article: article,
                infoUser: req.session.Admin
            });
        } else {
            res.render("admin/dashboard");
        }
    } catch (e) {
        res.redirect("/admin/dashboard");
    }
};

exports.getDashboard = async(req, res) => {
    AdminConnect(req, res);
    let allArticle = await Article.find({});
    return res.render("admin-auth/dashboard", {
        infoUser: req.session.Admin,
        articles: allArticle
    });
};

exports.getAdminDeconnexion = (req, res) => {
    req.session.Admin = undefined;
    res.redirect("/admin-connect");
};

exports.postAdmin = async(req, res, next) => {
    try {
        let authAdmin = req.body;

        if (authAdmin.pseudo && authAdmin.password) {
            if (authAdmin.pseudo.toUpperCase() == "ADMIN") {
                let admin = await User.findOne({ pseudo: authAdmin.pseudo });

                if (admin) {
                    let same = await bcrypt.compare(authAdmin.password, admin.password);
                    if (same) {
                        req.session.Admin = {
                            pseudo: admin.pseudo,
                            connected: true
                        };
                        res.redirect("/admin/dashboard");
                    } else {
                        req.flash("errorAdmin", "password incorrect");
                        res.redirect("/admin-connect");
                    }
                } else {
                    let encryptedPass = await bcrypt.hash(authAdmin.password, 12);
                    let createAdmin = new User({
                        email: "admin@contact.ci",
                        password: encryptedPass,
                        pseudo: authAdmin.pseudo
                    });

                    let done = await createAdmin.save();
                    if (done) {
                        res.redirect("/admin/dashboard");
                    }
                }
            }
        } else {
            req.flash("errorAdmin", "veuillez remplir les champs");
            res.redirect("/admin-connect");
        }
    } catch (err) {
        console.log(err);
    }
};

exports.postConnexion = async(req, res, next) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
        res.render("user-auth/login", { errorMessage: error.array()[0].msg });
    } else {
        try {
            const authData = req.body;
            const userDoc = await User.findOne({ email: authData.email });

            if (userDoc) {
                const isSame = await bcrypt.compare(
                    authData.password,
                    userDoc.password
                );
                if (isSame) {
                    req.session.isLoggedIn = true;
                    req.session.user = userDoc;

                    return req.session.save(err => {
                        console.log(err);

                        res.redirect("/");
                    });
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
};

exports.getInscription = (req, res, next) => {
    let message = req.flash("error");

    message.length > 0 ? (message = message[0]) : (message = null);

    res.render("user-auth/signup", { errorMessage: message });
};

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
                return res.redirect("/inscription");
            }

            const encryptedPass = await bcrypt.hash(userData.password, 12);
            const user = new User({
                email: userData.email,
                password: encryptedPass,
                pseudo: userData.pseudo
            });

            const done = await user.save();

            if (done) {
                res.redirect("/connexion");
            }
        } catch (err) {
            console.log(err);
        }
    }
};

exports.getDeconnexion = (req, res, next) => {
    req.session.destroy(err => {
        res.redirect("/");
    });
};

function AdminConnect(req, res) {
    if (!req.session.Admin) {
        res.redirect("/admin-connect");
    }
}