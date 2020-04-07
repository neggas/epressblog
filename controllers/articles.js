const Article = require('../models/article');
const mongoose = require('mongoose');

exports.getArticles = async(req, res) => {

    try {
        const articles = await Article.find()

        if (articles)
            res.render("index.ejs", { articles: articles });
    } catch (e) {
        console.log("erreur " + e);
    }

};

exports.readArticles = async(req, res) => {

    try {


        const articleId = req.params.id;
        const article = await Article.findOne({ _id: articleId });
        res.render("blog_views.ejs", { article });

    } catch (e) {
        console.log(e);
    }

};

exports.getCommentArticles = async(req, res) => {
    try {

        const articleId = req.params.id;
        const article = await Article.findOne({ _id: articleId });
        res.render("blog_comment", { article: article });

    } catch (error) {
        console.log(error);
    }
};

exports.postCommentArticles = async(req, res) => {

    try {

        const commentaire = req.body.commentaire;
        const date = new Date();

        const time = {
            month: date.getMonth(),
            day: date.getDay(),
            year: date.getUTCFullYear()

        }

        if (commentaire && commentaire !== '') {

            //creation d'objet commentaire
            const commentObject = { commentaire, time, user: req.session.user.pseudo }

            //on accede a un commentaire grace a son id
            const articleId = req.params.id;
            const article = await Article.findOne({ _id: articleId });

            let currentComments = [...article.comments];
            currentComments.push(commentObject);

            await Article.findByIdAndUpdate({ _id: articleId }, { comments: currentComments });
            return res.redirect(`/blog/${articleId}`);
        } else {

            req.flash("commetError", "Vous tentez d'envoyer un commentaire vide")
            return res.redirect('/blog' + req.url);
        }

    } catch (err) {
        console.error(err);
    }

};