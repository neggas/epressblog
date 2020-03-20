exports.getArticles = (req, res) => {
    res.render("index.ejs");
}

exports.readArticles = (req, res) => {
    res.render("blog_views.ejs");
}

exports.getCommentArticles = (req, res) => {
    res.render("blog_comment");
}

exports.postCommentArticles = (req, res) => {



}