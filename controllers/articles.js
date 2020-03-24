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
        res.render("blog_views.ejs", { article: article });

    } catch (e) {
        console.log(e);
    }




};

exports.getCommentArticles = (req, res) => {
    res.render("blog_comment");
};

exports.postCommentArticles = (req, res) => {};